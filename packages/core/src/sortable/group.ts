/**
 * A sortable group: lists that exchange items. Holds the draft order of every list
 * during a drag, projects the pointer onto it, commits the result on drop, and runs
 * FLIP for every change it causes.
 *
 * The active slot is a key in the drafts. Usually it is the active item itself; when
 * copying it is the item's copy, and for a plain draggable from outside it is the
 * item `createItem` made. Projection, commit and FLIP only ever deal with that key.
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
import { revealElement } from './keyboard';
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
  /** Default `'stack'`. */
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
  /** A cross-list move just happened: the next frame is skipped while the layout settles. */
  settling: boolean;
  /** Last valid target and the pointer there: bridges one-frame gaps at list boundaries. */
  target: { list: Key; at: Coordinates } | null;
  /** A trash zone or `dropOutside: 'remove'` asked to remove the dragged items. */
  removed: boolean;
}

interface Snapshot {
  element: HTMLElement;
  rect: Rect;
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
  /** Text for the end or cancel announcement, computed while the session still existed. */
  let announced: { key: Key; text: string | undefined } | null = null;

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
      if (element?.isConnected) snapshot.set(key, { element, rect: getRect(element) });
    }
    return snapshot;
  };

  const animate = (snapshot: Map<Key, Snapshot>, fadeAppearing: boolean) => {
    const byList = new Map<ListEntry, FlipEntry[]>();
    const appearing: Array<{ element: HTMLElement; list: ListEntry }> = [];
    const landing = manager.landingKey.value ?? manager.active.value?.id;
    const back = returning;
    returning = null;
    for (const [key, getElement] of items) {
      const element = getElement();
      if (!element?.isConnected) continue;
      const list = listOfKey(key, true);
      if (!list) continue;
      let before = snapshot.get(key);
      if (!before && back?.keys.has(key)) {
        // Multi-drag items coming back out of the overlay.
        before = { element, rect: back.from };
        appearing.push({ element, list });
      } else if (!before) {
        if (fadeAppearing && key !== landing) fadeIn(element, list.animation());
        continue;
      }
      // The active slot entering another list was recreated: sliding it in from the
      // old list would be clipped by the new scroller, and the overlay shows it anyway.
      if (key === landing && before.element !== element) continue;
      const entries = byList.get(list) ?? [];
      entries.push({ key, element, first: before.rect });
      byList.set(list, entries);
    }
    for (const [list, entries] of byList) flip(entries, list.animation());
    for (const { element, list } of appearing) fadeIn(element, list.animation());
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

  /** Mirrors the session into the manager: overlay `mode` and where the overlay lands. */
  const syncManager = () => {
    const current = session.value;
    if (!current) return;
    const placed = current.list != null;
    manager.landingKey.value = placed && current.slot !== current.activeKey ? current.slot : null;
    const list = placed ? lists.get(current.list!) : undefined;
    let mode: DragMode = 'move';
    if (current.external) mode = placed ? 'insert' : 'move';
    else if (current.copying) mode = 'copy';
    else if (isSwapping(current, list)) mode = 'swap';
    manager.mode.value = mode;
  };

  const start = (event: DnDEvent) => {
    const activeKey = event.active.id;
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
      settling: false,
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
      session.value = {
        ...common,
        keys: [activeKey],
        origin: { list: null, index: -1 },
        slot: activeKey,
        list: null,
        others: new Set(),
        stacked: false,
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
    const stacked =
      others.size > 0 &&
      (originList.multiple?.() ?? 'stack') === 'stack' &&
      originList.placeholder() === 'item';
    const base = new Map<Key, Key[]>();
    for (const list of lists.values()) {
      const source = list.getKeys();
      const draft = stacked ? source.filter((key) => !others.has(key)) : [...source];
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
      base,
      external: false,
      copying: false,
    };
    session.value = current;

    const copy = wantsCopy(current) ? copyOf(current, activeKey) : null;
    if (copy != null) {
      // Copying: the source stays as it is; the copy appears once a list is hovered.
      current.copying = true;
      current.slot = copy;
      current.list = null;
      for (const list of lists.values()) list.draft.value = copyBase(list, current);
    } else {
      if (stacked) {
        const elements = [...others]
          .map((key) => items.get(key)?.())
          .filter((element): element is HTMLElement => !!element?.isConnected);
        collapseIntoOverlay(elements, event.active.rect, originList.animation());
      }
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

  /** Moves the slot to `index` of `target`'s draft, removing it from the list that held it. */
  const moveActive = (target: ListEntry, index: number, pointer: Coordinates | null) => {
    const current = session.value!;
    const slot = current.slot;
    const from = current.list == null ? undefined : lists.get(current.list);
    let passed: Set<Key>;
    if (from === target) {
      const keys = [...keysOf(from)];
      const position = keys.indexOf(slot);
      if (position === -1 || position === index) return;
      passed = passedKeys(keys, position, index);
      keys.splice(position, 1);
      keys.splice(index, 0, slot);
      from.draft.value = keys;
    } else {
      if (from) from.draft.value = keysOf(from).filter((key) => key !== slot);
      const keys = [...keysOf(target)];
      const at = Math.min(index, keys.length);
      passed = neighbourKeys(keys, at);
      keys.splice(at, 0, slot);
      target.draft.value = keys;
      current.list = target.id;
      current.settling = true;
    }
    current.hysteresis = pointer
      ? { keys: passed, list: from && from !== target ? from.id : null, at: pointer }
      : null;
    current.indicator = null;
    syncManager();
    bump();
    manager.announce('onDragOver');
  };

  /** Takes the slot out of every draft (a copy over its palette, an external item leaving). */
  const removeSlot = () => {
    const current = session.value!;
    const list = current.list == null ? undefined : lists.get(current.list);
    if (!list) return;
    list.draft.value = keysOf(list).filter((key) => key !== current.slot);
    current.list = null;
    syncManager();
    bump();
  };

  /** Over a list that can't be sorted: the active item goes back to where it started. */
  const returnToOrigin = (pointer: Coordinates | null) => {
    const current = session.value!;
    if (current.slot !== current.activeKey) return removeSlot();
    const origin = current.origin.list == null ? undefined : lists.get(current.origin.list);
    const index = origin ? (current.base.get(origin.id)?.indexOf(current.activeKey) ?? -1) : -1;
    if (origin && index >= 0) moveActive(origin, index, pointer);
  };

  const collect = (list: ListEntry): ProjectionItem[] => {
    const indices = indexMap(keysOf(list));
    const result: ProjectionItem[] = [];
    for (const [key, getElement] of items) {
      const index = indices.get(key);
      if (index === undefined) continue;
      const element = getElement();
      if (element?.isConnected) result.push({ key, index, rect: getLayoutRect(element) });
    }
    return result.sort((a, b) => a.index - b.index);
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
   * The new slot takes the old slot's place: after the nearest key that stays put.
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
      for (let i = keys.indexOf(current.slot) - 1; i >= 0; i--) {
        const key = keys[i]!;
        if (key !== current.activeKey && !current.others.has(key)) {
          after = key;
          break;
        }
      }
      anchor = { list: from, after };
    }
    for (const list of lists.values()) {
      let draft = copying ? copyBase(list, current) : (current.base.get(list.id) ?? [...list.getKeys()]);
      if (!copying && anchor) draft = draft.filter((key) => key !== slot);
      list.draft.value = draft;
    }
    current.copying = copying;
    current.slot = slot;
    current.swap = null;
    current.hysteresis = null;
    if (anchor) {
      const keys = [...keysOf(anchor.list)];
      const at = anchor.after == null ? 0 : keys.indexOf(anchor.after) + 1;
      keys.splice(at, 0, slot);
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

  const move = (event: DnDEvent) => {
    const current = session.value;
    if (!current || current.activeKey !== event.active.id) return;
    // Keyboard drags move the slot in getKeyboardCoordinates; trees project their own depth.
    if (event.active.sensor === 'keyboard' && !current.external) {
      const list = current.list == null ? undefined : lists.get(current.list);
      if (!list?.project) return;
    }
    syncCopy(current);
    // One frame after a cross-list move the layout is still settling (stability guard).
    if (current.settling) {
      current.settling = false;
      return;
    }
    current.hysteresis = settleHysteresis(current.hysteresis, event.pointer);

    const over = event.over;
    if (!over) {
      // Last valid target: a pointer a few pixels past a list boundary keeps it.
      if (current.target && distance(event.pointer, current.target.at) < HYSTERESIS) return;
      current.target = null;
      return leave(current);
    }
    const target = lists.get(over.id);
    if (!target || !over.accepted || target.isDisabled()) {
      current.target = null;
      return leave(current);
    }
    // The list the slot just left can't take it back until the pointer moves on.
    if (target.id !== current.list && blocksList(current.hysteresis, target.id)) return;
    current.target = { list: target.id, at: event.pointer };

    if (current.external) {
      // Each list makes its own item for the external draggable.
      const created = createdIn(target, current);
      if (created == null) return leave(current);
      if (current.slot !== created) {
        if (current.list != null) removeSlot();
        current.slot = created;
      }
    }

    if (target.placeholder() === 'indicator') return updateIndicator(target, event);
    setIndicator(null);
    if (isSwapping(current, target)) return updateSwap(target, event);
    if (current.swap != null) applySwap(null, null);

    const sameList = target.id === current.list;
    if (!target.canSort()) {
      if (sameList) return;
      if (target.id === current.origin.list) return returnToOrigin(event.pointer);
    }

    const keys = keysOf(target);
    const projectionItems = collect(target);
    const activeIndex = sameList ? indexOf(target, current.slot) : -1;
    let index: number | null;
    let trigger: Key | null = null;
    if (target.project) {
      index = target.project(event, { keys, items: projectionItems, activeKey: current.slot, activeIndex });
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
    if (index != null && !blocksKey(current.hysteresis, trigger)) moveActive(target, index, event.pointer);
    if (current.list != null) lists.get(current.list)?.afterMove?.(event);
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
    // Moved keys leave their places (in 'gaps' mode and indicator lists they are still in the drafts).
    const strip = moving ? new Set(moved.filter((key) => key !== slot)) : new Set<Key>();
    const back = moving
      ? rejected
          .map((key) => ({ key, source: current.sources.get(key)! }))
          .sort((a, b) => a.source.index - b.source.index)
      : [];

    const next = new Map<ListEntry, Key[]>();
    for (const [list, draft] of drafts) {
      let keys = draft.filter((key) => !strip.has(key));
      keys = list === target ? keys.flatMap((key) => (key === slot ? insert : [key])) : keys.filter((key) => key !== slot);
      // Rejected keys fly back to where they started.
      for (const { key, source } of back) {
        if (source.list === list.id && !keys.includes(key)) keys.splice(Math.min(source.index, keys.length), 0, key);
      }
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

    const who = subjectOf(current);
    let text: string | undefined;
    if (current.removed) {
      if (result) text = sortableTexts.removed(who, result.event.to.list);
    } else if (result && result.event.to.index >= 0) {
      const list = lists.get(result.event.to.list);
      text = sortableTexts.end(who, {
        list: result.event.to.list,
        index: result.event.to.index,
        length: list ? list.getKeys().length : 0,
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
    const keys = keysOf(list);
    const position = keys.indexOf(current.slot);
    const slot = items.get(current.slot)?.();
    if (position === -1 || !slot?.isConnected) return center();
    const slotRect = getLayoutRect(slot);

    let target = list;
    let index: number | null = null;
    let across = false;
    if (strategy === 'grid' && direction.y) {
      const others = collect(list).filter((item) => item.key !== current.slot);
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
    if (index !== null) {
      moveActive(target, index, null);
      // The keyboard decides every move: no layout-settling frame to skip.
      current.settling = false;
    }

    await nextTick();
    if (session.value !== current) return;
    const element = items.get(current.slot)?.();
    if (!element?.isConnected) return center();
    revealElement(element);
    if (target !== list) manager.getDraggable(current.slot)?.getFocusTarget()?.focus({ preventScroll: true });
    return getCenter(getLayoutRect(element));
  };

  // ─── Announcements ───────────────────────────────────────────────────────────

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
    return { list: current.list, index: keys.indexOf(current.slot), length: keys.length };
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
      return spot ? sortableTexts.over(subjectOf(current), spot) : undefined;
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
