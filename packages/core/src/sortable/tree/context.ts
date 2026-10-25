/**
 * The state of one sortable tree (`makeSortableTree`), passed to its layout, drop and
 * keyboard modules, and where the dragged nodes would land in it (`placement`).
 */

import type { ComputedRef, ShallowRef } from 'vue';
import type { Key, SortableTreeOptions, TreeProjection } from '../../types';
import type { DnDManager } from '../../core/manager';
import { read } from '../../utils/read';
import type { SortableGroup } from '../group';
import type { ListEntry } from '../entry';
import { blockHeight, type FlatTree, type TreeAccessors } from './flatten';
import { blockFilter, projectDepth, siblingIndexAt, type DepthFilter, type DraftPosition, type KeySet } from './depth';
import type { TreeMove } from './move';

const DEFAULT_INDENTATION = 24;

/** No rows travel: copies leave the dragged nodes where they are. */
const NO_ROWS: KeySet = new Set<Key>();

/** Projection plus the index among the new siblings. */
export interface Placement extends TreeProjection {
  index: number;
}

export interface Origin {
  parentKey: Key | null;
  index: number;
}

/** A projection and the draft position it was made in: the drop recounts the sibling index from it. */
export interface Spot {
  position: DraftPosition;
  projection: TreeProjection;
}

export interface DragState {
  /**
   * The dragged node the slot stands for: the grabbed one, or the selected node it rides
   * in (VS Code). It may come from another list, or be a plain draggable.
   */
  lead: Key;
  /** Place of the lead before the drag; `null` when it comes from another list. */
  origin: Origin | null;
  /** Places of the dragged nodes of this tree: they all leave them on drop (copies don't). */
  origins: Map<Key, Origin>;
  /**
   * Rows that travel with the drag → the dragged node they travel with: the dragged
   * nodes of this tree and their visible descendants. Hidden in item mode; in indicator
   * mode they stay, and the line never goes on them. Copying, nothing travels.
   */
  moving: Map<Key, Key>;
  startDepth: number;
  /**
   * Origin of the offset rule. Nodes of this tree: the start depth and pointer x (x is
   * filled by the first move). Items from another list have no meaningful start here:
   * the last hovered row's level, from the pointer x when that row was entered.
   */
  base: { depth: number; x: number | null; key: Key | null };
  /** The active item entered from another list (possibly coming back): anchor on rows. */
  followRows: boolean;
  /**
   * Row whose middle band was hovered last, and the pointer x at that moment. Until
   * the pointer hovers another row, the offset rule counts from that row's child
   * depth, so the nested placeholder doesn't jump back while the pointer rests on it.
   */
  nest: { key: Key; x: number } | null;
  /** `nesting: 'hover'`: level asked for by the last hovered edge band. */
  hoverDepth: number;
  /** Keyboard: slot and depth chosen by the last arrow key, applied by the next move. */
  pending: { index: number; depth: number } | null;
}

export interface DropInfo {
  from: Origin | null;
  to: Placement | null;
}

export interface TreeContext<T> {
  id: Key;
  manager: DnDManager;
  group: SortableGroup;
  options: SortableTreeOptions<T>;
  accessors: TreeAccessors<T>;
  /** A shallow copy that `setChildren` gives the children: `{ ...node, children }` by default. */
  withChildren: (node: T, children: T[]) => T;
  /** Flattened only when the data or the collapsed set changes. */
  flat: ComputedRef<FlatTree<T>>;
  draft: ShallowRef<Key[] | null>;
  /** Where the dragged nodes would land here: depth, parent, index among the new siblings. */
  placement: ShallowRef<Placement | null>;
  /** The drag, from the moment it starts in the tree's group. */
  state: DragState | null;
  /** The projection behind `placement`, with its draft position. */
  spot: Spot | null;
  /** `from` and `to` of the drop being decided (see `tree/drop.ts`). */
  dropInfo: DropInfo | null;
  /** The nodes a drop would put here (see `incomingNodes`). */
  incoming: { slot: Key; items: T[]; height: number } | null;
  /** The move a drop's `next` makes here; the event's `from` and `to` come with it. */
  prepared: { next: Key[]; move: TreeMove<T> } | null;
  /** The tree in its group. */
  entry: ListEntry;
}

export const source = <T>(t: TreeContext<T>) => read<readonly T[]>(t.options.items);

// Options are read when needed, so a ref or a getter applies from then on.
export const indentation = <T>(t: TreeContext<T>) => read(t.options.indentation) ?? DEFAULT_INDENTATION;

export const nesting = <T>(t: TreeContext<T>) => read(t.options.nesting) ?? 'both';

// The tree stays as it is; the line shows the drop.
export const indicating = <T>(t: TreeContext<T>) => read(t.options.placeholder) === 'indicator';

export const rows = <T>(t: TreeContext<T>) => t.flat.value.byKey;

/** Key of the slot in the drafts: the lead, its copy, or the node made for a plain draggable. */
export const slotKey = <T>(t: TreeContext<T>, current: DragState) => t.group.session.value?.slot ?? current.lead;

/** Copying: the dragged nodes stay where they are, their copies travel. */
export const copying = <T>(t: TreeContext<T>) => t.group.session.value?.mode.name === 'copy';

/** Rows that travel with the drag (see `DragState.moving`); none while copying. */
export const movingRows = <T>(t: TreeContext<T>, current: DragState): KeySet =>
  copying(t) ? NO_ROWS : current.moving;

/**
 * Rows the line never goes on (indicator mode): the travelling ones; while copying, the
 * originals, so a copy doesn't go into its own original just because the drag started
 * over it (the rows inside it take the copy).
 */
export const stillRows = <T>(t: TreeContext<T>, current: DragState): KeySet =>
  copying(t) ? current.origins : current.moving;

/** Places the dragged nodes of this tree leave on drop; none while copying. */
export const leaving = <T>(t: TreeContext<T>, current: DragState): Origin[] =>
  copying(t) ? [] : [...current.origins.values()];

/**
 * The nodes a drop would put here, for `canNest` and `maxDepth`: the dragged ones, their
 * copies, or the node `createItem` made; with the levels below the deepest of them
 * (collapsed ones included). Kept while the slot stays the same.
 */
const incomingNodes = <T>(t: TreeContext<T>) => {
  const session = t.group.session.value!;
  if (t.incoming?.slot !== session.slot) {
    const keys = session.keys.map((key) => session.mode.placed(session, key));
    const items = keys.map((key) => t.group.lookup(key) as T).filter((item) => item !== undefined);
    t.incoming = { slot: session.slot, items, height: blockHeight(items, t.accessors.getChildren) };
  }
  return t.incoming;
};

export const depthFilter = <T>(t: TreeContext<T>): DepthFilter => {
  const { items, height } = incomingNodes(t);
  return blockFilter(items, height, rows(t), read(t.options.maxDepth), t.options.canNest);
};

export const canNestInto = <T>(t: TreeContext<T>, key: Key) => {
  const row = rows(t).get(key);
  return !!row && depthFilter(t)(row.depth + 1, key);
};

/** The multi-drag block while it is in this tree (the slot alone in a single drag). */
export const blockHere = <T>(t: TreeContext<T>): Key[] => {
  const session = t.group.session.value;
  return session && session.list === t.id ? session.block : [];
};

/** Index of the slot in the draft as projection counts it (a block once); -1 when it isn't here. */
export const viewIndex = <T>(t: TreeContext<T>, current: DragState) => {
  const slot = slotKey(t, current);
  const at = t.draft.value ? t.group.indexOf(t.entry, slot) : -1;
  return at === -1 ? -1 : at - Math.max(blockHere(t).indexOf(slot), 0);
};

export const setSpot = <T>(
  t: TreeContext<T>,
  current: DragState,
  position: DraftPosition,
  projection: TreeProjection,
) => {
  t.spot = { position, projection };
  // Every dragged node of this tree leaves its place.
  const next: Placement = {
    ...projection,
    index: siblingIndexAt(position, projection, leaving(t, current)),
  };
  const previous = t.placement.value;
  if (
    !previous ||
    previous.depth !== next.depth ||
    previous.parentKey !== next.parentKey ||
    previous.index !== next.index
  ) {
    t.placement.value = next;
  }
};

export const clearSpot = <T>(t: TreeContext<T>) => {
  t.spot = null;
  t.placement.value = null;
};

export const place = <T>(t: TreeContext<T>, current: DragState, draftKeys: Key[], index: number, depth: number) => {
  const position: DraftPosition = { keys: draftKeys, index, rows: rows(t) };
  // An invalid slot (data that already breaks the rules) still gets the nearest depth.
  setSpot(t, current, position, projectDepth(position, depth, depthFilter(t)) ?? projectDepth(position, depth)!);
};
