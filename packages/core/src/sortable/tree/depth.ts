/**
 * Depth projection: a node's depth and parent follow from its neighbours in the draft
 * (the flat list of visible keys), so a move is a new index in the draft plus a depth
 * between those of the rows around it.
 */

import type { Key, TreeProjection } from '../../types';
import type { TreeRow } from './flatten';

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

/** The draft with `key` moved from `from` to `to` (or inserted at `to` when `from` is -1). */
export function moveKey(keys: readonly Key[], key: Key, from: number, to: number): Key[] {
  const next = [...keys];
  if (from !== -1) next.splice(from, 1);
  next.splice(Math.max(0, Math.min(to, next.length)), 0, key);
  return next;
}
