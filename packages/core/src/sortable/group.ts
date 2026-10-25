/**
 * A sortable group: lists that exchange items. Holds the draft order of every list
 * during a drag, projects the pointer onto it, commits the result on drop, and runs
 * FLIP for every change it causes.
 *
 * A drop is computed once, as the new items of every list it changes (`result`), and
 * goes through `onBeforeDrop`, then `onDrop`, then the write (the default action, which
 * `preventDefault()` skips: the user applies `result`), then the reset of the drafts.
 * The FLIP pass of that reset animates whatever the sources hold by then.
 *
 * The active slot is a key in the drafts. Usually it is the active item itself; when
 * copying it is the item's copy, and for a plain draggable from outside it is the
 * item `createItem` made. Projection, commit and FLIP only ever deal with that key.
 *
 * Multi-drag `'group'`: the other dragged items travel with the slot as a block,
 * contiguous in the draft and in drop order. Projection and keyboard moves count the
 * block once (`viewOf`), and every move takes the whole block along.
 */

import { effectScope, nextTick, type ShallowRef } from 'vue';
import type {
  Active,
  Announcements,
  BeforeDropResult,
  Coordinates,
  DnDEndEvent,
  DnDEvent,
  DragItem,
  DragMode,
  Key,
  KeyboardMoveContext,
  MaybePromise,
  Rect,
  SortableDropEvent,
  SortableIndicator,
} from '../types';
import type { DnDManager } from '../core/manager';
import {
  createRect,
  getCenter,
  getLayoutRect,
  getRect,
} from '../animation/layout';
import {
  createContext,
  indexMap as mapOf,
  indexOf as indexIn,
  indicesOf as indicesIn,
  keysOf,
  listOf as listIn,
  listOfKey as listOfKeyIn,
  lookup as lookupIn,
  orderedLists as orderedIn,
  sameKeys,
  spotIn as spotInCtx,
  type Session,
} from './context';
import type { DraftContext, ListEntry } from './entry';
import { bump as bumpFlip, captureLayout, watchLayout } from './flip';
import {
  nextRowIndex,
  pickAdjacent,
  projectIndex,
  projectIndicator,
  projectSwap,
  type IndicatorProjection,
  type ProjectionItem,
} from './projection';
import {
  HYSTERESIS,
  blocksKey,
  blocksList,
  distance,
  neighbourKeys,
  passedKeys,
  settleHysteresis,
} from './stability';
import { collapseIntoOverlay } from './multiple';
import { ColumnPreview, layoutColumn } from './column';
import { landOverlayItems } from '../animation/drop';
import { trackCopyModifier } from './modifier';
import { revealElement } from '../core/autoscroll';
import { isFocusLost } from '../utils/dom';
import { sortableTexts, type SortableSpot, type SortableSubject } from './announcements';
import { bandsAt as bandsIn, intoPoint as intoPointIn, isInto as isIntoIn, targetRule } from './combine';
import {
  accepts as acceptsIn,
  canSwap as canSwapIn,
  createdIn,
  isInert,
  isSwapping as isSwappingIn,
  itemTypes,
  partition as partitionIn,
} from './accept';

export interface DropResult {
  next: Map<ListEntry, Key[]>;
  /** The new items of each list in `next` (`build`): the event's `result`, what the write puts. */
  built: Map<ListEntry, unknown[]>;
  /** Keys put at the slot of the target list (`event.to.list`). */
  inserted: Key[];
  event: SortableDropEvent;
}

/** A drop event before its list results are built. */
type DropFacts = Omit<SortableDropEvent, 'result' | 'preventDefault' | 'defaultPrevented'>;

export interface SortableGroup {
  name: string;
  manager: DnDManager;
  session: ShallowRef<Session | null>;
  /** Insertion line of `placeholder: 'indicator'` lists, while the pointer is over one. */
  indicator: ShallowRef<SortableIndicator | null>;
  /** Shows the insertion line (trees move it with their own keys). */
  showIndicator(value: SortableIndicator | null): void;
  addList(entry: ListEntry): () => void;
  registerItem(key: Key, getElement: () => HTMLElement | null): () => void;
  lookup(key: Key): unknown;
  keysOf(list: ListEntry): Key[];
  /** `list`'s draft as projection counts it: a multi-drag block once, as the slot. */
  viewOf(list: ListEntry): Key[];
  indexOf(list: ListEntry, key: Key): number;
  accepts(list: ListEntry, active: Active): boolean;
  /** The current drag can never enter this list (another group, or a plain draggable it can't create items for). */
  isInert(list: ListEntry): boolean;
  /** Where the lead's clone sits in the overlay, from the pointer (see `leadOffset`). */
  leadOffset(): Coordinates;
  captureLayout(): void;
}

/** Bundlers replace it: development builds keep the warnings, production drops them. */
declare const process: { env: { NODE_ENV?: string } };

const registries = new WeakMap<DnDManager, Map<string, SortableGroup>>();

const isPromise = <T>(value: MaybePromise<T>): value is Promise<T> =>
  !!value && typeof (value as Promise<T>).then === 'function';

/** `keys` with `slot` moved (or inserted) to `index`, counted in `keys` as given. */
const placeAt = (keys: Key[], slot: Key, index: number): Key[] => {
  const position = keys.indexOf(slot);
  const result = position === -1 ? [...keys] : keys.filter((key) => key !== slot);
  const at = position !== -1 && position < index ? index - 1 : index;
  result.splice(Math.max(0, Math.min(at, result.length)), 0, slot);
  return result;
};

/** `view` (a draft counting the block once, as `slot`) with the whole block in the slot's place. */
const expand = (view: Key[], slot: Key, block: Key[]): Key[] =>
  block.length > 1 ? view.flatMap((key) => (key === slot ? block : [key])) : view;

const INDICATOR_FIELDS = ['list', 'index', 'key', 'side', 'depth', 'parentKey'] as const;

const sameIndicator = (a: SortableIndicator | null, b: SortableIndicator | null) =>
  a === b || (!!a && !!b && INDICATOR_FIELDS.every((field) => a[field] === b[field]));

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const NO_OFFSET: Coordinates = { x: 0, y: 0 };

function createGroup(manager: DnDManager, name: string, release: () => void): SortableGroup {
  const g = createContext(manager, name);
  const { lists, items, session, indicator } = g;
  const scope = effectScope(true);

  const listOf = (id: Key | null) => listIn(g, id);
  const spotIn = (list: Key, index: number) => spotInCtx(g, list, index);
  const indexMap = (keys: readonly Key[]) => mapOf(g, keys);
  const indicesOf = (list: ListEntry) => indicesIn(g, list);
  const indexOf = (list: ListEntry, key: Key) => indexIn(g, list, key);
  const lookup = (key: Key) => lookupIn(g, key);
  const listOfKey = (key: Key, useDraft: boolean) => listOfKeyIn(g, key, useDraft);
  const orderedLists = () => orderedIn(g);
  const bump = () => bumpFlip(g);
  const partition = (list: ListEntry, current: Session) => partitionIn(g, list, current);
  const accepts = (list: ListEntry, active: Active) => acceptsIn(g, list, active);
  const isSwapping = (current: Session, list: ListEntry | undefined) => isSwappingIn(g, current, list);
  const canSwap = (current: Session, list: ListEntry, partner: Key) => canSwapIn(g, current, list, partner);
  const bandsAt = (event: DnDEvent) => bandsIn(g, event);
  const isInto = (event: DnDEvent) => isIntoIn(g, event);
  const intoPoint = (key: Key, list: ListEntry, active: Active) => intoPointIn(g, key, list, active);

  scope.run(() => {
    watchLayout(g);
    g.copyHeld = trackCopyModifier(manager, () => manager.scheduleFrame());
  });

  // ─── Session ─────────────────────────────────────────────────────────────────

  const copyOf = (current: Session, key: Key): Key | null => {
    if (!current.copies.has(key)) {
      const made = listOf(current.sources.get(key)?.list ?? null)?.clone?.(lookup(key));
      current.copies.set(key, made ? made.key : null);
      if (made) current.items.set(made.key, made.item);
    }
    return current.copies.get(key) ?? null;
  };

  const wantsCopy = (current: Session) => {
    const origin = listOf(current.origin.list);
    if (current.external || !origin?.clone) return false;
    return origin.pull() === 'clone' || g.copyHeld();
  };

  /** Dragged key a slot stands for: the original of a copy, otherwise the key itself. */
  const originalOf = (current: Session, key: Key): Key => {
    if (current.copying) for (const [original, copy] of current.copies) if (copy === key) return original;
    return key;
  };

  /** Sets where the other dragged items land (slot → dragged id), keeping the map when nothing changed. */
  const setLandings = (entries: Array<[Key, Key]>) => {
    const previous = manager.landings.value;
    if (previous.size === entries.length && entries.every(([slot, id]) => previous.get(slot) === id)) return;
    manager.landings.value = new Map(entries);
  };

  /** Spacing between items of `list` along `axis`, from its CSS `gap`. */
  const gapOf = (list: ListEntry, axis: 'x' | 'y'): number => {
    const element = list.getElement();
    if (!element) return 0;
    const style = getComputedStyle(element);
    return parseFloat(axis === 'y' ? style.rowGap : style.columnGap) || 0;
  };

  /** Ids in the overlay's column, in drop order: the active node goes right after the tree node it rides in. */
  const columnIds = (current: Session): Key[] =>
    current.lead === current.activeKey
      ? current.keys
      : current.keys.flatMap((key) => (key === current.lead ? [key, current.activeKey] : [key]));

  /**
   * The default overlay of a multi-drag that isn't `'stack'`: every item in drop order,
   * in a column along the list holding the slot (a row in horizontal lists and grids:
   * consecutive grid items sit side by side), with that list's gap.
   */
  const syncColumn = (current: Session) => {
    if (current.stacked) return;
    const ids = columnIds(current);
    if (ids.length < 2) return;
    const list = listOf(current.list ?? current.origin.list);
    if (!list || list.id === g.columnList) return;
    g.columnList = list.id;
    const axis = list.strategy() === 'vertical' ? 'y' : 'x';
    manager.overlayColumn.value = {
      ids,
      axis,
      gap: gapOf(list, axis),
      animation: list.animation(),
      preview: ColumnPreview,
      land: landOverlayItems,
    };
  };

  /** Mirrors the session into the manager: overlay `mode`, where the overlay lands, the placeholders of a block. */
  const syncManager = () => {
    const current = session.value;
    if (!current) return;
    const placed = current.list != null;
    // The overlay lands on a copy or a created item; on the active item's own element
    // otherwise, also when it rides in the lead: the drop shows it again inside it.
    manager.landingKey.value = placed && current.slot !== current.lead ? current.slot : null;
    // Placeholders of the others: a block's, and the lead's when it isn't the active item
    // (its clone rides in the overlay's column too).
    const carrier = current.lead !== current.activeKey;
    setLandings(
      placed && (current.grouped || carrier)
        ? current.block
            .filter((key) => key !== current.slot || carrier)
            .map((key) => [key, originalOf(current, key)])
        : [],
    );
    syncColumn(current);
    let mode: DragMode = 'move';
    if (current.external) mode = placed ? 'insert' : 'move';
    else if (current.copying) mode = 'copy';
    else if (isSwapping(current, listOf(current.list))) mode = 'swap';
    manager.mode.value = mode;
  };

  /**
   * Where the lead's clone sits in the overlay, from the pointer: nowhere else than under
   * it, unless the grabbed node rides in another one (a tree), whose clone shows before
   * it in the column. Projection places the slot by that point, so the block lines up
   * with the column (the pointer holds the grabbed row inside it), and keyboard moves put
   * the pointer that far from the slot.
   */
  const leadOffset = (current: Session): Coordinates => {
    const active = manager.active.value;
    const column = manager.overlayColumn.value;
    if (current.lead === current.activeKey || !active || !column) return NO_OFFSET;
    const items = manager.previewIds.map((id) => ({ id, size: manager.getPreview(id)!.rect }));
    const box = manager.fitSize.value ?? active.rect;
    const source = manager.getPreview(active.id)?.rect ?? active.rect;
    const cell = layoutColumn(items, active.id, box, source, column.axis, column.gap).find((at) => at.id === current.lead);
    return cell ? { x: cell.x, y: cell.y } : NO_OFFSET;
  };

  /** `event` with the pointer at the lead's clone, for projection (see `leadOffset`). */
  const atLead = (current: Session, event: DnDEvent): DnDEvent => {
    const offset = leadOffset(current);
    if (offset === NO_OFFSET) return event;
    return { ...event, pointer: { x: event.pointer.x + offset.x, y: event.pointer.y + offset.y } };
  };

  /**
   * What travels with the slot into `target`: the slot alone, or in multi-drag `'group'`
   * every dragged key in drop order. A list taking only some of them (`group.put` with
   * `acceptMode: 'some'`) gets those, if the lead is one: the rest stay where they
   * started, as the drop would leave them. Copies when copying.
   */
  const blockFor = (current: Session, target: ListEntry | undefined): Key[] => {
    if (!current.grouped) return [current.slot];
    let keys = current.keys;
    if (target) {
      const { accepted } = partition(target, current);
      if (accepted.length < keys.length && accepted.includes(current.lead)) keys = accepted;
    }
    if (!current.copying) return keys;
    return keys.map((key) => copyOf(current, key)).filter((key): key is Key => key != null);
  };

  /** `list`'s draft as projection and keyboard moves count it: a block once, as the slot. */
  const viewOf = (list: ListEntry, current: Session): Key[] => {
    const keys = keysOf(list);
    if (current.block.length < 2 || current.list !== list.id) return keys;
    const members = new Set(current.block);
    return keys.filter((key) => key === current.slot || !members.has(key));
  };

  /**
   * Inserts the dragged `key` into `keys` (a draft of its source `list`) where it started:
   * after its nearest original predecessor that is there and isn't in `moving`.
   */
  const putBack = (keys: Key[], list: ListEntry, key: Key, index: number, moving: ReadonlySet<Key>) => {
    const original = list.getKeys();
    let at = 0;
    for (let i = index - 1; i >= 0; i--) {
      const previous = original[i]!;
      if (moving.has(previous)) continue;
      const position = keys.indexOf(previous);
      if (position !== -1) {
        at = position + 1;
        break;
      }
    }
    keys.splice(at, 0, key);
  };

  const start = (event: DnDEvent) => {
    const activeKey = event.active.id;
    // Drags that don't involve this group leave it untouched (no snapshot of its lists).
    if (!listOfKey(activeKey, false) && ![...lists.values()].some((list) => list.create)) return;
    const ordered = orderedLists();
    const snapshot = new Map<Key, unknown>();
    const sources = new Map<Key, { list: Key; index: number }>();
    for (const list of ordered) {
      list.getKeys().forEach((key, index) => {
        snapshot.set(key, list.getItem(key));
        sources.set(key, { list: list.id, index });
      });
    }
    const common = {
      activeKey,
      lock: null,
      items: snapshot,
      size: { width: event.active.rect.width, height: event.active.rect.height },
      result: null,
      sources,
      copies: new Map<Key, Key | null>(),
      created: new Map<Key, Key | null>(),
      swap: null,
      indicator: null,
      marker: null,
      hysteresis: null,
      target: null,
      removed: false,
      prevented: false,
      stop: null,
    };

    if (!sources.has(activeKey)) {
      // A plain draggable: only lists with `createItem` take part.
      if (!ordered.some((list) => list.create)) return;
      const base = new Map<Key, Key[]>();
      for (const list of lists.values()) {
        const draft = [...list.getKeys()];
        list.draft.value = list.prepareDraft?.(draft, { lead: activeKey, keys: [activeKey], copying: false }) ?? draft;
        base.set(list.id, list.draft.value);
      }
      g.spokenSpot = null;
      g.columnList = null;
      session.value = {
        ...common,
        lead: activeKey,
        keys: [activeKey],
        origin: { list: null, index: -1 },
        slot: activeKey,
        list: null,
        others: new Set(),
        stacked: false,
        grouped: false,
        block: [activeKey],
        base,
        external: true,
        copying: false,
      };
      syncManager();
      bump();
      return;
    }

    const order = (key: Key) => {
      const source = sources.get(key)!;
      return ordered.findIndex((list) => list.id === source.list) * 1e9 + source.index;
    };
    let keys = event.active.ids.filter((key) => sources.has(key)).sort((a, b) => order(a) - order(b));
    // A selected tree node inside another selected one travels in its subtree, not on its
    // own. The grabbed one too (as in VS Code): the node it rides in leads the drag, and
    // the grabbed node stays inside it, under the pointer.
    const ridesIn = new Map<Key, Key>();
    for (const list of ordered) list.carried?.(keys).forEach((carrier, key) => ridesIn.set(key, carrier));
    if (ridesIn.size) keys = keys.filter((key) => !ridesIn.has(key));
    const lead = ridesIn.get(activeKey) ?? activeKey;
    const origin = sources.get(lead)!;
    const originList = lists.get(origin.list)!;

    // Multi-drag ids may belong to unmounted rows or other groups (or ride inside others): keep ours only.
    const ids = [activeKey, ...keys.filter((key) => key !== activeKey)];
    if (!sameKeys(ids, event.active.ids)) {
      const dragItems: DragItem[] = ids.map((key) => ({
        id: key,
        item: snapshot.get(key),
        data: manager.getDraggable(key)?.getData(),
        type: itemTypes(g, key),
      }));
      manager.updateActive({ ids, items: dragItems });
    }

    const others = new Set(keys.filter((key) => key !== lead));
    // Indicator lists don't move: their others stay in place whatever the mode.
    const multiple = others.size > 0 && originList.placeholder() === 'item' ? (originList.multiple?.() ?? 'stack') : null;
    const stacked = multiple === 'stack';
    const grouped = multiple === 'group';
    const base = new Map<Key, Key[]>();
    for (const list of lists.values()) {
      const source = list.getKeys();
      let draft = stacked || grouped ? source.filter((key) => !others.has(key)) : [...source];
      // The block forms around the lead: the others leave their places and join it in drop order.
      if (grouped && list === originList) draft = expand(draft, lead, keys);
      base.set(list.id, list.prepareDraft?.(draft, { lead, keys, copying: false }) ?? draft);
    }
    const current: Session = {
      ...common,
      lead,
      keys,
      origin: { list: origin.list, index: origin.index },
      slot: lead,
      list: origin.list,
      others,
      stacked,
      grouped,
      block: grouped ? keys : [lead],
      base,
      external: false,
      copying: false,
    };
    session.value = current;
    g.columnList = null;
    // The pickup announcement names this position: the first target of the drag doesn't repeat it.
    const formed = base.get(origin.list)!;
    g.spokenSpot = grouped
      ? spotKey({ list: origin.list, index: formed.indexOf(keys[0]!), length: formed.length })
      : spotKey(spotIn(origin.list, origin.index));

    const copy = wantsCopy(current) ? copyOf(current, lead) : null;
    if (copy != null) {
      // Copying: the source stays as it is; the copy appears once a list is hovered.
      current.copying = true;
      current.slot = copy;
      current.list = null;
      current.block = blockFor(current, undefined);
      for (const list of lists.values()) list.draft.value = copyBase(list, current);
    } else {
      if (stacked) {
        const elements = [...others]
          .map((key) => items.get(key)?.())
          .filter((element): element is HTMLElement => !!element?.isConnected);
        collapseIntoOverlay(elements, event.active.rect, originList.animation());
      }
      g.gathering = grouped;
      for (const list of lists.values()) list.draft.value = base.get(list.id)!;
    }
    syncManager();
    bump();
  };

  /** What `prepareDraft` is told about `current`. */
  const draftContext = (current: Session): DraftContext => ({
    lead: current.lead,
    keys: current.keys,
    copying: current.copying,
  });

  /** Drafts while copying: every source as it is (nothing leaves). */
  const copyBase = (list: ListEntry, current: Session) => {
    const draft = [...list.getKeys()];
    return list.prepareDraft?.(draft, draftContext(current)) ?? draft;
  };

  /**
   * Moves the slot to `index` of `target`'s draft (counted as `viewOf` counts it),
   * removing it from the list that held it. A block moves along as one unit; entering a
   * list, the members before the slot go before `index`, so the block lines up with the
   * overlay's column around the pointer. `blockStart`: `index` is where the block starts.
   */
  const moveActive = (target: ListEntry, index: number, pointer: Coordinates | null, blockStart = false) => {
    const current = session.value!;
    const slot = current.slot;
    const from = listOf(current.list);
    let passed: Set<Key>;
    if (from === target) {
      const view = [...viewOf(from, current)];
      const position = view.indexOf(slot);
      if (position === -1 || position === index) return;
      passed = passedKeys(view, position, index);
      view.splice(position, 1);
      view.splice(index, 0, slot);
      from.draft.value = expand(view, slot, current.block);
    } else {
      const old = current.block;
      const block = blockFor(current, target);
      const leaving = new Set(old);
      // Keys put back while another list didn't take them join the block again.
      const joining = new Set(block.filter((key) => !leaving.has(key)));
      const before = keysOf(target);
      // Keys about to join don't count: the block starts `members before the slot` keys
      // ahead of `index`, before the first key from there that stays.
      let start = Math.min(index, before.length);
      for (let skip = blockStart ? 0 : block.indexOf(slot); skip > 0 && start > 0; ) {
        if (!joining.has(before[--start]!)) skip--;
      }
      let anchor: Key | null = null;
      for (let i = start; i < before.length; i++) {
        if (!joining.has(before[i]!)) {
          anchor = before[i]!;
          break;
        }
      }
      if (from) from.draft.value = keysOf(from).filter((key) => !leaving.has(key));
      if (joining.size) {
        for (const list of lists.values()) {
          const keys = keysOf(list);
          if (keys.some((key) => joining.has(key))) list.draft.value = keys.filter((key) => !joining.has(key));
        }
      }
      if (!current.copying) {
        // Keys this list doesn't take go back to where they started (copies just leave).
        const moving = new Set(block);
        const dropped = old
          .filter((key) => !moving.has(key))
          .map((key) => ({ key, source: current.sources.get(key) }))
          .sort((a, b) => (a.source?.index ?? 0) - (b.source?.index ?? 0));
        for (const { key, source } of dropped) {
          const list = source && lists.get(source.list);
          if (!list) continue;
          const keys = [...keysOf(list)];
          putBack(keys, list, key, source.index, moving);
          list.draft.value = keys;
        }
      }
      const keys = [...keysOf(target)];
      const at = anchor == null ? keys.length : keys.indexOf(anchor);
      passed = neighbourKeys(keys, at);
      keys.splice(at, 0, ...block);
      target.draft.value = keys;
      current.block = block;
      current.list = target.id;
    }
    current.hysteresis = pointer
      ? { keys: passed, list: from && from !== target ? from.id : null, at: pointer }
      : null;
    current.indicator = null;
    syncManager();
    bump();
    manager.announce('onDragOver');
  };

  /** Takes the slot (and its block) out of every draft (a copy over its palette, an external item leaving). */
  const removeSlot = () => {
    const current = session.value!;
    const list = listOf(current.list);
    if (!list) return;
    const block = new Set(current.block);
    list.draft.value = keysOf(list).filter((key) => !block.has(key));
    current.list = null;
    syncManager();
    bump();
  };

  /** Over a list that can't be sorted: the active item (and its block) goes back to where it started. */
  const returnToOrigin = (pointer: Coordinates | null) => {
    const current = session.value!;
    if (current.slot !== current.lead) return removeSlot();
    const origin = listOf(current.origin.list);
    const base = origin && current.base.get(origin.id);
    const start = base ? base.indexOf(current.lead) : -1;
    if (!origin || !base || start < 0) return;
    const members = new Set(current.grouped ? current.keys : []);
    members.delete(current.lead);
    if (current.list === origin.id) {
      // Counted as `viewOf` counts it: the block once.
      moveActive(origin, base.slice(0, start).filter((key) => !members.has(key)).length, pointer);
      return;
    }
    // From another list: before the key that followed the block at the start.
    const anchor = base.slice(start + 1).find((key) => !members.has(key));
    const keys = keysOf(origin);
    const index = anchor === undefined ? -1 : keys.indexOf(anchor);
    moveActive(origin, index === -1 ? keys.length : index, pointer, true);
  };

  /**
   * Mounted items of `list` with layout rects, in draft order. The block holding the
   * slot counts once (see `viewOf`): its other members share the slot's index and are
   * tagged with their side of it.
   */
  const collect = (list: ListEntry): ProjectionItem[] => {
    const indices = indicesOf(list);
    const current = session.value;
    const block = current && current.block.length > 1 && current.list === list.id ? current.block : null;
    const first = block ? (indices.get(block[0]!) ?? -1) : -1;
    const slot = block ? (indices.get(current!.slot) ?? -1) : -1;
    const found: Array<[number, ProjectionItem]> = [];
    for (const [key, getElement] of items) {
      const at = indices.get(key);
      if (at === undefined) continue;
      const element = getElement();
      // Clipped to the visible area; rows fully clipped (overscan) can't be targeted.
      const rect = element?.isConnected ? manager.measureVisible(element) : null;
      if (!rect) continue;
      let index = at;
      let side: -1 | 1 | undefined;
      if (first !== -1 && at >= first) {
        if (at >= first + block!.length) index = at - block!.length + 1;
        else {
          index = first;
          if (at !== slot) side = at < slot ? -1 : 1;
        }
      }
      found.push([at, side ? { key, index, rect, side } : { key, index, rect }]);
    }
    return found.sort((a, b) => a[0] - b[0]).map(([, item]) => item);
  };

  // ─── Indicator ───────────────────────────────────────────────────────────────

  const setIndicator = (value: SortableIndicator | null) => {
    if (sameIndicator(indicator.value, value)) return false;
    indicator.value = value;
    return true;
  };

  const showIndicator = (value: SortableIndicator | null) => {
    const current = session.value!;
    if (value) current.indicator = value;
    if (setIndicator(value) && value) manager.announce('onDragOver');
  };

  /** Indicator lists don't move: the slot stays (or goes back) where it started. */
  const keepSlotHome = (current: Session) => {
    if (current.slot !== current.lead) {
      if (current.list != null) removeSlot();
    } else if (current.list !== current.origin.list) {
      returnToOrigin(null);
    }
  };

  const updateIndicator = (target: ListEntry, event: DnDEvent) => {
    const current = session.value!;
    keepSlotHome(current);
    const items = collect(target);
    const lead = atLead(current, event);
    const result = target.indicate
      ? target.indicate(lead, items)
      : projectIndicator({
          strategy: target.strategy(),
          pointer: lead.pointer,
          items,
          activeKey: current.slot,
          length: keysOf(target).length,
          targets: bandsAt(event),
        });
    if (result !== undefined) showIndicator(result && { list: target.id, ...result });
  };

  // ─── Swap ────────────────────────────────────────────────────────────────────

  /**
   * Restores the drafts to the drag start, then exchanges the active item with `partner`:
   * each takes the other's place, in one list or across two.
   */
  const applySwap = (partner: Key | null, pointer: Coordinates | null) => {
    const current = session.value!;
    const previous = current.swap;
    for (const list of lists.values()) {
      const base = current.base.get(list.id);
      if (base && list.draft.value !== base) list.draft.value = base;
    }
    current.list = current.origin.list;
    const passed = new Set<Key>();
    if (previous != null) passed.add(previous);
    if (partner != null) {
      const own = lists.get(current.origin.list!)!;
      const other = [...lists.values()].find((list) => indexMap(current.base.get(list.id) ?? []).has(partner));
      if (other) {
        const a = [...current.base.get(own.id)!];
        const b = other === own ? a : [...current.base.get(other.id)!];
        const i = a.indexOf(current.activeKey);
        const j = b.indexOf(partner);
        a[i] = partner;
        b[j] = current.activeKey;
        own.draft.value = a;
        if (b !== a) other.draft.value = b;
        current.list = other.id;
        if (other === own) for (const key of passedKeys(a, i, j)) passed.add(key);
        passed.add(partner);
      }
    }
    current.swap = partner;
    current.hysteresis = pointer ? { keys: passed, list: null, at: pointer } : null;
    syncManager();
    bump();
    manager.announce('onDragOver');
  };

  /** The swap partner as the drop event tells it: it went to where the active item started. */
  const partnerOf = (current: Session, partner: Key): SortableDropEvent['partner'] => ({
    key: partner,
    item: lookup(partner),
    from: { ...current.sources.get(partner)! },
    to: { list: current.origin.list!, index: current.origin.index },
  });

  const updateSwap = (target: ListEntry, event: DnDEvent) => {
    const current = session.value!;
    const { partner, key } = projectSwap({
      strategy: target.strategy(),
      pointer: event.pointer,
      items: collect(target),
      activeKey: current.slot,
      partner: current.swap,
    });
    if (partner === undefined || blocksKey(current.hysteresis, key)) return;
    // An item that can't take the active item's place makes no exchange: hovering it reverts one.
    const next = partner != null && !canSwap(current, target, partner) ? null : partner;
    if (next !== current.swap) applySwap(next, event.pointer);
  };

  // ─── Copy ────────────────────────────────────────────────────────────────────

  /**
   * Switches between moving and copying mid-drag (copy modifier pressed or released).
   * The new slot (and block) takes the old one's place: after the nearest key that stays put.
   */
  const switchCopy = (copying: boolean) => {
    const current = session.value!;
    const slot = copying ? copyOf(current, current.lead) : current.lead;
    if (slot == null) return;
    const from = listOf(current.list);
    // Keys before the block that stay put, nearest first.
    let anchor: { list: ListEntry; after: Key[] } | null = null;
    if (from) {
      const keys = keysOf(from);
      const after = keys
        .slice(0, Math.max(keys.indexOf(current.block[0]!), 0))
        .reverse()
        .filter((key) => key !== current.lead && !current.others.has(key));
      anchor = { list: from, after };
    }
    current.copying = copying;
    current.slot = slot;
    current.swap = null;
    current.hysteresis = null;
    current.block = blockFor(current, anchor?.list ?? (copying ? undefined : listOf(current.origin.list)));
    const moving = new Set(current.block);
    for (const list of lists.values()) {
      let draft: Key[];
      if (copying) draft = copyBase(list, current);
      else if (!anchor) draft = current.base.get(list.id) ?? [...list.getKeys()];
      else {
        // A block's keys leave their sources; the ones the list doesn't take stay there.
        draft = (current.grouped ? list.getKeys() : (current.base.get(list.id) ?? list.getKeys())).filter((key) => !moving.has(key));
        // Moving again: a tree hides the subtrees that travel.
        draft = list.prepareDraft?.(draft, draftContext(current)) ?? draft;
      }
      list.draft.value = draft;
    }
    if (anchor) {
      const keys = [...keysOf(anchor.list)];
      // The nearest of them still shown (a tree hides the rows inside the moving nodes).
      const present = new Set(keys);
      const after = anchor.after.find((key) => present.has(key));
      const at = after === undefined ? 0 : keys.indexOf(after) + 1;
      keys.splice(at, 0, ...current.block);
      anchor.list.draft.value = keys;
      current.list = anchor.list.id;
    } else {
      current.list = copying ? null : current.origin.list;
    }
    syncManager();
    bump();
  };

  const syncCopy = (current: Session) => {
    if (current.external) return;
    const wanted = wantsCopy(current);
    if (wanted !== current.copying) switchCopy(wanted);
  };

  // ─── Move ────────────────────────────────────────────────────────────────────

  /** An external draggable's slot becomes the item `target` makes for it; `false` when it makes none. */
  const enter = (current: Session, target: ListEntry): boolean => {
    if (!current.external) return true;
    const created = createdIn(g, target, current);
    if (created == null) return false;
    if (current.slot !== created) {
      if (current.list != null) removeSlot();
      current.slot = created;
    }
    return true;
  };

  /** The pointer is over no list of this group (or one that refuses the drag). */
  const leave = (current: Session) => {
    setIndicator(null);
    if (current.swap != null) applySwap(null, null);
    if (current.external && current.list != null) removeSlot();
  };

  /** Extension hook: runs on every move over a valid target, guarded or not (trees update depth here). */
  const afterMove = (current: Session, event: DnDEvent) => {
    listOf(current.list)?.afterMove?.(event);
  };

  /**
   * A block that moved can leave the pointer over one of its members (items of other
   * sizes passed, the end of a list): project again once it has rendered, as the pointer
   * may not move again (WebKit delivers a whole glide within a frame or two, and a
   * release right after it runs the last frame inside the drop). Each pass steps toward
   * the pointer, so it ends within a pass per member.
   */
  const followBlock = (current: Session, event: DnDEvent) => {
    if (current.block.length < 2 || g.followed++ > current.block.length) return;
    const pass: Promise<void> = nextTick(() => {
      if (g.following === pass) g.following = null;
      if (session.value === current && manager.status.value !== 'idle' && manager.pointer.value === event.pointer) {
        move(event);
      }
    });
    g.following = pass;
  };

  /** Resolves once no `followBlock` pass is pending. */
  const settleBlock = async () => {
    while (g.following) await g.following;
  };

  const move = (event: DnDEvent) => {
    const current = session.value;
    if (!current || current.activeKey !== event.active.id) return;
    if (event.pointer !== g.movedAt) {
      g.movedAt = event.pointer;
      g.followed = 0;
    }
    // Keyboard drags move the slot in getKeyboardCoordinates. Trees (`project`) answer
    // the keyboard themselves and keep the pointer path below (in indicator mode they
    // move the line themselves), and so does an external item outside the lists: its
    // own keyboard moves (pixels, droppables) may take it in.
    if (event.active.sensor === 'keyboard' && (!current.external || current.list != null || indicator.value)) {
      const list = current.list == null ? undefined : lists.get(current.list);
      if (!list?.project || list.placeholder() === 'indicator' || indicator.value) return afterMove(current, event);
    }
    syncCopy(current);
    // No frame is ever skipped: the target follows pointer movement only, so a skipped
    // frame that carried the final position would leave the slot stale until the
    // pointer moves again (WebKit delivers a whole glide within a frame or two). The
    // frame after a cross-list move is safe without a guard: the FLIP pass invalidates
    // measurements post-flush, and the manager's target stabilizer plus the list
    // hysteresis below keep a layout shift from bouncing the item back.
    current.hysteresis = settleHysteresis(current.hysteresis, event.pointer);

    const over = event.over;
    if (!over) {
      // Last valid target: a pointer a few pixels past a list boundary keeps it.
      if (current.target && distance(event.pointer, current.target.at) < HYSTERESIS) return afterMove(current, event);
      current.target = null;
      return leave(current);
    }
    const target = lists.get(over.id);
    if (!target || !over.accepted || target.isDisabled()) {
      current.target = null;
      return leave(current);
    }
    // The list the slot just left can't take it back until the pointer moves on.
    const blocked = target.id !== current.list && blocksList(current.hysteresis, target.id);
    // Lists with `project` (trees) keep projecting while blocked: depth changes without a reorder.
    if (blocked && !target.project) return afterMove(current, event);
    if (!blocked) current.target = { list: target.id, at: event.pointer };

    // Each list makes its own item for an external draggable.
    if (!blocked && !enter(current, target)) return leave(current);

    if (target.placeholder() === 'indicator') {
      updateIndicator(target, event);
      return afterMove(current, event);
    }
    setIndicator(null);
    if (isSwapping(current, target)) {
      updateSwap(target, event);
      return afterMove(current, event);
    }
    if (current.swap != null) applySwap(null, null);

    const sameList = target.id === current.list;
    // `sort: false`: items can enter the list but not move inside it; back over its
    // own origin list the item returns to where it started (palettes).
    if (!target.canSort()) {
      if (!sameList && target.id === current.origin.list) {
        if (!blocked) returnToOrigin(event.pointer);
        return afterMove(current, event);
      }
      if (sameList && !target.project) return afterMove(current, event);
    }

    const keys = viewOf(target, current);
    const projectionItems = collect(target);
    const activeIndex = sameList ? keys.indexOf(current.slot) : -1;
    const lead = atLead(current, event);
    let index: number | null;
    let trigger: Key | null = null;
    if (target.project) {
      index = target.project(lead, { keys, items: projectionItems, activeKey: current.slot, activeIndex });
      // A list that can't sort still projects (tree depth), but keeps its order.
      if (sameList && !target.canSort()) index = null;
    } else {
      const projection = projectIndex({
        strategy: target.strategy(),
        pointer: lead.pointer,
        items: projectionItems,
        activeKey: current.slot,
        activeIndex,
        length: keys.length,
        lock: current.lock,
        targets: bandsAt(event),
      });
      current.lock = projection.lock;
      index = projection.index;
      trigger = projection.key;
    }
    if (index != null && !blocked && !blocksKey(current.hysteresis, trigger)) {
      moveActive(target, index, event.pointer);
      followBlock(current, event);
    }
    afterMove(current, event);
  };

  // ─── Drop ────────────────────────────────────────────────────────────────────

  /**
   * Builds the new items of every list in `next` (what the write would put there) and
   * the drop event around them: its `result`, and `preventDefault()` for the session.
   */
  const dropResult = (current: Session, next: Map<ListEntry, Key[]>, inserted: Key[], facts: DropFacts): DropResult => {
    const built = new Map<ListEntry, unknown[]>();
    for (const [list, keys] of next) built.set(list, list.build(keys, lookup, list.id === facts.to.list ? inserted : []));
    const event: SortableDropEvent = {
      ...facts,
      result: new Map([...built].map(([list, items]) => [list.id, items])),
      preventDefault: () => {
        current.prevented = true;
      },
      get defaultPrevented() {
        return current.prevented;
      },
    };
    return { next, built, inserted, event };
  };

  /**
   * The new order of every list that changes. `accepted` limits the moved keys
   * (partial accept); `marker` is the indicator to insert at (`placeholder: 'indicator'`).
   */
  const computeResult = (
    accepted: ReadonlySet<Key> | null,
    marker: SortableIndicator | null,
  ): DropResult | null => {
    const current = session.value!;
    const slot = current.slot;
    const drafts = new Map<ListEntry, Key[]>();
    for (const list of lists.values()) drafts.set(list, keysOf(list));
    let target = listOf(current.list);
    if (marker) {
      const list = lists.get(marker.list);
      if (list) {
        if (target && target !== list) drafts.set(target, drafts.get(target)!.filter((key) => key !== slot));
        drafts.set(list, placeAt(drafts.get(list)!, slot, marker.index));
        target = list;
      }
    }
    if (!target) return null;

    const allowed = accepted ?? new Set(partition(target, current).accepted);
    const moved = current.keys.filter((key) => allowed.has(key));
    const rejected = current.keys.filter((key) => !allowed.has(key));
    const moving = !current.copying && !current.external;
    let insert: Key[];
    if (current.external) insert = moved.length ? [slot] : [];
    else if (current.copying) insert = moved.map((key) => copyOf(current, key)).filter((key): key is Key => key != null);
    else insert = moved;
    // Everything but the slot leaves its place: the rest of a block, and when moving every
    // dragged key (in 'gaps' mode and indicator lists they are still where they started).
    // The slot then makes room for what is inserted; rejected keys go back below.
    const strip = new Set(current.block);
    if (moving) for (const key of current.keys) strip.add(key);
    strip.delete(slot);
    const back = moving
      ? rejected
          .map((key) => ({ key, source: current.sources.get(key)! }))
          .sort((a, b) => a.source.index - b.source.index)
      : [];
    const settled = new Set(moved);

    const next = new Map<ListEntry, Key[]>();
    for (const [list, draft] of drafts) {
      let keys = draft.filter((key) => !strip.has(key));
      keys = list === target ? keys.flatMap((key) => (key === slot ? insert : [key])) : keys.filter((key) => key !== slot);
      // Rejected keys fly back to where they started: after their nearest original
      // predecessor that is still in the list and stays (other keys may have left it).
      for (const { key, source } of back) if (source.list === list.id) putBack(keys, list, key, source.index, settled);
      const changed = list.hasChanges
        ? list.hasChanges(keys, list === target ? insert : [])
        : !sameKeys(keys, list.getKeys());
      if (changed) next.set(list, keys);
    }
    if (!next.size) return null;
    const finalKeys = next.get(target) ?? target.getKeys();
    const inserted = (key: Key): Key =>
      current.external ? slot : current.copying ? (current.copies.get(key) ?? key) : key;
    let mode: DragMode = 'move';
    if (current.external) mode = 'insert';
    else if (current.copying) mode = 'copy';
    else if (current.swap != null) mode = 'swap';
    return dropResult(current, next, insert, {
      keys: current.keys,
      items: current.keys.map((key) => lookup(inserted(key))),
      accepted: moved,
      rejected,
      from: { ...current.origin },
      to: { list: target.id, index: insert.length ? finalKeys.indexOf(insert[0]!) : -1 },
      sameList: current.origin.list === target.id,
      mode,
      ...(mode === 'swap' && { partner: partnerOf(current, current.swap!) }),
    });
  };

  /**
   * Trash zones, `e.source.remove()` and `dropOutside: 'remove'`: the dragged items (those
   * accepted) leave their lists. The event goes to the list the drag started in.
   */
  const computeRemoval = (accepted: readonly Key[]): DropResult | null => {
    const current = session.value!;
    if (current.copying || current.external || current.origin.list == null) return null;
    const gone = new Set(accepted);
    const next = new Map<ListEntry, Key[]>();
    for (const list of lists.values()) {
      const source = list.getKeys();
      const keys = source.filter((key) => !gone.has(key));
      if (list.hasChanges ? list.hasChanges(keys, []) : keys.length !== source.length) next.set(list, keys);
    }
    if (!next.size) return null;
    return dropResult(current, next, [], {
      keys: current.keys,
      items: current.keys.map(lookup),
      accepted: current.keys.filter((key) => gone.has(key)),
      rejected: current.keys.filter((key) => !gone.has(key)),
      from: { ...current.origin },
      to: { list: current.origin.list, index: -1 },
      sameList: true,
      mode: 'move',
    });
  };

  /**
   * The default action of a drop: every list it changes takes its new items. All or
   * none: a read-only source among them (one the user didn't take the drop for, with
   * `preventDefault()`) blocks the others too, or items would be lost or duplicated.
   */
  const write = (result: DropResult) => {
    const blocked = [...result.next.keys()].filter((list) => list.isReadonly());
    if (blocked.length) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[vue-dnd-kit] A drop wasn't written: \`items\` is read-only (a getter, a readonly ref or a computed) in ${blocked.map((list) => `"${String(list.id)}"`).join(', ')}. Call \`event.preventDefault()\` in onBeforeDrop or onDrop and apply \`event.result\` yourself.`,
        );
      }
      return;
    }
    for (const [list, keys] of result.next) {
      list.commit(result.built.get(list)!, keys, lookup, list.id === result.event.to.list ? result.inserted : []);
    }
  };

  const reset = () => {
    const current = session.value;
    if (!current) return;
    if (current.stacked && !current.copying) {
      const overlay = manager.overlayElement.value;
      if (overlay?.isConnected) g.returning = { keys: new Set(current.others), from: getRect(overlay) };
    }
    for (const list of lists.values()) {
      list.draft.value = null;
      list.reset?.();
    }
    session.value = null;
    setIndicator(null);
    bump();
  };

  const isForeign = (event: DnDEvent) => !!event.over && !lists.has(event.over.id);

  const isOutside = (current: Session, event: DnDEvent) =>
    !event.over && !(current.target && distance(event.pointer, current.target.at) < HYSTERESIS);

  const combine = (verdict: BeforeDropResult, partial: Key[] | undefined): BeforeDropResult =>
    verdict === false ? false : Array.isArray(verdict) ? verdict : (partial ?? verdict);

  const beforeDrop = (event: DnDEvent): MaybePromise<BeforeDropResult> => {
    const current = session.value;
    if (!current || current.activeKey !== event.active.id || isForeign(event)) return;
    // The last move may still be lining the block up with the overlay.
    return g.following ? settleBlock().then(() => decide(current, event)) : decide(current, event);
  };

  const decide = (current: Session, event: DnDEvent): MaybePromise<BeforeDropResult> => {
    if (session.value !== current) return;
    // A refusing list cancels the drop in the manager; don't ask the user about it.
    if (event.over && !event.over.accepted) return;
    const outside = isOutside(current, event);
    const rule = outside ? listOf(current.list ?? current.origin.list)?.dropOutside() : undefined;
    if (rule === 'cancel') return false;
    let result: DropResult | null;
    if (rule === 'remove') {
      // The list the items leave is asked, as for any drop of its own.
      current.removed = true;
      result = computeRemoval(current.keys);
    } else {
      current.marker = indicator.value ?? (outside ? current.indicator : null);
      result = computeResult(null, current.marker);
    }
    current.result = result;
    if (!result) return;
    const partial = result.event.rejected.length ? result.event.accepted : undefined;
    const verdict = lists.get(result.event.to.list)?.beforeDrop?.(result.event);
    return isPromise(verdict) ? verdict.then((value) => combine(value, partial)) : combine(verdict, partial);
  };

  // What moves: the lead, which carries the active node when that rides in it.
  const subjectOf = (current: Session): SortableSubject => ({
    key: current.lead,
    count: current.keys.length,
    copy: current.copying,
  });

  const end = (event: DnDEndEvent) => {
    const current = session.value;
    if (!current || current.activeKey !== event.active.id) return;
    let result: DropResult | null = null;
    // The result `onBeforeDrop` saw holds unless it accepted fewer keys.
    const kept = new Set(event.accepted);
    const prepared = current.result;
    const unchanged = !!prepared && sameKeys(prepared.event.accepted, current.keys.filter((key) => kept.has(key)));
    if (current.removed) {
      result = unchanged ? prepared : computeRemoval(event.accepted);
    } else if (!isForeign(event)) {
      result = unchanged ? prepared : computeResult(kept, current.marker);
    }
    if (result) {
      // `onDrop` comes first: the sources still hold the old order, `result` the new one.
      try {
        lists.get(result.event.to.list)?.afterDrop?.(result.event);
      } catch (error) {
        console.error(error);
      }
      if (!current.prevented) write(result);
    }
    // Where the overlay's clones land: the accepted items on their slots (copies when
    // copying); the rest on their own elements, back where they started. The active item
    // goes with its lead.
    const accepted = result && !current.removed ? result.event.accepted : [];
    if (result && !accepted.includes(current.lead)) manager.landingKey.value = null;
    setLandings(
      accepted
        .filter((key) => key !== current.activeKey)
        .map((key) => [current.copying ? (current.copies.get(key) ?? key) : key, key]),
    );

    const who = subjectOf(current);
    let text: string | undefined;
    if (isInto(event)) {
      text = sortableTexts.into(who, event.over!.id);
    } else if (current.removed) {
      if (result) text = sortableTexts.removed(who, result.event.to.list);
    } else if (result && result.event.to.index >= 0) {
      const list = lists.get(result.event.to.list);
      // The committed keys: a `defineModel` ref only shows the new array after the parent re-renders.
      const committed = list ? (result.next.get(list) ?? list.getKeys()) : [];
      // A swap changes no list's length.
      const partner = result.event.partner;
      text = sortableTexts.end(
        who,
        { list: result.event.to.list, index: result.event.to.index, length: committed.length },
        partner && { key: partner.key, spot: spotIn(partner.to.list, partner.to.index) },
      );
    } else if (!result && !isForeign(event) && !current.copying && current.origin.list != null) {
      text = sortableTexts.end(who, spotIn(current.origin.list, current.origin.index));
    }
    g.announced = { key: current.activeKey, text };
    reset();
  };

  const cancel = (event: DnDEvent) => {
    const current = session.value;
    // Copies vanish: their clones fly back to the originals. Moved block members stay placeholders until the overlay is home.
    if (current?.copying && current.activeKey === event.active.id) setLandings([]);
    if (current && current.activeKey === event.active.id && current.origin.list != null) {
      g.announced = {
        key: current.activeKey,
        text: sortableTexts.cancel(subjectOf(current), spotIn(current.origin.list, current.origin.index)),
      };
    }
    reset();
  };

  // ─── Keyboard ────────────────────────────────────────────────────────────────

  /** Insertion index in `target` for the slot coming from `from` (cross-list keyboard moves). */
  const insertionIndex = (target: ListEntry, from: Rect, current: Session): number => {
    const keys = keysOf(target);
    const element = target.getElement();
    const center = getCenter(from);
    const strategy = target.strategy();
    if (strategy !== 'grid') {
      // Before the first item whose center is level with or past the slot's (rows that line up tie).
      const axis = strategy === 'vertical' ? 'y' : 'x';
      const next = collect(target).find((item) => getCenter(item.rect)[axis] >= center[axis] - 1);
      return next ? next.index : keys.length;
    }
    let pointer = center;
    if (element) {
      const box = getLayoutRect(element);
      pointer = { x: clamp(center.x, box.left + 1, box.right - 1), y: clamp(center.y, box.top + 1, box.bottom - 1) };
    }
    const projection = projectIndex({
      strategy: target.strategy(),
      pointer,
      items: collect(target),
      activeKey: current.slot,
      activeIndex: -1,
      length: keys.length,
      lock: null,
    });
    return projection.index ?? keys.length;
  };

  /** Closest list of the group in the arrow's direction that takes the drag: from `list`, or from `origin` outside the lists. */
  const adjacentList = (
    list: ListEntry | null,
    active: Active,
    direction: Coordinates,
    origin?: Rect,
  ): ListEntry | null => {
    const element = list?.getElement();
    const from = element ? getLayoutRect(element) : origin;
    if (!from) return null;
    const candidates: Array<{ list: ListEntry; rect: Rect }> = [];
    for (const other of lists.values()) {
      const node = other.getElement();
      if (other === list || !node?.isConnected || other.isDisabled() || !accepts(other, active)) continue;
      // Lists inside the dragged element (a column's own cards) can't take it.
      if (active.element.isConnected && active.element.contains(node)) continue;
      candidates.push({ list: other, rect: getLayoutRect(node) });
    }
    return pickAdjacent(from, candidates, direction)?.list ?? null;
  };

  /** Shows the insertion line at `index` of `target`; returns where the overlay goes. */
  const indicateAt = (target: ListEntry, index: number): Coordinates | undefined => {
    const keys = keysOf(target);
    const line: IndicatorProjection | null = target.indicateAt
      ? target.indicateAt(index)
      : index < keys.length
        ? { index, key: keys[index]!, side: 'before' }
        : { index, key: keys[keys.length - 1] ?? null, side: 'after' };
    if (!line) return undefined;
    showIndicator({ list: target.id, ...line });
    const element = (line.key == null ? null : items.get(line.key)?.()) ?? target.getElement();
    if (!element?.isConnected) return undefined;
    revealElement(element);
    return getCenter(getLayoutRect(element));
  };

  /**
   * Once a keyboard move has rendered: reveals the slot and returns its center. A slot
   * that was recreated (in another list, or by a list that remounts its rows) gets the
   * focus back, as the old element took it along; an external draggable is still where
   * it was and keeps it.
   */
  const slotCenter = (current: Session, recreated: boolean): Coordinates | undefined => {
    const element = items.get(current.slot)?.();
    if (!element?.isConnected) return undefined;
    revealElement(element);
    if (recreated && !current.external) manager.getDraggable(current.slot)?.getFocusTarget()?.focus({ preventScroll: true });
    return getCenter(getLayoutRect(element));
  };

  /**
   * The arrow takes the drag across into an indicator list, level with `from`. Such
   * lists never move: the slot stays (or goes back) home and only the line goes there.
   */
  const indicateAcross = async (current: Session, target: ListEntry, from: Rect): Promise<Coordinates | undefined> => {
    const home = current.list;
    keepSlotHome(current);
    // Measured once the slot is back home.
    await nextTick();
    if (session.value !== current) return undefined;
    if (current.list !== home) slotCenter(current, true);
    return indicateAt(target, insertionIndex(target, from, current));
  };

  const keyboardIndicator = async (
    current: Session,
    list: ListEntry,
    active: Active,
    pointer: Coordinates,
    direction: Coordinates,
  ): Promise<Coordinates | undefined> => {
    const strategy = list.strategy();
    const step = strategy === 'vertical' ? direction.y : direction.x;
    if (!step) {
      const other = adjacentList(list, active, direction);
      if (!other || !enter(current, other)) return undefined;
      // The line, where the keyboard took the drag, stands for the slot.
      const from = createRect(pointer.x, pointer.y, 0, 0);
      if (other.placeholder() === 'indicator') return indicateAcross(current, other, from);
      // A list that moves takes the slot; the line goes away.
      setIndicator(null);
      moveActive(other, insertionIndex(other, from, current), null);
      await nextTick();
      return session.value === current ? slotCenter(current, true) : undefined;
    }
    const keys = keysOf(list);
    const own = list.id === current.list ? keys.indexOf(current.slot) : -1;
    const marker = indicator.value?.list === list.id ? indicator.value : null;
    let next = (marker ? marker.index : Math.max(own, 0)) + step;
    // Right before or after the active item the drop changes nothing: skip those positions.
    while (own >= 0 && (next === own || next === own + 1)) next += step;
    if (next < 0 || next > keys.length) return undefined;
    return indicateAt(list, next);
  };

  /**
   * An external draggable outside the lists: the arrow takes it into the closest list
   * in its direction, at the position level with the drag, as moves between lists do.
   * Without one that way it moves as the plain draggable it is (pixels, droppables).
   */
  const enterList = async (
    current: Session,
    active: Active,
    pointer: Coordinates,
    direction: Coordinates,
  ): Promise<Coordinates | undefined> => {
    const from = createRect(pointer.x, pointer.y, 0, 0);
    const target = adjacentList(null, active, direction, from);
    if (!target || !enter(current, target)) return undefined;
    const index = insertionIndex(target, from, current);
    if (target.placeholder() === 'indicator') return indicateAt(target, index) ?? pointer;
    moveActive(target, index, null);
    await nextTick();
    if (session.value !== current) return undefined;
    return slotCenter(current, false) ?? pointer;
  };

  /**
   * Keyboard sorting by items (rfcs/0001-v3.md §10): the arrow along the list moves
   * the slot by one, the perpendicular one moves it to the adjacent list (kanban),
   * and in grids up/down go to the nearest item of the next row. The item a list made
   * for an external draggable moves like any other. Into an indicator list only the
   * line moves.
   */
  const getKeyboardCoordinates = async (
    _event: KeyboardEvent,
    { active, pointer, direction }: KeyboardMoveContext,
  ): Promise<Coordinates | undefined> => {
    const current = session.value;
    if (!current || current.activeKey !== active.id) return;
    const marker = indicator.value;
    const list = marker ? lists.get(marker.list) : current.list == null ? undefined : lists.get(current.list);
    if (!list && current.external) return enterList(current, active, pointer, direction);
    // Trees navigate depth themselves; copies over their palette have no slot to move.
    if (!list || list.project) return;
    // Staying put still answers, so the sensor doesn't fall back to pixel steps.
    const center = () => {
      const element = items.get(current.slot)?.() ?? items.get(current.activeKey)?.();
      return element?.isConnected ? getCenter(getLayoutRect(element)) : pointer;
    };
    if (list.placeholder() === 'indicator') {
      return (await keyboardIndicator(current, list, active, pointer, direction)) ?? center();
    }

    const strategy = list.strategy();
    // A block moves by items as one unit.
    const keys = viewOf(list, current);
    const position = keys.indexOf(current.slot);
    const slot = items.get(current.slot)?.();
    if (position === -1 || !slot?.isConnected) return center();
    const slotRect = getLayoutRect(slot);
    // Resting on a drop target in an item: the arrow that went there goes on past the
    // item, the opposite one comes back to the slot, any other moves from the slot.
    const stop = current.stop;
    current.stop = null;
    // Leaving the target: detect again even where the pointer stays (the slot that took
    // the item's place has its center where the target's was).
    if (stop) manager.scheduleFrame();
    const onward = !!stop && direction.x === stop.direction.x && direction.y === stop.direction.y;
    if (stop && !onward && direction.x === -stop.direction.x && direction.y === -stop.direction.y) return center();

    let target = list;
    let index: number | null = null;
    let across = false;
    if (strategy === 'grid' && direction.y) {
      const others = collect(list).filter((item) => item.index !== position);
      index = nextRowIndex(others, slotRect, direction.y > 0 ? 1 : -1);
      across = index === null;
    } else {
      const step = strategy === 'vertical' ? direction.y : direction.x;
      if (step) {
        const next = position + step;
        if (next >= 0 && next < keys.length) index = next;
      } else {
        across = true;
      }
    }
    if (across) {
      const other = adjacentList(list, active, direction);
      if (other?.placeholder() === 'indicator') {
        const line = enter(current, other) ? await indicateAcross(current, other, slotRect) : undefined;
        return line ?? center();
      }
      if (other) {
        target = other;
        index = insertionIndex(other, slotRect, current);
      }
    }
    if (index !== null) {
      if (target === list && !list.canSort()) index = null;
      else if (target !== list && target.id === current.origin.list && !target.canSort()) {
        returnToOrigin(null);
        index = null;
      }
    }
    // Passing an item with a drop target that takes the drag stops on the target first:
    // the next press drops into the item (or goes on past it, as the pointer does).
    const passed = index !== null && target === list && !onward ? keys[index] : undefined;
    const into = passed === undefined ? null : intoPoint(passed, list, active);
    if (into) {
      current.stop = { key: passed!, direction };
      return into;
    }
    // An external item takes the item the other list makes for it.
    if (index !== null && enter(current, target)) moveActive(target, index, null);

    await nextTick();
    if (session.value !== current) return;
    // In this list too when it keys its rows by index (Vuetify's v-data-table-virtual
    // remounts every row whose index changed).
    return slotCenter(current, target !== list || isFocusLost()) ?? center();
  };

  // ─── Announcements ───────────────────────────────────────────────────────────

  const spotKey = ({ list, index, length }: SortableSpot) => `${String(list)}\u0000${index}\u0000${length}`;

  const spotOf = (current: Session): SortableSpot | null => {
    const shown = indicator.value;
    if (shown) {
      const list = lists.get(shown.list);
      const keys = list ? keysOf(list) : [];
      const own = keys.indexOf(current.slot);
      const index = own >= 0 && own < shown.index ? shown.index - 1 : shown.index;
      return { list: shown.list, index, length: own >= 0 ? keys.length : keys.length + 1 };
    }
    if (current.list == null) return null;
    const keys = keysOf(lists.get(current.list)!);
    // A block is placed where it starts.
    return { list: current.list, index: keys.indexOf(current.block[0]!), length: keys.length };
  };

  const ours = (event: DnDEvent) => {
    const current = session.value;
    return current && current.activeKey === event.active.id && !isForeign(event) ? current : null;
  };

  const announcer: Partial<Announcements> = {
    onDragStart: (event) => {
      const current = ours(event);
      if (!current || current.origin.list == null) return undefined;
      return sortableTexts.start(subjectOf(current), spotIn(current.origin.list, current.origin.index));
    },
    onDragOver: (event) => {
      const into = session.value;
      if (into?.activeKey === event.active.id && isInto(event)) {
        // Back over the list, the position is spoken again.
        g.spokenSpot = null;
        return sortableTexts.target(subjectOf(into), event.over!.id);
      }
      const current = ours(event);
      const spot = current && spotOf(current);
      if (!spot) return undefined;
      // '' tells the manager there is nothing new, without cancelling a pending text.
      const key = spotKey(spot);
      if (key === g.spokenSpot) return '';
      g.spokenSpot = key;
      // A swap partner sits where the active item started.
      const partner = current.swap;
      return sortableTexts.over(
        subjectOf(current),
        spot,
        partner == null ? undefined : { key: partner, spot: spotIn(current.origin.list!, current.origin.index) },
      );
    },
    onDragEnd: (event) => (g.announced?.key === event.active.id ? g.announced.text : undefined),
    onDragCancel: (event) => (g.announced?.key === event.active.id ? g.announced.text : undefined),
  };

  // ─── Wiring ──────────────────────────────────────────────────────────────────

  // An integration: the drop is written before the user's monitors hear `onDragEnd`.
  const removeMonitor = manager.addMonitor(
    {
      onDragStart: start,
      onDragMove: move,
      onBeforeDrop: beforeDrop,
      onDragEnd: end,
      onDragCancel: cancel,
      getKeyboardCoordinates,
    },
    true,
  );
  const removeAnnouncer = manager.addAnnouncer(announcer);
  const removeRule = manager.addTargetRule(targetRule(g));
  // `e.source.remove()` in a trash zone's onDrop marks the dragged items for removal.
  const removeSource = manager.addSourceResolver((active) => {
    const current = session.value;
    if (!current || current.activeKey !== active.id || current.origin.list == null) return undefined;
    return {
      list: current.origin.list,
      remove: () => {
        current.removed = true;
      },
    };
  });

  return {
    name,
    manager,
    session,
    indicator,
    addList(entry) {
      lists.set(entry.id, entry);
      return () => {
        if (lists.get(entry.id) !== entry) return;
        lists.delete(entry.id);
        if (lists.size) return;
        removeMonitor();
        removeAnnouncer();
        removeRule();
        removeSource();
        scope.stop();
        release();
      };
    },
    registerItem(key, getElement) {
      items.set(key, getElement);
      return () => {
        if (items.get(key) === getElement) items.delete(key);
      };
    },
    showIndicator,
    lookup,
    keysOf,
    viewOf: (list) => (session.value ? viewOf(list, session.value) : keysOf(list)),
    indexOf,
    accepts,
    isInert: (list) => isInert(g, list),
    leadOffset: () => (session.value ? leadOffset(session.value) : NO_OFFSET),
    captureLayout: () => captureLayout(g),
  };
}

export function useSortableGroup(manager: DnDManager, name: string): SortableGroup {
  let groups = registries.get(manager);
  if (!groups) {
    groups = new Map();
    registries.set(manager, groups);
  }
  const existing = groups.get(name);
  if (existing) return existing;
  const group = createGroup(manager, name, () => groups!.delete(name));
  groups.set(name, group);
  return group;
}
