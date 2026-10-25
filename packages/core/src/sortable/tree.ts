/**
 * Pure tree logic for `makeSortableTree`: flattening, depth projection, hover-to-nest
 * and applying a move to the user's data.
 *
 * The draft of a tree is the flat list of visible keys (depth-first order). A node's
 * depth and parent follow from its neighbours in that list, so a move is a new index
 * in the draft plus a projected depth.
 */

import type { Coordinates, FlatNode, Key, TreeProjection } from '../types';
import { projectIndex, projectIndicator, type IndicatorProjection, type ProjectionItem } from './projection';

export interface TreeAccessors<T> {
  getKey: (node: T) => Key;
  getChildren: (node: T) => readonly T[] | undefined;
  setChildren: (node: T, children: T[]) => void;
}

/** What the projection needs to know about a visible node. */
export type TreeRow = Pick<FlatNode<unknown>, 'key' | 'depth' | 'parentKey' | 'index'>;

export interface FlatTree<T> {
  nodes: FlatNode<T>[];
  byKey: Map<Key, FlatNode<T>>;
}

// ─── Flattening ─────────────────────────────────────────────────────────────────

/** Visible nodes in depth-first order; children of collapsed nodes are skipped. O(N). */
export function flattenTree<T>(
  nodes: readonly T[],
  getKey: (node: T) => Key,
  getChildren: (node: T) => readonly T[] | undefined,
  collapsed?: ReadonlySet<Key>,
): FlatNode<T>[] {
  const result: FlatNode<T>[] = [];
  // Iterative, so deep trees can't overflow the stack.
  const stack: Array<{ siblings: readonly T[]; index: number; depth: number; parentKey: Key | null }> = [
    { siblings: nodes, index: 0, depth: 0, parentKey: null },
  ];
  while (stack.length) {
    const frame = stack[stack.length - 1]!;
    if (frame.index >= frame.siblings.length) {
      stack.pop();
      continue;
    }
    const index = frame.index++;
    const item = frame.siblings[index]!;
    const key = getKey(item);
    const children = getChildren(item);
    const isCollapsed = !!collapsed?.has(key);
    result.push({
      key,
      item,
      depth: frame.depth,
      parentKey: frame.parentKey,
      index,
      hasChildren: !!children?.length,
      collapsed: isCollapsed,
    });
    if (children?.length && !isCollapsed) {
      stack.push({ siblings: children, index: 0, depth: frame.depth + 1, parentKey: key });
    }
  }
  return result;
}

export function createFlatTree<T>(nodes: FlatNode<T>[]): FlatTree<T> {
  return { nodes, byKey: new Map(nodes.map((node) => [node.key, node])) };
}

/** End (exclusive) of the visible subtree of the node at `index` in a flat list. */
export function subtreeEnd(nodes: readonly Pick<TreeRow, 'depth'>[], index: number): number {
  const depth = nodes[index]!.depth;
  let end = index + 1;
  while (end < nodes.length && nodes[end]!.depth > depth) end++;
  return end;
}

/** Keys of the visible descendants of the node at `index` in a flat list. */
export function getDescendantKeys(nodes: readonly TreeRow[], index: number): Key[] {
  return nodes.slice(index + 1, subtreeEnd(nodes, index)).map((node) => node.key);
}

/** Levels below the deepest of `nodes` (a multi-drag block), collapsed children included. */
export const blockHeight = <T>(nodes: readonly T[], getChildren: (node: T) => readonly T[] | undefined): number =>
  nodes.reduce((height, node) => Math.max(height, subtreeHeight(node, getChildren)), 0);

/** Levels below `node`, collapsed children included (0 for a leaf). Used against `maxDepth`. */
export function subtreeHeight<T>(node: T, getChildren: (node: T) => readonly T[] | undefined): number {
  let height = 0;
  const stack: Array<{ node: T; level: number }> = [{ node, level: 0 }];
  while (stack.length) {
    const { node: current, level } = stack.pop()!;
    if (level > height) height = level;
    for (const child of getChildren(current) ?? []) stack.push({ node: child, level: level + 1 });
  }
  return height;
}

// ─── Depth projection ───────────────────────────────────────────────────────────

/**
 * Draft context: visible keys with the active key at `index`, and the rows of every
 * other key. The active key itself is never looked up (it may come from another list).
 */
export interface DraftPosition {
  keys: readonly Key[];
  index: number;
  rows: ReadonlyMap<Key, TreeRow>;
  /** `keys` leaves the active key out: it would be inserted at `index` (no copy per candidate slot). */
  inserted?: boolean;
}

/** Whether the active node may sit at `depth` under `parentKey` (`canNest`, `maxDepth`). */
export type DepthFilter = (depth: number, parentKey: Key | null) => boolean;

/** A set of keys, or a map keyed by them. */
export type KeySet = Pick<ReadonlySet<Key>, 'has' | 'size'>;

/**
 * `maxDepth` and `canNest` for the dragged nodes, a multi-drag block as one: the deepest
 * descendant (`height` levels below them) must stay within `maxDepth`, and `canNest`
 * must take every one of them under the parent.
 */
export const blockFilter =
  <T>(
    items: readonly T[],
    height: number,
    rows: ReadonlyMap<Key, { item: T }>,
    maxDepth?: number,
    canNest?: (node: T, parent: T) => boolean,
  ): DepthFilter =>
  (depth, parentKey) => {
    if (maxDepth != null && depth + height > maxDepth) return false;
    const parent = parentKey == null || !canNest ? undefined : rows.get(parentKey);
    return !parent || items.every((item) => canNest!(item, parent.item));
  };

const rowAt = ({ keys, rows }: DraftPosition, index: number): TreeRow | undefined => {
  const key = keys[index];
  return key === undefined ? undefined : rows.get(key);
};

/** Depths the active node can take between its neighbours: `[next.depth, prev.depth + 1]`. */
export function depthRange(position: DraftPosition): { min: number; max: number } {
  const prev = rowAt(position, position.index - 1);
  const next = rowAt(position, position.inserted ? position.index : position.index + 1);
  const max = prev ? prev.depth + 1 : 0;
  return { min: Math.min(next ? next.depth : 0, max), max };
}

/**
 * Ancestors before the active slot by depth: `chain[d]` is the nearest preceding node
 * with depth `d`, i.e. the parent the active node gets at depth `d + 1`. Walks back
 * only until the root level is found.
 */
const ancestorChain = (position: DraftPosition): Key[] => {
  const chain: Key[] = [];
  let want = Infinity;
  for (let i = position.index - 1; i >= 0 && want > 0; i--) {
    const row = rowAt(position, i);
    if (!row || row.depth >= want) continue;
    chain[row.depth] = row.key;
    want = row.depth;
  }
  return chain;
};

/** Parent of the active node at its draft position with the given depth. */
export function parentAt(position: DraftPosition, depth: number): Key | null {
  return depth <= 0 ? null : (ancestorChain(position)[depth - 1] ?? null);
}

/** Depth from the horizontal drag offset, relative to a base depth. */
export const offsetDepth = (baseDepth: number, offsetX: number, indentation: number): number =>
  baseDepth + Math.round(offsetX / indentation);

/**
 * Clamps `depth` between the neighbours, then lowers it while `filter` rejects it.
 * `null` when no depth fits at this position (the position itself is invalid).
 */
export function projectDepth(
  position: DraftPosition,
  depth: number,
  filter?: DepthFilter,
): TreeProjection | null {
  const { min, max } = depthRange(position);
  const chain = ancestorChain(position);
  for (let d = Math.max(min, Math.min(depth, max)); d >= min; d--) {
    const parentKey = d === 0 ? null : (chain[d - 1] ?? null);
    if (!filter || filter(d, parentKey)) return { depth: d, parentKey };
  }
  return null;
}

/**
 * The slot to move to when the pointer asks for `target`: the first one from `target`
 * back towards `from` where some depth fits. The pointer can skip several rows in one
 * frame; the slot then stops at the last valid one on the way, as it would row by row.
 * `null` when none fits (keep the current slot). `keys` is the draft with the active
 * key at `from` (-1: it comes from another list, only `target` is tried).
 */
export function nearestValidSlot(
  keys: readonly Key[],
  activeKey: Key,
  from: number,
  target: number,
  rows: ReadonlyMap<Key, TreeRow>,
  filter?: DepthFilter,
): number | null {
  const others = from === -1 ? keys : keys.filter((key) => key !== activeKey);
  const fits = (index: number) => !!projectDepth({ keys: others, index, rows, inserted: true }, Infinity, filter);
  if (from === -1) return fits(target) ? target : null;
  const step = target < from ? 1 : -1;
  for (let index = target; index !== from; index += step) {
    if (fits(index)) return index;
  }
  return null;
}

/**
 * Index the active node gets among its new siblings. `origins` are where the moved
 * nodes of this tree were before the drag (none for items from another list): every
 * earlier slot of the same parent they leave shifts the later siblings up by one.
 */
export function siblingIndexAt(
  position: DraftPosition,
  projection: TreeProjection,
  origins: ReadonlyArray<{ parentKey: Key | null; index: number }>,
): number {
  for (let i = position.index - 1; i >= 0; i--) {
    const row = rowAt(position, i);
    if (!row || row.depth > projection.depth) continue;
    if (row.depth < projection.depth) return 0;
    let shift = 0;
    for (const origin of origins) if (origin.parentKey === projection.parentKey && origin.index < row.index) shift++;
    return row.index + 1 - shift;
  }
  return 0;
}

/**
 * The draft position of a line at `gap` (an insertion index in `keys`, indicator mode),
 * with the `moving` rows (the dragged nodes and their subtrees) left out.
 */
export function gapPosition(
  keys: readonly Key[],
  gap: number,
  moving: KeySet,
  rows: ReadonlyMap<Key, TreeRow>,
): DraftPosition {
  if (!moving.size) return { keys, index: gap, rows, inserted: true };
  const others: Key[] = [];
  let index = 0;
  keys.forEach((key, i) => {
    if (moving.has(key)) return;
    if (i < gap) index++;
    others.push(key);
  });
  return { keys: others, index, rows, inserted: true };
}

// ─── Index projection ───────────────────────────────────────────────────────────

/** Middle band of a row, as a fraction of its height: hovering it nests into the row. */
export const NEST_BAND = { start: 0.25, end: 0.75 } as const;

const inNestBand = ({ rect }: ProjectionItem, { y }: Coordinates) =>
  rect.height > 0 &&
  (y - rect.top) / rect.height >= NEST_BAND.start &&
  (y - rect.top) / rect.height <= NEST_BAND.end;

/** Mounted row under the pointer, skipping `skip` (the active one) and the members of a block. */
const rowUnder = (items: ProjectionItem[], { y }: Coordinates, skip?: Key) =>
  items.find((item) => item.key !== skip && !item.side && y >= item.rect.top && y <= item.rect.bottom) ?? null;

export interface TreeIndexArgs {
  pointer: Coordinates;
  /** Mounted rows in draft order with layout rects (may include the active row). */
  items: ProjectionItem[];
  activeKey: Key;
  /** Index of the active key in the draft, -1 when it comes from another list. */
  activeIndex: number;
  /** Draft length. */
  length: number;
  /** Hover-to-nest: whether the active node may become a child of `key`. Omit to disable. */
  canNestInto?: (key: Key) => boolean;
}

export interface TreeIndexProjection {
  /** New draft index of the active key; `null` keeps it. */
  index: number | null;
  /** Row whose middle band is hovered and that accepts the active node as a child. */
  nest: Key | null;
  /** Row under the pointer (not the active one), if any. */
  hit: ProjectionItem | null;
}

/**
 * Hover-to-nest on top of the list projection. The middle band of a row that accepts
 * the active node places it right after that row (as its first child). Everything
 * else follows the vertical list rule (cross a neighbour's center to pass it), so the
 * slot is stable after the layout shifts. The edge bands therefore mean before/after.
 * The other members of a multi-drag block are never nested into: over them the block
 * steps as in lists.
 */
export function projectTreeIndex(args: TreeIndexArgs): TreeIndexProjection {
  const { pointer, items, activeKey, activeIndex, length, canNestInto } = args;
  const hit = rowUnder(items, pointer, activeKey);
  if (hit && canNestInto && inNestBand(hit, pointer) && canNestInto(hit.key)) {
    // Right after the row: removing the active slot above it shifts the row up by one.
    const index = activeIndex !== -1 && activeIndex < hit.index ? hit.index : hit.index + 1;
    return { index: index === activeIndex ? null : index, nest: hit.key, hit };
  }
  const { index } = projectIndex({
    strategy: 'vertical',
    pointer,
    items,
    activeKey,
    activeIndex,
    length,
    lock: null,
  });
  return { index, nest: null, hit };
}

export interface TreeIndicatorArgs {
  pointer: Coordinates;
  /** Mounted rows in draft order with layout rects. */
  items: ProjectionItem[];
  activeKey: Key;
  /** Draft length. */
  length: number;
  /** Rows that travel with the drag (the dragged nodes and their subtrees): no line on them. */
  moving: KeySet;
  /** Hover-to-nest, as in `projectTreeIndex`. */
  canNestInto?: (key: Key) => boolean;
}

/**
 * Indicator mode: the tree doesn't move, so the line goes before or after the hovered
 * row as in lists, and the middle band of a row that accepts the dragged nodes means
 * into it (`'inside'`, right after the row). No line over the rows that travel with
 * the drag. `undefined` keeps the previous line (pointer in a gap). The depth comes
 * on top, from the position (`gapPosition`).
 */
export function projectTreeIndicator(args: TreeIndicatorArgs): IndicatorProjection | null | undefined {
  const { pointer, items, moving, canNestInto } = args;
  const hit = rowUnder(items, pointer);
  if (hit && moving.has(hit.key)) return null;
  if (hit && canNestInto && inNestBand(hit, pointer) && canNestInto(hit.key)) {
    return { index: hit.index + 1, key: hit.key, side: 'inside' };
  }
  return projectIndicator({ ...args, strategy: 'vertical' });
}

/** The draft with `key` moved from `from` to `to` (or inserted at `to` when `from` is -1). */
export function moveKey(keys: readonly Key[], key: Key, from: number, to: number): Key[] {
  const next = [...keys];
  if (from !== -1) next.splice(from, 1);
  next.splice(Math.max(0, Math.min(to, next.length)), 0, key);
  return next;
}

// ─── Applying a move ────────────────────────────────────────────────────────────

interface Located<T> {
  node: T;
  parent: T | null;
  index: number;
}

/** Depth-first search for `key`; O(N). */
export function findTreeNode<T>(
  roots: readonly T[],
  key: Key,
  { getKey, getChildren }: Pick<TreeAccessors<T>, 'getKey' | 'getChildren'>,
): Located<T> | null {
  const stack: Array<{ siblings: readonly T[]; parent: T | null }> = [{ siblings: roots, parent: null }];
  while (stack.length) {
    const { siblings, parent } = stack.pop()!;
    for (let index = 0; index < siblings.length; index++) {
      const node = siblings[index]!;
      if (getKey(node) === key) return { node, parent, index };
      const children = getChildren(node);
      if (children?.length) stack.push({ siblings: children, parent: node });
    }
  }
  return null;
}

export interface TreeMove<T> {
  /** Moved nodes in drop order, each with its subtree. */
  keys: readonly Key[];
  /** Node to insert for a key that isn't in the tree yet (it comes from another list). */
  node?: (key: Key) => T | undefined;
  /**
   * Where the first node lands, side by side with the rest (the index among the
   * siblings left once every moved node is out); `null` removes the nodes (they left
   * for another list).
   */
  to: { parentKey: Key | null; index: number } | null;
}

/**
 * Moves nodes (each with its whole subtree) and returns the new root array. Children
 * arrays that change are replaced through `setChildren`; nodes are never copied, so
 * collapsed subtrees and the moved nodes' own children stay as they are. A moved node
 * inside another moved one leaves it. The root array is always a new array, so
 * `shallowRef` sources update too. Invalid moves (an unknown parent, or a parent inside
 * a moved subtree) return `roots` unchanged.
 */
export function applyTreeMove<T>(roots: readonly T[], move: TreeMove<T>, accessors: TreeAccessors<T>): T[] {
  const { getChildren, setChildren } = accessors;
  // Found before anything moves: a moved node may sit inside another one.
  const located = move.keys.map((key) => findTreeNode(roots, key, accessors));
  const nodes = move.keys
    .map((key, i) => located[i]?.node ?? move.node?.(key))
    .filter((node): node is T => node !== undefined);
  if (!nodes.length) return [...roots];

  let parent: T | null = null;
  if (move.to && move.to.parentKey != null) {
    parent = findTreeNode(roots, move.to.parentKey, accessors)?.node ?? null;
    if (parent === null || findTreeNode(nodes, move.to.parentKey, accessors)) return [...roots];
  }

  let nextRoots: T[] = [...roots];
  const childrenOf = (owner: T | null): readonly T[] => (owner === null ? nextRoots : (getChildren(owner) ?? []));
  const write = (owner: T | null, children: T[]) => {
    if (owner === null) nextRoots = children;
    else setChildren(owner, children);
  };

  // Every parent drops all its moved children at once: the order of nested moves doesn't matter.
  const moved = new Set(nodes);
  for (const owner of new Set(located.flatMap((place) => (place ? [place.parent] : [])))) {
    write(owner, childrenOf(owner).filter((child) => !moved.has(child)));
  }
  if (move.to) {
    const siblings = [...childrenOf(parent)];
    siblings.splice(Math.max(0, Math.min(move.to.index, siblings.length)), 0, ...nodes);
    write(parent, siblings);
  }
  return nextRoots;
}
