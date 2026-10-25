/**
 * Where the pointer puts the dragged nodes in a tree: the list projection, plus
 * hover-to-nest (the middle band of a row drops into it).
 */

import type { Coordinates, Key } from '../../types';
import { projectIndex, projectIndicator, type IndicatorProjection, type ProjectionItem } from '../projection';
import type { KeySet } from './depth';

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
  /** Rows that keep the slot where it is while hovered, as the active row does (the originals of a copy). */
  still?: KeySet;
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
 * steps as in lists. Over a `still` row (the original of a copy) nothing moves: a copy
 * doesn't go into its own original just because the drag started over it.
 */
export function projectTreeIndex(args: TreeIndexArgs): TreeIndexProjection {
  const { pointer, items, activeKey, activeIndex, length, canNestInto, still } = args;
  const hit = rowUnder(items, pointer, activeKey);
  if (hit && still?.has(hit.key)) return { index: null, nest: null, hit };
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
  /** Rows that travel with the drag (the dragged nodes and their subtrees; the originals of a copy): no line on them. */
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
