/**
 * A sortable group: lists that exchange items. Holds the draft order of every list
 * during a drag, projects the pointer onto it, commits the result on drop, and runs
 * FLIP for every change it causes.
 */

import { effectScope, nextTick, shallowRef, watch, type ShallowRef } from 'vue';
import type {
  Active,
  BeforeDropResult,
  DnDEndEvent,
  DnDEvent,
  DragItem,
  DropOutside,
  Key,
  LayoutAnimation,
  MaybePromise,
  Rect,
  Size,
  SortableDropEvent,
  SortablePlaceholder,
  SortablePutContext,
  SortableStrategy,
} from '../types';
import type { DnDManager } from '../core/manager';
import { fadeIn, flip, getLayoutRect, getRect, type FlipEntry } from '../animation/layout';
import { projectIndex, type ProjectionItem } from './projection';

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
  origin: { list: Key; index: number };
  /** List currently holding the active item's slot. */
  list: Key;
  lock: Key | null;
  /** Item objects at drag start, so keys can be mapped back across lists. */
  items: Map<Key, unknown>;
  size: Size;
  result: DropResult | null;
}

interface Snapshot {
  element: HTMLElement;
  rect: Rect;
}

export interface SortableGroup {
  name: string;
  manager: DnDManager;
  session: ShallowRef<Session | null>;
  addList(entry: ListEntry): () => void;
  registerItem(key: Key, getElement: () => HTMLElement | null): () => void;
  lookup(key: Key): unknown;
  keysOf(list: ListEntry): Key[];
  indexOf(list: ListEntry, key: Key): number;
  accepts(list: ListEntry, active: Active): boolean;
  captureLayout(): void;
}

const registries = new WeakMap<DnDManager, Map<string, SortableGroup>>();

const sameKeys = (a: Key[], b: Key[]) => a.length === b.length && a.every((key, index) => key === b[index]);

function createGroup(manager: DnDManager, name: string, release: () => void): SortableGroup {
  const lists = new Map<Key, ListEntry>();
  const items = new Map<Key, () => HTMLElement | null>();
  const session = shallowRef<Session | null>(null);
  const version = shallowRef(0);
  const indexCache = new WeakMap<Key[], Map<Key, number>>();
  const scope = effectScope(true);

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
    const activeKey = manager.active.value?.id;
    for (const [key, getElement] of items) {
      const element = getElement();
      if (!element?.isConnected) continue;
      const list = listOfKey(key, true);
      if (!list) continue;
      const before = snapshot.get(key);
      if (!before) {
        if (fadeAppearing && key !== activeKey) fadeIn(element, list.animation());
        continue;
      }
      // The active slot entering another list was recreated: sliding it in from the
      // old list would be clipped by the new scroller, and the overlay shows it anyway.
      if (key === activeKey && before.element !== element) continue;
      const entries = byList.get(list) ?? [];
      entries.push({ key, element, first: before.rect });
      byList.set(list, entries);
    }
    for (const [list, entries] of byList) flip(entries, list.animation());
  };

  scope.run(() => {
    let snapshot = new Map<Key, Snapshot>();
    watch(version, () => (snapshot = capture()), { flush: 'pre' });
    watch(version, () => animate(snapshot, true), { flush: 'post' });
  });

  const bump = () => version.value++;

  /** For layout changes the library didn't cause (virtualizer re-measures). Free while idle. */
  const captureLayout = () => {
    if (manager.status.value === 'idle') return;
    const snapshot = capture();
    void nextTick(() => animate(snapshot, false));
  };

  // ─── Session ─────────────────────────────────────────────────────────────────

  const itemTypes = (key: Key): string[] => manager.getDraggable(key)?.getTypes() ?? [name];

  const accepts = (list: ListEntry, active: Active) => {
    const current = session.value;
    if (!current || current.activeKey !== active.id || list.isDisabled()) return false;
    if (list.id === current.origin.list) return true;
    if (lists.get(current.origin.list)?.pull() === false) return false;
    return list.canPut({
      keys: current.keys,
      items: current.keys.map(lookup),
      types: [...new Set(current.keys.flatMap(itemTypes))],
      from: current.origin.list,
      to: list.id,
    });
  };

  const start = (event: DnDEvent) => {
    const origin = listOfKey(event.active.id, false);
    if (!origin) return;
    const snapshot = new Map<Key, unknown>();
    const order = new Map<Key, number>();
    for (const list of lists.values()) {
      for (const key of list.getKeys()) {
        snapshot.set(key, list.getItem(key));
        order.set(key, order.size);
      }
    }
    const activeKey = event.active.id;
    const keys = event.active.ids
      .filter((key) => order.has(key))
      .sort((a, b) => order.get(a)! - order.get(b)!);

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

    const placeholder = origin.placeholder();
    const others = new Set(keys.filter((key) => key !== activeKey));
    session.value = {
      activeKey,
      keys,
      origin: { list: origin.id, index: origin.getKeys().indexOf(activeKey) },
      list: origin.id,
      lock: null,
      items: snapshot,
      size: { width: event.active.rect.width, height: event.active.rect.height },
      result: null,
    };
    for (const list of lists.values()) {
      const source = list.getKeys();
      const draft =
        placeholder === 'item' && others.size ? source.filter((key) => !others.has(key)) : [...source];
      list.draft.value = list.prepareDraft?.(draft, { activeKey, keys }) ?? draft;
    }
    bump();
  };

  const moveActive = (target: ListEntry, index: number) => {
    const current = session.value!;
    const from = lists.get(current.list);
    if (!from) return;
    if (from === target) {
      const keys = [...keysOf(from)];
      const position = keys.indexOf(current.activeKey);
      if (position === -1 || position === index) return;
      keys.splice(position, 1);
      keys.splice(index, 0, current.activeKey);
      from.draft.value = keys;
    } else {
      from.draft.value = keysOf(from).filter((key) => key !== current.activeKey);
      const keys = [...keysOf(target)];
      keys.splice(Math.min(index, keys.length), 0, current.activeKey);
      target.draft.value = keys;
      current.list = target.id;
    }
    bump();
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

  const move = (event: DnDEvent) => {
    const current = session.value;
    if (!current || !event.over?.accepted) return;
    const target = lists.get(event.over.id);
    if (!target || target.isDisabled()) return;
    if (target.placeholder() !== 'item') return;
    const sameList = target.id === current.list;
    if (sameList && target.id === current.origin.list && !target.canSort()) return;

    const keys = keysOf(target);
    const items = collect(target);
    const activeIndex = sameList ? indexOf(target, current.activeKey) : -1;
    if (target.project) {
      const index = target.project(event, { keys, items, activeKey: current.activeKey, activeIndex });
      if (index != null) moveActive(target, index);
    } else {
      const projection = projectIndex({
        strategy: target.strategy(),
        pointer: event.pointer,
        items,
        activeKey: current.activeKey,
        activeIndex,
        length: keys.length,
        lock: current.lock,
      });
      current.lock = projection.lock;
      if (projection.index != null) moveActive(target, projection.index);
    }
    lists.get(current.list)?.afterMove?.(event);
  };

  const computeResult = (): DropResult | null => {
    const current = session.value!;
    const next = new Map<ListEntry, Key[]>();
    for (const list of lists.values()) {
      const draft = keysOf(list);
      const keys =
        list.id === current.list
          ? draft.flatMap((key) => (key === current.activeKey ? current.keys : [key]))
          : draft;
      if (list.hasChanges ? list.hasChanges(keys) : !sameKeys(keys, list.getKeys())) {
        next.set(list, keys);
      }
    }
    if (!next.size) return null;
    const target = lists.get(current.list)!;
    const finalKeys = next.get(target) ?? target.getKeys();
    return {
      next,
      event: {
        keys: current.keys,
        items: current.keys.map(lookup),
        accepted: current.keys,
        rejected: [],
        from: { ...current.origin },
        to: { list: target.id, index: finalKeys.indexOf(current.activeKey) },
        sameList: current.origin.list === target.id,
        mode: 'move',
      },
    };
  };

  const reset = () => {
    if (!session.value) return;
    for (const list of lists.values()) {
      list.draft.value = null;
      list.reset?.();
    }
    session.value = null;
    bump();
  };

  const isForeign = (event: DnDEvent) => !!event.over && !lists.has(event.over.id);

  const beforeDrop = (event: DnDEvent): MaybePromise<BeforeDropResult> => {
    const current = session.value;
    if (!current || isForeign(event)) return;
    if (!event.over && lists.get(current.list)?.dropOutside() === 'cancel') return false;
    current.result = computeResult();
    if (!current.result) return;
    return lists.get(current.result.event.to.list)?.beforeDrop?.(current.result.event);
  };

  const end = (event: DnDEndEvent) => {
    const current = session.value;
    if (!current) return;
    const result = isForeign(event) ? null : (current.result ?? computeResult());
    if (result) {
      for (const [list, keys] of result.next) list.commit(keys, lookup);
    }
    reset();
    if (result) lists.get(result.event.to.list)?.afterDrop?.(result.event);
  };

  const removeMonitor = manager.addMonitor({
    onDragStart: start,
    onDragMove: move,
    onBeforeDrop: beforeDrop,
    onDragEnd: end,
    onDragCancel: reset,
  });

  return {
    name,
    manager,
    session,
    addList(entry) {
      lists.set(entry.id, entry);
      return () => {
        if (lists.get(entry.id) !== entry) return;
        lists.delete(entry.id);
        if (lists.size) return;
        removeMonitor();
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
