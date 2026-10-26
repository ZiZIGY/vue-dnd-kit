/**
 * The mini-map: every list, tree and drop target of the page, with the items in it, as
 * the tab draws them. A frame tells where things are (rects in page coordinates) and what
 * the drag makes of them (the placeholder, the target under the pointer, who accepts, the
 * insertion line); the looks are copies of the elements, made with the library's clone
 * (`clonePreview`, what the overlay shows) and sent once (`copies`), with the page's CSS.
 *
 * A zone is copied as a shell: the zone element without its items, inside empty copies of
 * its ancestors (`display: contents`), so that selectors like `.board .card` still match
 * the copies the tab puts in it.
 */

import type { Key } from '@vue-dnd-kit/core';
import { clonePreview, type DevtoolsProvider, type GroupSnapshot, type ProviderSnapshot } from '@vue-dnd-kit/core/devtools';
import type { ItemFrame, MapFrame, Rect, ZoneFrame } from '../protocol';

/** A copy is made again (when its element changed) at most this often, and never during a drag. */
const COPY_FRESH_FOR = 1000;
/** Copies longer than this are boxes with the item's key instead. */
const MAX_COPY = 60_000;
/** Most items drawn per zone, and zones per page. */
const MAX_ITEMS = 200;
const MAX_ZONES = 60;
/** Ancestors copied around a zone's shell. */
const MAX_ANCESTORS = 24;

const rectOf = (element: Element): Rect => {
  const { left, top, width, height } = element.getBoundingClientRect();
  return { x: Math.round(left), y: Math.round(top), w: Math.round(width), h: Math.round(height) };
};

/** Attributes a copied ancestor keeps: what selectors match (classes, data and scoped-style attributes). */
const kept = (name: string) => name === 'class' || name === 'dir' || name === 'role' || (name.startsWith('data-') && !name.startsWith('data-dnd-'));

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const openTag = (element: Element, style: string) => {
  const attributes = element
    .getAttributeNames()
    .filter(kept)
    .map((name) => ` ${name}="${escape(element.getAttribute(name)!)}"`)
    .join('');
  return `<${element.localName}${attributes} style="${escape(style)}">`;
};

/** The zone without its items, inside empty copies of its ancestors. */
const shellHtml = (zone: Element): string => {
  const ancestors: Element[] = [];
  for (let parent = zone.parentElement; parent && parent !== document.body && ancestors.length < MAX_ANCESTORS; parent = parent.parentElement) {
    ancestors.unshift(parent);
  }
  const computed = getComputedStyle(zone);
  const value = (property: string) => computed.getPropertyValue(property);
  const border = value('border-top-width');
  const own = [
    'position: relative',
    'display: block',
    'margin: 0',
    'padding: 0',
    'overflow: hidden',
    'transform: none',
    'box-sizing: border-box',
    'border: none',
    ...['background-color', 'background-image', 'border-radius', 'color', 'font-family', 'font-size']
      .filter((property) => value(property))
      .map((property) => `${property}: ${value(property)}`),
    // Its border as an outline inside: the items are placed from its border box.
    ...(border ? [`outline: ${border} ${value('border-top-style')} ${value('border-top-color')}`, `outline-offset: -${border}`] : []),
  ].join('; ');
  const open = ancestors.map((element) => openTag(element, 'display: contents')).join('');
  const close = ancestors
    .reverse()
    .map((element) => `</${element.localName}>`)
    .join('');
  return `${open}${openTag(zone, own).replace(/>$/, ' data-devtools-zone>')}</${zone.localName}>${close}`;
};

/**
 * What the copies inherit in the page and not in the tab's shadow roots: the body's font
 * and color, and the custom properties of the root (`:root` matches no shadow root).
 */
const pageRoot = (): string => {
  const root = getComputedStyle(document.documentElement);
  const body = getComputedStyle(document.body);
  const declarations = ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color'].map(
    (property) => `${property}: ${body.getPropertyValue(property)};`,
  );
  for (let index = 0; index < root.length; index++) {
    const property = root.item(index);
    if (property.startsWith('--')) declarations.push(`${property}: ${root.getPropertyValue(property)};`);
  }
  return `:host { ${declarations.join(' ')} }`;
};

export interface Frames {
  /** The frame of `providers`, with the copies it needs that weren't sent yet. */
  frame(providers: DevtoolsProvider[], snapshots: Map<DevtoolsProvider, ProviderSnapshot>, dragging: boolean, selected: Key | null): {
    frame: MapFrame;
    copies: Array<[number, string]>;
  };
  /** What the overlay shows now, copied; `null` without one. */
  overlay(snapshot: ProviderSnapshot): { html: string; size: { w: number; h: number } } | null;
  /** The page's CSS, when it changed since the last call (`null`: unchanged). */
  styles(): string | null;
  /** A tab joined: every copy and the CSS are sent again. */
  resend(): void;
}

export function createFrames(): Frames {
  let ids = 0;
  /** Copy id → html, for the copies of the last frames. */
  const html = new Map<number, string>();
  /** Copies the tabs have. */
  const known = new Set<number>();
  /** Element → its copy (an item's, a zone's shell), and what it was made from. */
  type Cache = WeakMap<Element, { id: number; source: string; at: number }>;
  const itemCopies: Cache = new WeakMap();
  const shellCopies: Cache = new WeakMap();
  /** Copies the frame being built shows. */
  let shown = new Set<number>();
  let signature = '';

  const itemHtml = (element: Element, id: Key) => {
    const copy = element instanceof HTMLElement ? clonePreview(element, { opaque: true }).outerHTML : '';
    return copy && copy.length <= MAX_COPY ? copy : `<div data-devtools-box>${escape(String(id))}</div>`;
  };

  /**
   * The copy of an element: made once, and again when the element changed (looked at
   * every `COPY_FRESH_FOR` ms, never during a drag). `source` tells a change.
   */
  const copyOf = (copies: Cache, element: Element, refresh: boolean, source: () => string, make: () => string): number => {
    const cached = copies.get(element);
    const now = performance.now();
    if (cached && html.has(cached.id) && (!refresh || now - cached.at < COPY_FRESH_FOR)) return show(cached.id);
    const next = source();
    if (cached && html.has(cached.id) && cached.source === next) {
      cached.at = now;
      return show(cached.id);
    }
    const id = ++ids;
    html.set(id, make());
    copies.set(element, { id, source: next, at: now });
    return show(id);
  };
  const show = (id: number) => {
    shown.add(id);
    return id;
  };

  const itemCopy = (element: Element, id: Key, refresh: boolean) =>
    copyOf(itemCopies, element, refresh, () => element.outerHTML, () => itemHtml(element, id));
  // A shell changes with the zone's own attributes and its ancestors' classes.
  const shellCopy = (zone: Element, refresh: boolean) => {
    const made = () => shellHtml(zone);
    return copyOf(shellCopies, zone, refresh, made, made);
  };

  /** The copies the frame shows that the tabs don't have; the others are forgotten. */
  const unsent = (): Array<[number, string]> => {
    const sent: Array<[number, string]> = [];
    for (const id of shown) {
      if (known.has(id)) continue;
      known.add(id);
      sent.push([id, html.get(id)!]);
    }
    for (const id of html.keys()) {
      if (shown.has(id)) continue;
      html.delete(id);
      known.delete(id);
    }
    shown = new Set();
    return sent;
  };

  /** The insertion line of a group, as a thin rect along the edge of its item. */
  const indicatorOf = (provider: DevtoolsProvider, snapshot: ProviderSnapshot, group: GroupSnapshot): MapFrame['indicator'] => {
    const line = group.indicator;
    const list = line && group.lists.find((entry) => entry.id === line.list);
    if (!line || !list?.element) return null;
    const item = line.key == null ? null : snapshot.draggables.find((entry) => entry.id === line.key)?.element;
    const box = rectOf(item ?? list.element);
    const across = list.strategy === 'vertical' || list.kind === 'tree';
    if (line.side === 'inside') return { provider: provider.id, list: list.id, rect: box };
    const end = line.side === 'after' || (!item && line.index > 0);
    const rect = across
      ? { x: box.x, y: end ? box.y + box.h - 1 : box.y - 1, w: box.w, h: 2 }
      : { x: end ? box.x + box.w - 1 : box.x - 1, y: box.y, w: 2, h: box.h };
    return { provider: provider.id, list: list.id, rect };
  };

  return {
    frame(providers, snapshots, dragging, selected) {
      const zones: ZoneFrame[] = [];
      let indicator: MapFrame['indicator'] = null;
      let pointer: MapFrame['pointer'] = null;
      let overlay: Rect | null = null;
      const refresh = !dragging;

      for (const provider of providers) {
        const snapshot = snapshots.get(provider)!;
        const { session } = snapshot;
        const overId = session.over?.id;
        const placed = new Set<Key>();
        const item = (entry: ProviderSnapshot['draggables'][number]): ItemFrame | null => {
          if (!entry.element?.isConnected) return null;
          placed.add(entry.id);
          const placeholder = !!session.active && (session.landingKey ?? session.active.id) === entry.id;
          return {
            id: entry.id,
            rect: rectOf(entry.element),
            copy: itemCopy(entry.element, entry.id, refresh),
            placeholder: placeholder || session.landings.some(([slot]) => slot === entry.id),
            dragging: entry.dragging,
            selected: entry.selected || entry.id === selected,
            disabled: entry.disabled,
          };
        };
        const items = (entries: ProviderSnapshot['draggables']) =>
          entries.slice(0, MAX_ITEMS).map(item).filter((entry): entry is ItemFrame => !!entry);

        const lists = snapshot.groups.flatMap((group) => group.lists);
        for (const list of lists) {
          if (!list.element?.isConnected) continue;
          const order = new Map((list.draft ?? list.keys).map((key, index) => [key, index]));
          const own = snapshot.draggables
            .filter((entry) => entry.list === list.id)
            .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
          zones.push({
            provider: provider.id,
            id: list.id,
            kind: list.kind,
            rect: rectOf(list.element),
            shell: shellCopy(list.element, refresh),
            over: overId === list.id,
            accepting: list.accepting,
            disabled: list.disabled,
            items: items(own),
          });
        }
        const listElements = lists.map((list) => list.element).filter((element): element is HTMLElement => !!element);
        const free = snapshot.draggables.filter((entry) => entry.list == null && entry.element);
        for (const droppable of snapshot.droppables) {
          const element = droppable.element;
          // Drop targets inside a list (into an item) show in the list's copy.
          if (droppable.sortable || !element?.isConnected || listElements.some((list) => list.contains(element))) continue;
          const inside = free.filter((entry) => element.contains(entry.element));
          zones.push({
            provider: provider.id,
            id: droppable.id,
            kind: 'droppable',
            rect: rectOf(element),
            shell: shellCopy(element, refresh),
            over: overId === droppable.id,
            accepting: droppable.accepting,
            disabled: droppable.disabled,
            items: items(inside),
          });
        }
        // Plain draggables outside every zone: one zone around them all.
        const loose = free.filter((entry) => !placed.has(entry.id));
        if (loose.length) {
          const frames = items(loose);
          const left = Math.min(...frames.map((entry) => entry.rect.x));
          const top = Math.min(...frames.map((entry) => entry.rect.y));
          const right = Math.max(...frames.map((entry) => entry.rect.x + entry.rect.w));
          const bottom = Math.max(...frames.map((entry) => entry.rect.y + entry.rect.h));
          zones.push({
            provider: provider.id,
            id: null,
            kind: 'free',
            rect: { x: left, y: top, w: right - left, h: bottom - top },
            shell: 0,
            over: false,
            accepting: null,
            disabled: false,
            items: frames,
          });
        }
        if (session.status !== 'idle' && session.active) {
          pointer = session.pointer;
          if (session.overlayElement?.isConnected) overlay = rectOf(session.overlayElement);
          for (const group of snapshot.groups) indicator ??= indicatorOf(provider, snapshot, group);
        }
      }
      return { frame: { zones: zones.slice(0, MAX_ZONES), pointer, overlay, indicator }, copies: unsent() };
    },

    overlay(snapshot) {
      const element = snapshot.session.overlayElement;
      if (!snapshot.session.active || !element?.isConnected) return null;
      const { w, h } = rectOf(element);
      return { html: clonePreview(element).outerHTML, size: { w, h } };
    },

    styles() {
      const sheets = [...document.styleSheets];
      const rules = (sheet: CSSStyleSheet) => {
        try {
          return [...sheet.cssRules];
        } catch {
          // Another origin's sheet: the tab imports it.
          return null;
        }
      };
      // Vite's hot updates rewrite the text of a <style>; other sheets change by their rules.
      const next = sheets
        .map((sheet) => `${sheet.href ?? ''}:${rules(sheet)?.length ?? 'x'}:${sheet.ownerNode?.textContent?.length ?? 0}`)
        .join('|');
      if (next === signature) return null;
      signature = next;
      const text = sheets
        .map((sheet) => {
          const list = rules(sheet);
          if (list) return list.map((rule) => rule.cssText).join('\n');
          return sheet.href ? `@import url("${sheet.href}");` : '';
        })
        .join('\n');
      return `${text}\n${pageRoot()}`;
    },

    resend() {
      known.clear();
      signature = '';
    },
  };
}
