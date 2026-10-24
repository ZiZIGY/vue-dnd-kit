/**
 * Rubber-band selection (rfcs/0001-v3.md §4.5): a press on the empty space of an area
 * draws a rectangle, and the draggables it crosses are selected by id.
 *
 * The rectangle lives in the area's content coordinates (origin at the padding edge,
 * scroll offset included). The anchor therefore stays on the content when the area or
 * the page scrolls, and `style` places the rectangle with `position: absolute` inside
 * the area, which needs a non-static `position` (e.g. `relative`).
 */

import { computed, isReactive, onScopeDispose, shallowRef, watch } from 'vue';
import { defaultWindow, useEventListener } from '@vueuse/core';
import type {
  Active,
  Coordinates,
  DragItem,
  Key,
  MaybeElementRef,
  Rect,
  SelectionAreaOptions,
  SelectionAreaReturn,
} from '../types';
import type { DnDManager, DraggableEntry } from './manager';
import { useDnDContext } from './context';
import { matchesRule } from './accept';
import { createRect, getLayoutRect, offsetRect } from '../animation/layout';
import { isInsideInteractive, parentOf, toElement } from '../utils/dom';
import { read } from '../utils/read';

export type SelectionStrategy = NonNullable<SelectionAreaOptions['strategy']>;
export type SelectionModifier = NonNullable<SelectionAreaOptions['modifier']>;

// ─── Geometry and strategies (pure) ────────────────────────────────────────────

/** Where an area's content sits in the viewport and how far it is scrolled. */
export interface ContentBox {
  /** Viewport position of the padding edge, i.e. of content point (scrollLeft, scrollTop). */
  left: number;
  top: number;
  scrollLeft: number;
  scrollTop: number;
  /** Size of the scrollable content. */
  width: number;
  height: number;
}

export const measureContentBox = (element: Element): ContentBox => {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left + element.clientLeft,
    top: rect.top + element.clientTop,
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop,
    width: element.scrollWidth,
    height: element.scrollHeight,
  };
};

/** Viewport point → content coordinates of the area. */
export const toContentPoint = (point: Coordinates, box: ContentBox): Coordinates => ({
  x: point.x - box.left + box.scrollLeft,
  y: point.y - box.top + box.scrollTop,
});

/** Content rect → viewport rect. */
export const toViewportRect = (rect: Rect, box: ContentBox): Rect =>
  offsetRect(rect, box.left - box.scrollLeft, box.top - box.scrollTop);

const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max);

/** The band between two content points, clamped to the content. */
export const getBandRect = (
  anchor: Coordinates,
  current: Coordinates,
  bounds: Pick<ContentBox, 'width' | 'height'>,
): Rect => {
  const left = clamp(Math.min(anchor.x, current.x), bounds.width);
  const top = clamp(Math.min(anchor.y, current.y), bounds.height);
  const right = clamp(Math.max(anchor.x, current.x), bounds.width);
  const bottom = clamp(Math.max(anchor.y, current.y), bounds.height);
  return createRect(left, top, right - left, bottom - top);
};

/** Overlap test: touching edges don't count, a zero-width band crossing an item does. */
export const intersects = (a: Rect, b: Rect): boolean =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/**
 * Selection for the current band. `hits` holds every item measured during this band
 * (`true` when inside it); items never measured keep their state, so the ids of
 * unmounted rows survive.
 * - `toggle`: XOR against the selection at band start;
 * - `select`: of the measured items, only those inside the band.
 */
export const applyStrategy = (
  strategy: SelectionStrategy,
  base: ReadonlySet<Key>,
  hits: ReadonlyMap<Key, boolean>,
): Set<Key> => {
  const next = new Set(base);
  for (const [id, hit] of hits) {
    if (strategy === 'select' ? hit : base.has(id) !== hit) next.add(id);
    else next.delete(id);
  }
  return next;
};

type ModifierState = Pick<MouseEvent, 'shiftKey' | 'ctrlKey' | 'altKey' | 'metaKey'>;

const FLAGS: Record<string, keyof ModifierState> = {
  Shift: 'shiftKey',
  Control: 'ctrlKey',
  Alt: 'altKey',
  Meta: 'metaKey',
};

/**
 * Whether `key` is held: a `KeyboardEvent.key` (`'Shift'`, `'Meta'`, `'a'`) or `.code`
 * (`'ControlLeft'`, `'KeyA'`). Modifiers come from the pointer event itself, so a key
 * released while the window was blurred never counts as held.
 */
export const isKeyHeld = (
  key: string,
  event: ModifierState,
  pressed: ReadonlySet<string>,
): boolean => {
  const flag = FLAGS[key];
  if (flag) return event[flag];
  const side = /^(Shift|Control|Alt|Meta)(Left|Right)$/.exec(key);
  if (side) return event[FLAGS[side[1]!]!] && pressed.has(key);
  return pressed.has(key);
};

export const matchesModifier = (
  modifier: SelectionModifier | undefined,
  held: (key: string) => boolean,
): boolean => {
  if (!modifier?.keys.length) return true;
  return modifier.method === 'some' ? modifier.keys.some(held) : modifier.keys.every(held);
};

// ─── Areas ─────────────────────────────────────────────────────────────────────

/** Area elements per provider: the innermost area owns a press and the items in it. */
const registries = new WeakMap<DnDManager, Set<Element>>();

const areasOf = (manager: DnDManager): Set<Element> => {
  let areas = registries.get(manager);
  if (!areas) registries.set(manager, (areas = new Set()));
  return areas;
};

const closestArea = (element: Element | null, areas: ReadonlySet<Element>): Element | null => {
  for (let node = element; node; node = parentOf(node)) {
    if (areas.has(node)) return node;
  }
  return null;
};

const isWithin = (element: Element, ancestor: Element): boolean => {
  for (let node = parentOf(element); node; node = parentOf(node)) {
    if (node === ancestor) return true;
  }
  return false;
};

/** A press on the area's own scrollbar scrolls; it must not draw a band. */
const isOnScrollbar = (element: HTMLElement, event: PointerEvent): boolean => {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left - element.clientLeft;
  const y = event.clientY - rect.top - element.clientTop;
  return x > element.clientWidth || y > element.clientHeight;
};

const suppressNextClick = () => {
  const stop = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  window.addEventListener('click', stop, { capture: true, once: true });
  setTimeout(() => window.removeEventListener('click', stop, { capture: true }), 0);
};

const syncSet = (target: Set<Key>, next: ReadonlySet<Key>) => {
  for (const id of [...target]) if (!next.has(id)) target.delete(id);
  for (const id of next) if (!target.has(id)) target.add(id);
};

const sameSet = (a: ReadonlySet<Key>, b: ReadonlySet<Key>) =>
  a.size === b.size && [...a].every((id) => b.has(id));

/** Movement (px) below which a press counts as a click, not a band. */
const CLICK_TOLERANCE = 3;

interface Band {
  element: HTMLElement;
  pointerId: number;
  /** Start point in content coordinates: it stays on the content while things scroll. */
  anchor: Coordinates;
  origin: Coordinates;
  /** Latest pointer position in the viewport. */
  pointer: Coordinates;
  strategy: SelectionStrategy;
  base: Set<Key>;
  hits: Map<Key, boolean>;
  moved: boolean;
  frame: number;
  stops: Array<() => void>;
}

/**
 * Makes an element a rubber-band selection area for the draggables inside it.
 * Render the rectangle yourself: `<div v-if="isSelecting" class="band" :style="style" />`.
 */
export function makeSelectionArea(
  target: MaybeElementRef,
  options: SelectionAreaOptions = {},
): SelectionAreaReturn {
  const manager = useDnDContext();
  const areas = areasOf(manager);
  const getElement = () => toElement(target);

  const selecting = shallowRef(false);
  const rect = shallowRef<Rect | null>(null);
  const pressed = new Set<string>();
  let band: Band | null = null;

  const readSelection = (): ReadonlySet<Key> => options.selection?.value ?? manager.selection;

  const writeSelection = (next: ReadonlySet<Key>) => {
    const selection = options.selection;
    if (!selection) return syncSet(manager.selection, next);
    const current = selection.value;
    if (sameSet(current, next)) return;
    // Mutate a reactive Set in place (per-id updates); a shallowRef needs a new Set.
    if (isReactive(current)) syncSet(current, next);
    else selection.value = new Set(next);
  };

  const accepts = (entry: DraggableEntry, element: HTMLElement, itemRect: Rect): boolean => {
    const rule = options.accept;
    if (rule == null || rule === '*') return true;
    const item: DragItem = { id: entry.id, data: undefined, type: entry.getTypes() };
    // Only a function rule reads data; skip the lookups for type rules.
    if (typeof rule === 'function') {
      item.data = entry.getData();
      item.item = entry.getItem?.();
    }
    const active: Active = {
      id: entry.id,
      ids: [entry.id],
      items: [item],
      data: item.data,
      type: item.type,
      element,
      rect: itemRect,
      sensor: 'pointer',
    };
    return matchesRule(rule, { active, items: [item], types: item.type });
  };

  const update = () => {
    const current = band;
    if (!current) return;
    current.frame = 0;
    const area = current.element;

    // Reads first, in one pass: the area box, then every item rect.
    const box = measureContentBox(area);
    const next = getBandRect(current.anchor, toContentPoint(current.pointer, box), box);
    const viewportBand = toViewportRect(next, box);
    for (const entry of manager.getDraggables()) {
      const element = entry.getElement();
      if (!element?.isConnected || element === area) continue;
      // Outside this area, or owned by a nested one.
      if (closestArea(parentOf(element), areas) !== area) continue;
      if (entry.isDisabled()) continue;
      const itemRect = getLayoutRect(element);
      if (!itemRect.width && !itemRect.height) continue;
      if (!accepts(entry, element, itemRect)) continue;
      current.hits.set(entry.id, intersects(viewportBand, itemRect));
    }

    rect.value = next;
    writeSelection(applyStrategy(current.strategy, current.base, current.hits));
  };

  const schedule = () => {
    if (band && !band.frame) band.frame = requestAnimationFrame(update);
  };

  /** Ends the band: `commit` keeps the selection and fires `onSelected`, otherwise it is restored. */
  const end = (commit: boolean) => {
    const current = band;
    if (!current) return;
    if (current.frame) cancelAnimationFrame(current.frame);
    current.frame = 0;
    if (commit) update();
    else writeSelection(current.base);

    band = null;
    current.stops.forEach((stop) => stop());
    if (document.body.hasPointerCapture?.(current.pointerId)) {
      document.body.releasePointerCapture(current.pointerId);
    }
    selecting.value = false;
    rect.value = null;
    if (manager.status.value === 'selecting') manager.status.value = 'idle';
    if (!commit) return;

    if (current.moved) suppressNextClick();
    try {
      options.onSelected?.([...readSelection()]);
    } catch (error) {
      console.error(error);
    }
  };

  const cancel = () => end(false);

  const onPointerMove = (event: PointerEvent) => {
    const current = band;
    if (!current || event.pointerId !== current.pointerId) return;
    current.pointer = { x: event.clientX, y: event.clientY };
    const { x, y } = current.origin;
    if (Math.hypot(current.pointer.x - x, current.pointer.y - y) > CLICK_TOLERANCE) {
      current.moved = true;
    }
    schedule();
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!band || event.pointerId !== band.pointerId) return;
    band.pointer = { x: event.clientX, y: event.clientY };
    end(true);
  };

  const onPointerCancel = (event: PointerEvent) => {
    if (band && event.pointerId === band.pointerId) cancel();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const keyboard = manager.props.keyboard || undefined;
    if (!(keyboard?.keys?.cancel ?? ['Escape']).includes(event.code)) return;
    event.preventDefault();
    cancel();
  };

  const preventDefault = (event: Event) => event.preventDefault();

  const begin = (area: HTMLElement, event: PointerEvent) => {
    const point = { x: event.clientX, y: event.clientY };
    const current: Band = {
      element: area,
      pointerId: event.pointerId,
      anchor: toContentPoint(point, measureContentBox(area)),
      origin: point,
      pointer: point,
      strategy: options.strategy ?? 'toggle',
      base: new Set(readSelection()),
      hits: new Map(),
      moved: false,
      frame: 0,
      stops: [],
    };
    band = current;
    manager.status.value = 'selecting';
    selecting.value = true;
    document.getSelection()?.removeAllRanges();
    current.stops.push(
      useEventListener(document, 'pointermove', onPointerMove),
      useEventListener(document, 'pointerup', onPointerUp),
      useEventListener(document, 'pointercancel', onPointerCancel),
      // Capture catches scrolling of any container, the page included.
      useEventListener(document, 'scroll', schedule, { capture: true, passive: true }),
      useEventListener(window, 'resize', schedule, { passive: true }),
      useEventListener(document, 'keydown', onKeyDown, { capture: true }),
      useEventListener(document, 'selectstart', preventDefault),
      useEventListener(document, 'dragstart', preventDefault),
    );
    try {
      document.body.setPointerCapture(event.pointerId);
    } catch {
      // The pointer may already be gone; document listeners still work.
    }
    update();
  };

  const onPointerDown = (event: PointerEvent) => {
    const area = getElement();
    if (!area || band || manager.status.value !== 'idle') return;
    if (!event.isPrimary || event.button !== 0 || read(options.disabled)) return;
    const origin = event.composedPath()[0];
    if (!(origin instanceof Element)) return;
    // The innermost area owns the press; items, controls and scrollbars keep theirs.
    if (closestArea(origin, areas) !== area) return;
    const found = manager.findDraggable(origin);
    if (found && isWithin(found.element, area)) return;
    if (isInsideInteractive(origin, area)) return;
    if (origin === area && isOnScrollbar(area, event)) return;
    if (!matchesModifier(options.modifier, (key) => isKeyHeld(key, event, pressed))) return;
    begin(area, event);
  };

  useEventListener(getElement, 'pointerdown', onPointerDown);

  // Keys that aren't modifier flags (e.g. `'KeyA'`) are tracked while the area lives.
  if ('modifier' in options) {
    useEventListener(defaultWindow, 'keydown', (event: KeyboardEvent) => {
      pressed.add(event.key);
      pressed.add(event.code);
    });
    useEventListener(defaultWindow, 'keyup', (event: KeyboardEvent) => {
      pressed.delete(event.key);
      pressed.delete(event.code);
    });
    useEventListener(defaultWindow, 'blur', () => pressed.clear());
  }

  // Tracked separately: the template ref may already be cleared when the scope is disposed.
  let registered: Element | null = null;
  watch(
    getElement,
    (element) => {
      if (registered) areas.delete(registered);
      registered = element;
      if (element) areas.add(element);
      if (band && band.element !== element) cancel();
    },
    { immediate: true, flush: 'post' },
  );

  watch(
    () => !!read(options.disabled),
    (disabled) => disabled && cancel(),
  );

  manager.selectionAborts.add(cancel);
  onScopeDispose(() => {
    cancel();
    manager.selectionAborts.delete(cancel);
    if (registered) areas.delete(registered);
    registered = null;
  });

  const style = computed((): Record<string, string> => {
    const value = rect.value;
    if (!value) return { display: 'none' };
    return {
      position: 'absolute',
      left: `${value.left}px`,
      top: `${value.top}px`,
      width: `${value.width}px`,
      height: `${value.height}px`,
      boxSizing: 'border-box',
      pointerEvents: 'none',
    };
  });

  return { isSelecting: computed(() => selecting.value), style };
}
