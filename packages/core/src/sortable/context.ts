/**
 * The state of a sortable group and the session of a drag. Every module of the group
 * gets the group (`GroupContext`) passed in and keeps no state of its own, so the
 * groups of several providers stay independent.
 */

import { shallowRef, type ShallowRef } from 'vue';
import type { Coordinates, DnDEvent, Key, Rect, Size, SortableIndicator } from '../types';
import type { DnDManager } from '../core/manager';
import type { ListEntry } from './entry';
import type { DropResult } from './drop';
import type { Hysteresis } from './stability';
import type { SortableAnnouncement, SortableSpot } from './announcements';
import type { SortableMode } from './modes/mode';
import type { NearSet } from './flip';
import type { AutoPass } from './autoAnimate';
import { patchIndexMap } from './draft';

export interface Session {
  activeKey: Key;
  /**
   * Dragged key the slot stands for: the active key, unless that is a tree node riding in
   * another selected one (VS Code), which then leads the drag with the active node inside.
   */
  lead: Key;
  /** Every moved key in document order (multi-drag), the lead included. */
  keys: Key[];
  /** Where the lead started; `list` is `null` for an external draggable. */
  origin: { list: Key | null; index: number };
  /** Key holding the active slot in the drafts: the lead, its copy or a created item. */
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
  /**
   * What the slot is (`modes/`): the dragged item itself (`sort`), its copy (`copy`) or an
   * item made for a plain draggable (`insert`). An exchange held is `swap` (see `modeOf`).
   */
  mode: SortableMode;
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
  /** `event.preventDefault()` in `onBeforeDrop` or `onDrop`: the drop isn't written. */
  prevented: boolean;
  /** Keyboard: resting on a drop target in the item `key`, reached with the arrow `direction`. */
  stop: { key: Key; direction: Coordinates } | null;
  /** Keyboard: on the plain drop target `away` (a trash zone) the arrows took the drag to, past the list. */
  away: Key | null;
}

/** What every session starts with, whatever is dragged. */
export type SessionStart = Omit<
  Session,
  'lead' | 'keys' | 'origin' | 'slot' | 'list' | 'others' | 'stacked' | 'grouped' | 'block' | 'base' | 'mode'
>;

export interface GroupContext {
  name: string;
  manager: DnDManager;
  lists: Map<Key, ListEntry>;
  /** Elements of the registered items, by key. */
  items: Map<Key, () => HTMLElement | null>;
  session: ShallowRef<Session | null>;
  /** Insertion line of `placeholder: 'indicator'` lists, while the pointer is over one. */
  indicator: ShallowRef<SortableIndicator | null>;
  indexCache: WeakMap<readonly Key[], Map<Key, number>>;
  /** Per list, its last draft that has a map in `indexCache`: the next draft takes the map over. */
  indexedDrafts: WeakMap<ListEntry, readonly Key[]>;
  /** Live state of the provider's `copyModifier`. */
  copyHeld: () => boolean;

  // FLIP (flip.ts)
  /** Bumped by every change of the drafts: a FLIP pass runs around the render. */
  version: ShallowRef<number>;
  /** Others of a finished `'stack'` drag: they fly out of the overlay into their slots. */
  returning: { keys: Set<Key>; from: Rect } | null;
  /** The next FLIP pass is the pickup of a `'group'` drag: the others travel into the block, from other lists too. */
  gathering: boolean;
  /** Items worth a FLIP during a drag: those near the visible area (see `flip.ts`). */
  near: NearSet | null;
  /** Keys registered while a FLIP pass waits for its render: the items that render creates. */
  fresh: Set<Key> | null;
  /** A drag's FLIP pass waits for its render: changes of the sources it renders are the drag's. */
  dragPass: boolean;

  // Changes no drag made (autoAnimate.ts)
  /** Lists whose items changed, measured before the change renders. */
  auto: AutoPass | null;
  /** Copies of items that left, still animating out, by key. */
  leaving: Map<Key, () => void>;

  /** List whose strategy and gap the overlay column follows. */
  columnList: Key | null;

  /**
   * Drop targets inside items, as of the target detection at `at` (that frame's pointer):
   * the middle band of each item holding one that takes the drag, by key, and the `ids`
   * of the targets that counted.
   */
  targets: { at: Coordinates | null; bands: Map<Key, Rect>; ids: Set<Key> };

  /** Pointer of the last move, and the projections run again for it (`followBlock`). */
  movedAt: Coordinates | null;
  followed: number;
  /** A pending `followBlock` pass: the drop waits for it. */
  following: Promise<void> | null;

  /** Text for the end or cancel announcement, and what it is about, computed while the session still existed. */
  announced: ({ key: Key } & SortableAnnouncement) | null;
  /** Last position announced (or picked up at), so an unchanged position isn't spoken again. */
  spokenSpot: string | null;
}

export const createContext = (manager: DnDManager, name: string): GroupContext => ({
  name,
  manager,
  lists: new Map(),
  items: new Map(),
  session: shallowRef(null),
  indicator: shallowRef(null),
  indexCache: new WeakMap(),
  indexedDrafts: new WeakMap(),
  copyHeld: () => false,
  version: shallowRef(0),
  returning: null,
  gathering: false,
  near: null,
  fresh: null,
  dragPass: false,
  auto: null,
  leaving: new Map(),
  columnList: null,
  targets: { at: null, bands: new Map(), ids: new Set() },
  movedAt: null,
  followed: 0,
  following: null,
  announced: null,
  spokenSpot: null,
});

export const sameKeys = (a: readonly Key[], b: readonly Key[]) =>
  a.length === b.length && a.every((key, index) => key === b[index]);

export const keysOf = (list: ListEntry) => list.draft.value ?? list.getKeys();

/** The drag is over a drop target that is no list of this group (a trash zone, a target inside an item). */
export const isForeign = (g: GroupContext, event: DnDEvent) => !!event.over && !g.lists.has(event.over.id);

/** The list with this id; none for `null` (no list holds the slot, an external drag's origin). */
export const listOf = (g: GroupContext, id: Key | null) => (id == null ? undefined : g.lists.get(id));

/** A position in a list as announced, out of the list's current length. */
export const spotIn = (g: GroupContext, list: Key, index: number): SortableSpot => ({
  list,
  index,
  length: g.lists.get(list)?.getKeys().length ?? 0,
});

export const indexMap = (g: GroupContext, keys: readonly Key[]) => {
  let map = g.indexCache.get(keys);
  if (!map) {
    map = new Map(keys.map((key, index) => [key, index]));
    g.indexCache.set(keys, map);
  }
  return map;
};

/**
 * Key → index in `list`'s current order. A new draft takes over the map of the list's
 * previous one, patched over the run that changed (see `patchIndexMap`).
 */
export const indicesOf = (g: GroupContext, list: ListEntry): Map<Key, number> => {
  const draft = list.draft.value;
  if (!draft) return indexMap(g, list.getKeys());
  if (g.indexCache.has(draft)) return g.indexCache.get(draft)!;
  const previous = g.indexedDrafts.get(list);
  const map = previous && g.indexCache.get(previous);
  if (map && patchIndexMap(map, previous!, draft)) {
    g.indexCache.delete(previous!);
    g.indexCache.set(draft, map);
  }
  g.indexedDrafts.set(list, draft);
  return indexMap(g, draft);
};

export const indexOf = (g: GroupContext, list: ListEntry, key: Key) => indicesOf(g, list).get(key) ?? -1;

export const lookup = (g: GroupContext, key: Key): unknown => {
  const snapshot = g.session.value?.items;
  if (snapshot?.has(key)) return snapshot.get(key);
  for (const list of g.lists.values()) {
    const item = list.getItem(key);
    if (item !== undefined) return item;
  }
  return undefined;
};

export const listOfKey = (g: GroupContext, key: Key, useDraft: boolean): ListEntry | undefined => {
  for (const list of g.lists.values()) {
    if ((useDraft ? indicesOf(g, list) : indexMap(g, list.getKeys())).has(key)) return list;
  }
  return undefined;
};

/** Lists in document order, so multi-drag keys from several lists insert in the order the user sees. */
export const orderedLists = (g: GroupContext): ListEntry[] =>
  [...g.lists.values()].sort((a, b) => {
    const x = a.getElement();
    const y = b.getElement();
    if (!x || !y || x === y) return 0;
    return x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
