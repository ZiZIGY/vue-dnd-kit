/**
 * A sortable group: lists that exchange items. Holds the draft order of every list
 * during a drag, projects the pointer onto it, commits the result on drop, and runs
 * FLIP for every change it causes.
 *
 * The active slot is a key in the drafts. Usually it is the active item itself; when
 * copying it is the item's copy, and for a plain draggable from outside it is the
 * item `createItem` made. Projection, commit and FLIP only ever deal with that key.
 *
 * Multi-drag `'group'`: the other dragged items travel with the slot as a block,
 * contiguous in the draft and in drop order. Projection and keyboard moves count the
 * block once (`viewOf`), and every move takes the whole block along.
 */

import { effectScope, nextTick, shallowRef, watch, type ShallowRef } from 'vue';
import type {
  AcceptMode,
  Active,
  Announcements,
  BeforeDropResult,
  Coordinates,
  DnDEndEvent,
  DnDEvent,
  DragItem,
  DragMode,
  DropOutside,
  Key,
  KeyboardMoveContext,
  LayoutAnimation,
  MaybePromise,
  MultipleMode,
  Rect,
  Size,
  SortableBehavior,
  SortableDropEvent,
  SortableIndicator,
  SortablePlaceholder,
  SortablePutContext,
  SortableStrategy,
} from '../types';
import type { DnDManager } from '../core/manager';
import { fadeIn, flip, getCenter, getLayoutRect, getRect, type FlipEntry } from '../animation/layout';
import {
  nextRowIndex,
  pickAdjacent,
  projectIndex,
  projectIndicator,
  projectSwap,
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
  type Hysteresis,
} from './stability';
import { collapseIntoOverlay } from './multiple';
import { trackCopyModifier } from './modifier';
import { revealElement } from '../core/autoscroll';
import { sortableTexts, type SortableSpot, type SortableSubject } from './announcements';

/** An item made by a list: a copy (`clone`) or an item for an external draggable (`createItem`). */
export interface CreatedItem {
  key: Key;
  item: unknown;
}

export interface ListEntry {
  id: Key;
  getElement(): HTMLElement | null;
  /** Keys of the source items, in order. */
  getKeys(): Key[];
  getItem(key: Key): unknown;
  /** Draft order during a drag, `null` when idle. */
  draft: ShallowRef<Key[] | null>;
  strategy(): SortableStrategy;
  placeholder(): SortablePlaceholder;
  animation(): LayoutAnimation | undefined;
  isDisabled(): boolean;
  canSort(): boolean;
  pull(): boolean | 'clone';
  canPut(context: SortablePutContext): boolean;
  dropOutside(): DropOutside;
  commit(keys: Key[], lookup: (key: Key) => unknown): void;
  beforeDrop?(event: SortableDropEvent): MaybePromise<BeforeDropResult>;
  afterDrop?(event: SortableDropEvent): void;

  // Optional features; lists that don't implement them get the defaults.
  /** Default `'sort'`. */
  behavior?(): SortableBehavior;
  /** Default `'stack'` (trees); sortable lists default to `'group'`. */
  multiple?(): MultipleMode;
  /** Default `'all'`. */
  acceptMode?(): AcceptMode;
  /** Copies an item (`pull: 'clone'`, the copy modifier). */
  clone?(item: unknown): CreatedItem | undefined;
  /** Makes an item for a plain draggable entering the list. */
  create?(active: Active): CreatedItem | undefined;

  // Extension points for list kinds built on the group (the tree uses them).
  /** Adjusts the initial draft, e.g. hides the descendants of the active node. */
  prepareDraft?(keys: Key[], context: { activeKey: Key; keys: Key[] }): Key[];
  /** Replaces the index projection: new index of the active key, or `null` to keep it. */
  project?(event: DnDEvent, context: ProjectContext): number | null;
  /** Runs on every move while this list holds the active slot (after any reorder). */
  afterMove?(event: DnDEvent): void;
  /** Whether committing `keys` changes anything; defaults to comparing with `getKeys()`. */
  hasChanges?(keys: Key[]): boolean;
  /** Runs when the session ends (drop, cancel, reject). */
  reset?(): void;
}

export interface ProjectContext {
  /** Current draft of this list. */
  keys: Key[];
  /** Mounted items of this list, with layout rects, in draft order. */
  items: ProjectionItem[];
  /** Key of the active slot (the active key unless copying or inserting). */
  activeKey: Key;
  /** Index of the active key in this draft, -1 when it is in another list. */
  activeIndex: number;
}

interface DropResult {
  next: Map<ListEntry, Key[]>;
  event: SortableDropEvent;
}

interface Session {
  activeKey: Key;
  /** Every moved key in document order (multi-drag), the active one included. */
  keys: Key[];
  /** Where the active item started; `list` is `null` for an external draggable. */
  origin: { list: Key | null; index: number };
  /** Key holding the active slot in the drafts: the active key, its copy or a created item. */
  slot: Key;
  /** List whose draft holds the slot; `null` while no draft does (copy over its palette, external item outside). */
  list: Key | null;
  lock: Key | null;
  /** Item objects at drag start (plus copies and created items), so keys can be mapped back across lists. */
  items: Map<Key, unknown>;
  size: Size;
  result: DropResult | null;

  /** The other dragged keys (multi-drag). */
  others: Set<Key>;
  /** List and index every dragged key started at; rejected keys go back there. */
  sources: Map<Key, { list: Key; index: number }>;
  /** Multi-drag `'stack'`: the others are collapsed out of the drafts. */
  stacked: boolean;
  /** Multi-drag `'group'`: the others travel with the slot in the drafts. */
  grouped: boolean;
  /**
   * Keys travelling with the slot, in drop order, the slot included: contiguous in the
   * draft of `list`. The slot alone unless `grouped`.
   */
  block: Key[];
  /** Move-mode drafts at drag start; swaps and copy toggles rebuild from them. */
  base: Map<Key, Key[]>;
  external: boolean;
  copying: boolean;
  /** Copy of each dragged key, made once per session so the key stays stable; `null` when `clone` refused. */
  copies: Map<Key, Key | null>;
  /** Item made for an external draggable, per list. */
  created: Map<Key, Key | null>;
  /** Item the active one is exchanged with (`behavior: 'swap'`). */
  swap: Key | null;
  /** Last valid indicator; kept after leaving the list for `dropOutside: 'placeholder'`. */
  indicator: SortableIndicator | null;
  /** Indicator the drop commits at, decided in `onBeforeDrop`. */
  marker: SortableIndicator | null;
  hysteresis: Hysteresis | null;
  /** Last valid target and the pointer there: bridges one-frame gaps at list boundaries. */
  target: { list: Key; at: Coordinates } | null;
  /** A trash zone or `dropOutside: 'remove'` asked to remove the dragged items. */
  removed: boolean;
}

interface Snapshot {
  element: HTMLElement;
  /** `null`: far from the viewport, the element jumps instead of animating. */
  rect: Rect | null;
}

export interface SortableGroup {
  name: string;
  manager: DnDManager;
  session: ShallowRef<Session | null>;
  /** Insertion line of `placeholder: 'indicator'` lists, while the pointer is over one. */
  indicator: ShallowRef<SortableIndicator | null>;
  addList(entry: ListEntry): () => void;
  registerItem(key: Key, getElement: () => HTMLElement | null): () => void;
  lookup(key: Key): unknown;
  keysOf(list: ListEntry): Key[];
  indexOf(list: ListEntry, key: Key): number;
  accepts(list: ListEntry, active: Active): boolean;
  /** The current drag can never enter this list (another group, or a plain draggable it can't create items for). */
  isInert(list: ListEntry): boolean;
  captureLayout(): void;
}

const registries = new WeakMap<DnDManager, Map<string, SortableGroup>>();

const sameKeys = (a: readonly Key[], b: readonly Key[]) =>
  a.length === b.length && a.every((key, index) => key === b[index]);

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

const sameIndicator = (a: SortableIndicator | null, b: SortableIndicator | null) =>
  a === b ||
  (!!a && !!b && a.list === b.list && a.index === b.index && a.key === b.key && a.side === b.side);

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function createGroup(manager: DnDManager, name: string, release: () => void): SortableGroup {
  const lists = new Map<Key, ListEntry>();
  const items = new Map<Key, () => HTMLElement | null>();
  const session = shallowRef<Session | null>(null);
  const indicator = shallowRef<SortableIndicator | null>(null);
  const version = shallowRef(0);
  const indexCache = new WeakMap<Key[], Map<Key, number>>();
  const scope = effectScope(true);
  /** Others of a finished `'stack'` drag: they fly out of the overlay into their slots. */
  let returning: { keys: Set<Key>; from: Rect } | null = null;
  /** The next FLIP pass is the pickup of a `'group'` drag: the others travel into the block, from other lists too. */
  let gathering = false;
  /** List whose strategy and gap the overlay column follows. */
  let columnList: Key | null = null;
  /** Text for the end or cancel announcement, computed while the session still existed. */
  let announced: { key: Key; text: string | undefined } | null = null;
  /** Last position announced (or picked up at), so an unchanged position isn't spoken again. */
  let spokenSpot: string | null = null;

  const keysOf = (list: ListEntry) => list.draft.value ?? list.getKeys();

  const indexMap = (keys: Key[]) => {
    let map = indexCache.get(keys);
    if (!map) {
      map = new Map(keys.map((key, index) => [key, index]));
      indexCache.set(keys, map);
    }
    return map;
  };

  const indexOf = (list: ListEntry, key: Key) => indexMap(keysOf(list)).get(key) ?? -1;

  const lookup = (key: Key): unknown => {
    const snapshot = session.value?.items;
    if (snapshot?.has(key)) return snapshot.get(key);
    for (const list of lists.values()) {
      const item = list.getItem(key);
      if (item !== undefined) return item;
    }
    return undefined;
  };

  const listOfKey = (key: Key, useDraft: boolean): ListEntry | undefined => {
    for (const list of lists.values()) {
      if (indexMap(useDraft ? keysOf(list) : list.getKeys()).has(key)) return list;
    }
    return undefined;
  };

  /** Lists in document order, so multi-drag keys from several lists insert in the order the user sees. */
  const orderedLists = (): ListEntry[] =>
    [...lists.values()].sort((a, b) => {
      const x = a.getElement();
      const y = b.getElement();
      if (!x || !y || x === y) return 0;
      return x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

  // ─── FLIP ────────────────────────────────────────────────────────────────────

  const capture = (): Map<Key, Snapshot> => {
    const snapshot = new Map<Key, Snapshot>();
    for (const [key, getElement] of items) {
      const element = getElement();
      if (!element?.isConnected) continue;
      snapshot.set(key, { element, rect: manager.isNearViewport(element) ? getRect(element) : null });
    }
    return snapshot;
  };

  const animate = (snapshot: Map<Key, Snapshot>, fadeAppearing: boolean) => {
    const byList = new Map<ListEntry, FlipEntry[]>();
    const appearing: Array<{ element: HTMLElement; list: ListEntry }> = [];
    const landing = manager.landingKey.value ?? manager.active.value?.id;
    const back = returning;
    returning = null;
    const pickup = gathering;
    gathering = false;
    // The overlay carries a clone of the item landing on `key` (multi-drag column).
    const carried = (key: Key) => key === landing || manager.overlayItems.has(manager.landings.value.get(key) ?? key);
    for (const [key, getElement] of items) {
      const before = snapshot.get(key);
      // Far from the viewport: it jumps instead of animating.
      if (before && !before.rect) continue;
      const element = getElement();
      if (!element?.isConnected) continue;
      const list = listOfKey(key, true);
      if (!list) continue;
      let first: Rect;
      let previous: HTMLElement;
      if (before?.rect) {
        first = before.rect;
        previous = before.element;
      } else if (back?.keys.has(key)) {
        // Multi-drag items coming back out of the overlay.
        first = back.from;
        previous = element;
        appearing.push({ element, list });
      } else {
        if (fadeAppearing && key !== landing) fadeIn(element, list.animation());
        continue;
      }
      // The active slot entering another list was recreated: sliding it in from the
      // old list would be clipped by the new scroller, and the overlay shows it anyway.
      // The same goes for the items whose clones the overlay carries, except at pickup,
      // where the others visibly travel into the block.
      if (previous !== element && !pickup && carried(key)) continue;
      const entries = byList.get(list) ?? [];
      entries.push({ key, element, first });
      byList.set(list, entries);
    }
    for (const [list, entries] of byList) flip(entries, list.animation());
    for (const { element, list } of appearing) fadeIn(element, list.animation());
    manager.invalidateMeasurements();
  };

  const bump = () => version.value++;

  let copyHeld: () => boolean = () => false;
  scope.run(() => {
    let snapshot = new Map<Key, Snapshot>();
    watch(version, () => (snapshot = capture()), { flush: 'pre' });
    watch(version, () => animate(snapshot, true), { flush: 'post' });
    copyHeld = trackCopyModifier(manager, () => manager.scheduleFrame());
  });

  /** For layout changes the library didn't cause (virtualizer re-measures). Free while idle. */
  const captureLayout = () => {
    if (manager.status.value === 'idle') return;
    const snapshot = capture();
    void nextTick(() => animate(snapshot, false));
  };

  // ─── Accepting ───────────────────────────────────────────────────────────────

  const itemTypes = (key: Key): string[] => manager.getDraggable(key)?.getTypes() ?? [name];

  const createdIn = (list: ListEntry, current: Session): Key | null => {
    if (!list.create) return null;
    if (!current.created.has(list.id)) {
      const active = manager.active.value;
      const made = active ? list.create(active) : undefined;
      current.created.set(list.id, made ? made.key : null);
      if (made) current.items.set(made.key, made.item);
    }
    return current.created.get(list.id) ?? null;
  };

  /** Which dragged keys `list` takes: `group.put` per key with `acceptMode: 'some'`, all or none otherwise. */
  const partition = (list: ListEntry, current: Session): { accepted: Key[]; rejected: Key[] } => {
    const all = { accepted: current.keys, rejected: [] as Key[] };
    const none = { accepted: [] as Key[], rejected: current.keys };
    if (list.isDisabled()) return none;
    if (current.external) {
      const created = createdIn(list, current);
      if (created == null) return none;
      const context: SortablePutContext = {
        keys: current.keys,
        items: [lookup(created)],
        types: manager.active.value?.type ?? [],
        from: null,
        to: list.id,
      };
      return list.canPut(context) ? all : none;
    }
    if (list.id === current.origin.list) return all;
    if (lists.get(current.origin.list!)?.pull() === false) return none;
    const context = (keys: Key[]): SortablePutContext => ({
      keys,
      items: keys.map(lookup),
      types: [...new Set(keys.flatMap(itemTypes))],
      from: current.origin.list,
      to: list.id,
    });
    if ((list.acceptMode?.() ?? 'all') === 'all') return list.canPut(context(current.keys)) ? all : none;
    const accepted: Key[] = [];
    const rejected: Key[] = [];
    for (const key of current.keys) (list.canPut(context([key])) ? accepted : rejected).push(key);
    return { accepted, rejected };
  };

  const accepts = (list: ListEntry, active: Active) => {
    const current = session.value;
    if (!current || current.activeKey !== active.id) return false;
    const { accepted, rejected } = partition(list, current);
    return (list.acceptMode?.() ?? 'all') === 'some' ? accepted.length > 0 : !rejected.length;
  };

  const isInert = (list: ListEntry) => {
    const active = manager.active.value;
    if (!active) return false;
    const current = session.value;
    if (!current || current.activeKey !== active.id) return true;
    return current.external && !list.create;
  };

  // ─── Session ─────────────────────────────────────────────────────────────────

  const copyOf = (current: Session, key: Key): Key | null => {
    if (!current.copies.has(key)) {
      const source = current.sources.get(key);
      const list = source ? lists.get(source.list) : undefined;
      const made = list?.clone?.(lookup(key));
      current.copies.set(key, made ? made.key : null);
      if (made) current.items.set(made.key, made.item);
    }
    return current.copies.get(key) ?? null;
  };

  const wantsCopy = (current: Session) => {
    if (current.external || current.origin.list == null) return false;
    const origin = lists.get(current.origin.list);
    if (!origin?.clone) return false;
    return origin.pull() === 'clone' || copyHeld();
  };

  const isSwapping = (current: Session, list: ListEntry | undefined) =>
    // Swap is a single-item exchange; multi-drag falls back to sorting (rfcs/0001-v3.md §6, §14 item 6).
    list?.behavior?.() === 'swap' && current.keys.length === 1 && !current.external && !current.copying;

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

  /**
   * The default overlay of a multi-drag that isn't `'stack'`: every item in drop order,
   * in a column along the list holding the slot (a row in horizontal lists and grids:
   * consecutive grid items sit side by side), with that list's gap.
   */
  const syncColumn = (current: Session) => {
    if (current.stacked || current.keys.length < 2) return;
    const list = lists.get(current.list ?? current.origin.list ?? '');
    if (!list || list.id === columnList) return;
    columnList = list.id;
    const axis = list.strategy() === 'vertical' ? 'y' : 'x';
    manager.overlayColumn.value = { ids: current.keys, axis, gap: gapOf(list, axis), animation: list.animation() };
  };

  /** Mirrors the session into the manager: overlay `mode`, where the overlay lands, the placeholders of a block. */
  const syncManager = () => {
    const current = session.value;
    if (!current) return;
    const placed = current.list != null;
    manager.landingKey.value = placed && current.slot !== current.activeKey ? current.slot : null;
    setLandings(
      placed && current.grouped
        ? current.block.filter((key) => key !== current.slot).map((key) => [key, originalOf(current, key)])
        : [],
    );
    syncColumn(current);
    const list = placed ? lists.get(current.list!) : undefined;
    let mode: DragMode = 'move';
    if (current.external) mode = placed ? 'insert' : 'move';
    else if (current.copying) mode = 'copy';
    else if (isSwapping(current, list)) mode = 'swap';
    manager.mode.value = mode;
  };

  /**
   * What travels with the slot into `target`: the slot alone, or in multi-drag `'group'`
   * every dragged key in drop order. A list taking only some of them (`group.put` with
   * `acceptMode: 'some'`) gets those, if the active item is one: the rest stay where
   * they started, as the drop would leave them. Copies when copying.
   */
  const blockFor = (current: Session, target: ListEntry | undefined): Key[] => {
    if (!current.grouped) return [current.slot];
    let keys = current.keys;
    if (target) {
      const { accepted } = partition(target, current);
      if (accepted.length < keys.length && accepted.includes(current.activeKey)) keys = accepted;
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
    };

    const origin = sources.get(activeKey);
    if (!origin) {
      // A plain draggable: only lists with `createItem` take part.
      if (!ordered.some((list) => list.create)) return;
      const base = new Map<Key, Key[]>();
      for (const list of lists.values()) {
        const draft = [...list.getKeys()];
        list.draft.value = list.prepareDraft?.(draft, { activeKey, keys: [activeKey] }) ?? draft;
        base.set(list.id, list.draft.value);
      }
      spokenSpot = null;
      columnList = null;
      session.value = {
        ...common,
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

    const originList = lists.get(origin.list)!;
    const order = (key: Key) => {
      const source = sources.get(key)!;
      return ordered.findIndex((list) => list.id === source.list) * 1e9 + source.index;
    };
    const keys = event.active.ids.filter((key) => sources.has(key)).sort((a, b) => order(a) - order(b));

    // Multi-drag ids may belong to unmounted rows or other groups: keep ours only.
    const ids = [activeKey, ...keys.filter((key) => key !== activeKey)];
    if (!sameKeys(ids, event.active.ids)) {
      const dragItems: DragItem[] = ids.map((key) => ({
        id: key,
        item: snapshot.get(key),
        data: manager.getDraggable(key)?.getData(),
        type: itemTypes(key),
      }));
      manager.updateActive({ ids, items: dragItems });
    }

    const others = new Set(keys.filter((key) => key !== activeKey));
    // Indicator lists don't move: their others stay in place whatever the mode.
    const multiple = others.size > 0 && originList.placeholder() === 'item' ? (originList.multiple?.() ?? 'stack') : null;
    const stacked = multiple === 'stack';
    const grouped = multiple === 'group';
    const base = new Map<Key, Key[]>();
    for (const list of lists.values()) {
      const source = list.getKeys();
      let draft = stacked || grouped ? source.filter((key) => !others.has(key)) : [...source];
      // The block forms around the active item: the others leave their places and join it in drop order.
      if (grouped && list === originList) draft = expand(draft, activeKey, keys);
      base.set(list.id, list.prepareDraft?.(draft, { activeKey, keys }) ?? draft);
    }
    const current: Session = {
      ...common,
      keys,
      origin: { list: origin.list, index: origin.index },
      slot: activeKey,
      list: origin.list,
      others,
      stacked,
      grouped,
      block: grouped ? keys : [activeKey],
      base,
      external: false,
      copying: false,
    };
    session.value = current;
    columnList = null;
    // The pickup announcement names this position: the first target of the drag doesn't repeat it.
    const formed = base.get(origin.list)!;
    spokenSpot = grouped
      ? spotKey({ list: origin.list, index: formed.indexOf(keys[0]!), length: formed.length })
      : spotKey({ list: origin.list, index: origin.index, length: originList.getKeys().length });

    const copy = wantsCopy(current) ? copyOf(current, activeKey) : null;
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
      gathering = grouped;
      for (const list of lists.values()) list.draft.value = base.get(list.id)!;
    }
    syncManager();
    bump();
  };

  /** Drafts while copying: every source as it is (nothing leaves). */
  const copyBase = (list: ListEntry, current: Session) => {
    const draft = [...list.getKeys()];
    return list.prepareDraft?.(draft, { activeKey: current.activeKey, keys: current.keys }) ?? draft;
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
    const from = current.list == null ? undefined : lists.get(current.list);
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
    const list = current.list == null ? undefined : lists.get(current.list);
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
    if (current.slot !== current.activeKey) return removeSlot();
    const origin = current.origin.list == null ? undefined : lists.get(current.origin.list);
    const base = origin && current.base.get(origin.id);
    const start = base ? base.indexOf(current.activeKey) : -1;
    if (!origin || !base || start < 0) return;
    const members = new Set(current.grouped ? current.keys : []);
    members.delete(current.activeKey);
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
    const indices = indexMap(keysOf(list));
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

  const updateIndicator = (target: ListEntry, event: DnDEvent) => {
    const current = session.value!;
    // Indicator lists don't move: the slot stays (or goes back) where it started.
    if (current.slot !== current.activeKey) {
      if (current.list != null) removeSlot();
    } else if (current.list !== current.origin.list) {
      returnToOrigin(null);
    }
    const result = projectIndicator({
      strategy: target.strategy(),
      pointer: event.pointer,
      items: collect(target),
      activeKey: current.slot,
      length: keysOf(target).length,
    });
    if (result !== undefined) showIndicator(result && { list: target.id, ...result });
  };

  // ─── Swap ────────────────────────────────────────────────────────────────────

  /** Restores the drafts to the drag start, then exchanges the active item with `partner`. */
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

  const updateSwap = (target: ListEntry, event: DnDEvent) => {
    const current = session.value!;
    const { partner, key } = projectSwap({
      strategy: target.strategy(),
      pointer: event.pointer,
      items: collect(target),
      activeKey: current.slot,
      partner: current.swap,
    });
    if (partner === undefined || partner === current.swap || blocksKey(current.hysteresis, key)) return;
    applySwap(partner, event.pointer);
  };

  // ─── Copy ────────────────────────────────────────────────────────────────────

  /**
   * Switches between moving and copying mid-drag (copy modifier pressed or released).
   * The new slot (and block) takes the old one's place: after the nearest key that stays put.
   */
  const switchCopy = (copying: boolean) => {
    const current = session.value!;
    const slot = copying ? copyOf(current, current.activeKey) : current.activeKey;
    if (slot == null) return;
    const from = current.list == null ? undefined : lists.get(current.list);
    let anchor: { list: ListEntry; after: Key | null } | null = null;
    if (from) {
      const keys = keysOf(from);
      let after: Key | null = null;
      for (let i = keys.indexOf(current.block[0]!) - 1; i >= 0; i--) {
        const key = keys[i]!;
        if (key !== current.activeKey && !current.others.has(key)) {
          after = key;
          break;
        }
      }
      anchor = { list: from, after };
    }
    current.copying = copying;
    current.slot = slot;
    current.swap = null;
    current.hysteresis = null;
    const origin = current.origin.list == null ? undefined : lists.get(current.origin.list);
    current.block = blockFor(current, anchor?.list ?? (copying ? undefined : origin));
    const moving = new Set(current.block);
    for (const list of lists.values()) {
      let draft: Key[];
      if (copying) draft = copyBase(list, current);
      else if (!anchor) draft = current.base.get(list.id) ?? [...list.getKeys()];
      // A block's keys leave their sources; the ones the list doesn't take stay there.
      else draft = (current.grouped ? list.getKeys() : (current.base.get(list.id) ?? list.getKeys())).filter((key) => !moving.has(key));
      list.draft.value = draft;
    }
    if (anchor) {
      const keys = [...keysOf(anchor.list)];
      const at = anchor.after == null ? 0 : keys.indexOf(anchor.after) + 1;
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

  /** The pointer is over no list of this group (or one that refuses the drag). */
  const leave = (current: Session) => {
    setIndicator(null);
    if (current.swap != null) applySwap(null, null);
    if (current.external && current.list != null) removeSlot();
  };

  /** Extension hook: runs on every move over a valid target, guarded or not (trees update depth here). */
  const afterMove = (current: Session, event: DnDEvent) => {
    if (current.list != null) lists.get(current.list)?.afterMove?.(event);
  };

  /** Pointer of the last move, and the projections run again for it (`followBlock`). */
  let movedAt: Coordinates | null = null;
  let followed = 0;
  /** A pending `followBlock` pass: the drop waits for it. */
  let following: Promise<void> | null = null;

  /**
   * A block that moved can leave the pointer over one of its members (items of other
   * sizes passed, the end of a list): project again once it has rendered, as the pointer
   * may not move again (WebKit delivers a whole glide within a frame or two, and a
   * release right after it runs the last frame inside the drop). Each pass steps toward
   * the pointer, so it ends within a pass per member.
   */
  const followBlock = (current: Session, event: DnDEvent) => {
    if (current.block.length < 2 || followed++ > current.block.length) return;
    const pass: Promise<void> = nextTick(() => {
      if (following === pass) following = null;
      if (session.value === current && manager.status.value !== 'idle' && manager.pointer.value === event.pointer) {
        move(event);
      }
    });
    following = pass;
  };

  /** Resolves once no `followBlock` pass is pending. */
  const settleBlock = async () => {
    while (following) await following;
  };

  const move = (event: DnDEvent) => {
    const current = session.value;
    if (!current || current.activeKey !== event.active.id) return;
    if (event.pointer !== movedAt) {
      movedAt = event.pointer;
      followed = 0;
    }
    // Keyboard drags move the slot in getKeyboardCoordinates. Trees (`project`) answer
    // the keyboard themselves and keep the pointer path below.
    if (event.active.sensor === 'keyboard' && !current.external) {
      const list = current.list == null ? undefined : lists.get(current.list);
      if (!list?.project) return afterMove(current, event);
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

    if (current.external && !blocked) {
      // Each list makes its own item for the external draggable.
      const created = createdIn(target, current);
      if (created == null) return leave(current);
      if (current.slot !== created) {
        if (current.list != null) removeSlot();
        current.slot = created;
      }
    }

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
    let index: number | null;
    let trigger: Key | null = null;
    if (target.project) {
      index = target.project(event, { keys, items: projectionItems, activeKey: current.slot, activeIndex });
      // A list that can't sort still projects (tree depth), but keeps its order.
      if (sameList && !target.canSort()) index = null;
    } else {
      const projection = projectIndex({
        strategy: target.strategy(),
        pointer: event.pointer,
        items: projectionItems,
        activeKey: current.slot,
        activeIndex,
        length: keys.length,
        lock: current.lock,
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
    let target = current.list == null ? undefined : lists.get(current.list);
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
      if (list.hasChanges ? list.hasChanges(keys) : !sameKeys(keys, list.getKeys())) next.set(list, keys);
    }
    if (!next.size) return null;
    const finalKeys = next.get(target) ?? target.getKeys();
    const inserted = (key: Key): Key =>
      current.external ? slot : current.copying ? (current.copies.get(key) ?? key) : key;
    let mode: DragMode = 'move';
    if (current.external) mode = 'insert';
    else if (current.copying) mode = 'copy';
    else if (current.swap != null) mode = 'swap';
    return {
      next,
      event: {
        keys: current.keys,
        items: current.keys.map((key) => lookup(inserted(key))),
        accepted: moved,
        rejected,
        from: { ...current.origin },
        to: { list: target.id, index: insert.length ? finalKeys.indexOf(insert[0]!) : -1 },
        sameList: current.origin.list === target.id,
        mode,
      },
    };
  };

  /** Trash zones and `dropOutside: 'remove'`: the dragged items leave their lists. */
  const computeRemoval = (): DropResult | null => {
    const current = session.value!;
    if (current.copying || current.external || current.origin.list == null) return null;
    const gone = new Set(current.keys);
    const next = new Map<ListEntry, Key[]>();
    for (const list of lists.values()) {
      const source = list.getKeys();
      const keys = source.filter((key) => !gone.has(key));
      if (list.hasChanges ? list.hasChanges(keys) : keys.length !== source.length) next.set(list, keys);
    }
    if (!next.size) return null;
    return {
      next,
      event: {
        keys: current.keys,
        items: current.keys.map(lookup),
        accepted: current.keys,
        rejected: [],
        from: { ...current.origin },
        to: { list: current.origin.list, index: -1 },
        sameList: true,
        mode: 'move',
      },
    };
  };

  const reset = () => {
    const current = session.value;
    if (!current) return;
    if (current.stacked && !current.copying) {
      const overlay = manager.overlayElement.value;
      if (overlay?.isConnected) returning = { keys: new Set(current.others), from: getRect(overlay) };
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
    return following ? settleBlock().then(() => decide(current, event)) : decide(current, event);
  };

  const decide = (current: Session, event: DnDEvent): MaybePromise<BeforeDropResult> => {
    if (session.value !== current) return;
    // A refusing list cancels the drop in the manager; don't ask the user about it.
    if (event.over && !event.over.accepted) return;
    const outside = isOutside(current, event);
    const list = lists.get(current.list ?? current.origin.list ?? '');
    if (outside) {
      const rule = list?.dropOutside();
      if (rule === 'cancel') return false;
      if (rule === 'remove') {
        current.removed = true;
        return;
      }
    }
    current.marker = indicator.value ?? (outside ? current.indicator : null);
    const result = computeResult(null, current.marker);
    current.result = result;
    if (!result) return;
    const partial = result.event.rejected.length ? result.event.accepted : undefined;
    const verdict = lists.get(result.event.to.list)?.beforeDrop?.(result.event);
    return isPromise(verdict) ? verdict.then((value) => combine(value, partial)) : combine(verdict, partial);
  };

  const subjectOf = (current: Session): SortableSubject => ({
    key: current.activeKey,
    count: current.keys.length,
    copy: current.copying,
  });

  const end = (event: DnDEndEvent) => {
    const current = session.value;
    if (!current || current.activeKey !== event.active.id) return;
    let result: DropResult | null = null;
    if (current.removed) {
      result = computeRemoval();
    } else if (!isForeign(event)) {
      const accepted = new Set(event.accepted);
      const prepared = current.result;
      result =
        prepared && sameKeys(prepared.event.accepted, current.keys.filter((key) => accepted.has(key)))
          ? prepared
          : computeResult(accepted, current.marker);
    }
    if (result) for (const [list, keys] of result.next) list.commit(keys, lookup);
    // Where the overlay's clones land: the accepted items on their slots (copies when
    // copying); the rest on their own elements, back where they started.
    const accepted = result && !current.removed ? result.event.accepted : [];
    if (result && !accepted.includes(current.activeKey)) manager.landingKey.value = null;
    setLandings(
      accepted
        .filter((key) => key !== current.activeKey)
        .map((key) => [current.copying ? (current.copies.get(key) ?? key) : key, key]),
    );

    const who = subjectOf(current);
    let text: string | undefined;
    if (current.removed) {
      if (result) text = sortableTexts.removed(who, result.event.to.list);
    } else if (result && result.event.to.index >= 0) {
      const list = lists.get(result.event.to.list);
      // The committed keys: a `defineModel` ref only shows the new array after the parent re-renders.
      const committed = list ? (result.next.get(list) ?? list.getKeys()) : [];
      text = sortableTexts.end(who, {
        list: result.event.to.list,
        index: result.event.to.index,
        length: committed.length,
      });
    } else if (!result && !isForeign(event) && !current.copying && current.origin.list != null) {
      const list = lists.get(current.origin.list);
      text = sortableTexts.end(who, {
        list: current.origin.list,
        index: current.origin.index,
        length: list ? list.getKeys().length : 0,
      });
    }
    announced = { key: current.activeKey, text };
    reset();
    if (result && !current.removed) lists.get(result.event.to.list)?.afterDrop?.(result.event);
  };

  const cancel = (event: DnDEvent) => {
    const current = session.value;
    // Copies vanish: their clones fly back to the originals. Moved block members stay placeholders until the overlay is home.
    if (current?.copying && current.activeKey === event.active.id) setLandings([]);
    if (current && current.activeKey === event.active.id && current.origin.list != null) {
      const list = lists.get(current.origin.list);
      announced = {
        key: current.activeKey,
        text: sortableTexts.cancel(subjectOf(current), {
          list: current.origin.list,
          index: current.origin.index,
          length: list ? list.getKeys().length : 0,
        }),
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

  /** Closest list of the group in the arrow's direction that takes the drag. */
  const adjacentList = (list: ListEntry, active: Active, direction: Coordinates): ListEntry | null => {
    const element = list.getElement();
    if (!element) return null;
    const candidates: Array<{ list: ListEntry; rect: Rect }> = [];
    for (const other of lists.values()) {
      const node = other.getElement();
      if (other === list || !node?.isConnected || other.isDisabled() || !accepts(other, active)) continue;
      // Lists inside the dragged element (a column's own cards) can't take it.
      if (active.element.isConnected && active.element.contains(node)) continue;
      candidates.push({ list: other, rect: getLayoutRect(node) });
    }
    return pickAdjacent(getLayoutRect(element), candidates, direction)?.list ?? null;
  };

  const keyboardIndicator = (
    current: Session,
    list: ListEntry,
    active: Active,
    direction: Coordinates,
  ): Coordinates | undefined => {
    const strategy = list.strategy();
    const step = strategy === 'vertical' ? direction.y : direction.x;
    let target = list;
    let next: number;
    if (!step) {
      const other = adjacentList(list, active, direction);
      if (!other) return undefined;
      target = other;
      const slot = items.get(current.slot)?.();
      next = slot?.isConnected ? insertionIndex(other, getLayoutRect(slot), current) : 0;
    } else {
      const keys = keysOf(list);
      const own = list.id === current.list ? keys.indexOf(current.slot) : -1;
      const marker = indicator.value?.list === list.id ? indicator.value : null;
      next = (marker ? marker.index : Math.max(own, 0)) + step;
      // Right before or after the active item the drop changes nothing: skip those positions.
      while (own >= 0 && (next === own || next === own + 1)) next += step;
      if (next < 0 || next > keys.length) return undefined;
    }
    const keys = keysOf(target);
    const value: SortableIndicator =
      next < keys.length
        ? { list: target.id, index: next, key: keys[next]!, side: 'before' }
        : { list: target.id, index: next, key: keys[keys.length - 1] ?? null, side: 'after' };
    showIndicator(value);
    const element = (value.key == null ? null : items.get(value.key)?.()) ?? target.getElement();
    if (!element?.isConnected) return undefined;
    revealElement(element);
    return getCenter(getLayoutRect(element));
  };

  /**
   * Keyboard sorting by items (rfcs/0001-v3.md §10): the arrow along the list moves
   * the slot by one, the perpendicular one moves it to the adjacent list (kanban),
   * and in grids up/down go to the nearest item of the next row.
   */
  const getKeyboardCoordinates = async (
    _event: KeyboardEvent,
    { active, direction }: KeyboardMoveContext,
  ): Promise<Coordinates | undefined> => {
    const current = session.value;
    if (!current || current.activeKey !== active.id || current.external) return;
    const marker = indicator.value;
    const list = marker ? lists.get(marker.list) : current.list == null ? undefined : lists.get(current.list);
    // Trees navigate depth themselves; copies over their palette have no slot to move.
    if (!list || list.project) return;
    const center = () => {
      const element = items.get(current.slot)?.() ?? items.get(current.activeKey)?.();
      return element?.isConnected ? getCenter(getLayoutRect(element)) : undefined;
    };
    if (list.placeholder() === 'indicator') return keyboardIndicator(current, list, active, direction) ?? center();

    const strategy = list.strategy();
    // A block moves by items as one unit.
    const keys = viewOf(list, current);
    const position = keys.indexOf(current.slot);
    const slot = items.get(current.slot)?.();
    if (position === -1 || !slot?.isConnected) return center();
    const slotRect = getLayoutRect(slot);

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
    if (index !== null) moveActive(target, index, null);

    await nextTick();
    if (session.value !== current) return;
    const element = items.get(current.slot)?.();
    if (!element?.isConnected) return center();
    revealElement(element);
    if (target !== list) manager.getDraggable(current.slot)?.getFocusTarget()?.focus({ preventScroll: true });
    return getCenter(getLayoutRect(element));
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
      const list = lists.get(current.origin.list);
      return sortableTexts.start(subjectOf(current), {
        list: current.origin.list,
        index: current.origin.index,
        length: list ? list.getKeys().length : 0,
      });
    },
    onDragOver: (event) => {
      const current = ours(event);
      const spot = current && spotOf(current);
      if (!spot) return undefined;
      // '' tells the manager there is nothing new, without cancelling a pending text.
      const key = spotKey(spot);
      if (key === spokenSpot) return '';
      spokenSpot = key;
      return sortableTexts.over(subjectOf(current), spot);
    },
    onDragEnd: (event) => (announced?.key === event.active.id ? announced.text : undefined),
    onDragCancel: (event) => (announced?.key === event.active.id ? announced.text : undefined),
  };

  // ─── Wiring ──────────────────────────────────────────────────────────────────

  const removeMonitor = manager.addMonitor({
    onDragStart: start,
    onDragMove: move,
    onBeforeDrop: beforeDrop,
    onDragEnd: end,
    onDragCancel: cancel,
    getKeyboardCoordinates,
  });
  const removeAnnouncer = manager.addAnnouncer(announcer);
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
    lookup,
    keysOf,
    indexOf,
    accepts,
    isInert,
    captureLayout,
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
