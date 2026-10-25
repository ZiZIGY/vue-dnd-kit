/**
 * Where the active item should go, given the pointer and the mounted items of a list.
 * Pure functions: the group feeds them layout rects (without in-flight FLIP offsets).
 */

import type { Coordinates, Key, Rect, SortableStrategy } from '../types';
import { containsPoint, createRect, getCenter } from '../animation/layout';

export interface ProjectionItem {
  key: Key;
  /** Index in the list's draft. A multi-drag block counts once: its members share the slot's index. */
  index: number;
  rect: Rect;
  /**
   * Multi-drag `'group'`: a dragged item travelling with the slot, before (`-1`) or
   * after (`1`) it in the block.
   */
  side?: -1 | 1;
}

export interface ProjectArgs {
  strategy: SortableStrategy;
  pointer: Coordinates;
  /** Mounted items of the target list in draft order (may include the active item). */
  items: ProjectionItem[];
  activeKey: Key;
  /** Index of the active item in the target draft; -1 when it comes from another list. */
  activeIndex: number;
  /** Draft length of the target list. */
  length: number;
  /** Grid only: the item that just moved under the pointer, ignored until the pointer leaves it. */
  lock: Key | null;
  /**
   * Grid only: items holding a drop target for this drag. Their middle drops into them,
   * so their edges put the active item before or after them, as in lists, instead of
   * taking their cell: an item that moved to the next cell would run from the pointer.
   */
  targets?: ReadonlySet<Key>;
}

export interface Projection {
  /** New index of the active item in the target draft; `null` keeps the current position. */
  index: number | null;
  lock: Key | null;
  /** Item whose crossing triggered the move (`null` for edges): hysteresis applies to it. */
  key: Key | null;
}

const AXES = {
  vertical: { axis: 'y', start: 'top', end: 'bottom' },
  horizontal: { axis: 'x', start: 'left', end: 'right' },
} as const;

type Axis = (typeof AXES)[keyof typeof AXES];

const axisOf = (strategy: SortableStrategy): Axis =>
  AXES[strategy === 'horizontal' ? 'horizontal' : 'vertical'];

const inBand = (rect: Rect, p: number, { start, end }: Axis) => p >= rect[start] && p <= rect[end];

/** Pointer outside every item: before the first, after the last, or (cross-list) in a gap. */
const projectEdges = (
  p: number,
  items: ProjectionItem[],
  { start, end }: Axis,
  activeIndex: number,
  length: number,
): number | null => {
  if (!items.length) return activeIndex === -1 ? 0 : null;
  const first = items[0]!;
  const last = items[items.length - 1]!;
  if (p > last.rect[end] && last.index === length - 1) {
    if (activeIndex === -1) return length;
    return activeIndex === length - 1 ? null : length - 1;
  }
  if (p < first.rect[start] && first.index === 0) {
    return activeIndex === 0 ? null : 0;
  }
  if (activeIndex === -1) {
    const next = items.find((item) => p < (item.rect[start] + item.rect[end]) / 2);
    if (next) return next.index;
    return last.index === length - 1 ? length : null;
  }
  // Same list, pointer in the gap between two items: it is past the center of both,
  // so the slot goes between them. A frame can jump from the far half of an item
  // straight into the gap beyond it (fast swipes, coalesced input), which must not
  // leave the slot an item behind. Beyond mounted items (virtual lists) the position
  // stays: moving to the nearest edge is what made v2 items "teleport". The members of
  // a multi-drag block share the slot's index, so gaps inside the block and at its edges
  // keep the position too.
  const after = items.findIndex((item) => p < item.rect[start]);
  const next = items[after];
  const previous = items[after - 1];
  if (!next || !previous || next.index === activeIndex || previous.index === activeIndex) return null;
  const index = next.index > activeIndex ? next.index - 1 : next.index;
  return index === activeIndex ? null : index;
};

/** Mounted items of the block holding the slot (the slot and its `side` members), in draft order. */
const blockOf = (items: ProjectionItem[], activeIndex: number) => items.filter((item) => item.index === activeIndex);

/**
 * Multi-drag `'group'`: the pointer is over an item travelling with the slot, so the
 * block lags behind the overlay. It steps toward the pointer, past the neighbour on
 * that side, once that neighbour's center would end up behind the pointer: the
 * crossing rule of single items, seen from the block's edge, so a taller neighbour
 * can't swap back.
 */
const stepList = (args: ProjectArgs, side: -1 | 1, { axis, start, end }: Axis): Projection => {
  const { items, activeIndex } = args;
  const neighbour = items.find((item) => item.index === activeIndex + side);
  const block = blockOf(items, activeIndex);
  if (!neighbour || !block.length) return { index: null, lock: null, key: null };
  const size = neighbour.rect[end] - neighbour.rect[start];
  // After the step the neighbour starts where the block starts (forward) or ends where it ends.
  const center =
    side > 0 ? Math.min(...block.map((item) => item.rect[start])) + size / 2 : Math.max(...block.map((item) => item.rect[end])) - size / 2;
  const p = args.pointer[axis];
  return (side > 0 ? p > center : p < center)
    ? { index: activeIndex + side, lock: null, key: neighbour.key }
    : { index: null, lock: null, key: null };
};

/**
 * Grids: the same step as `stepList`. The neighbour takes the cell of the block's first
 * (forward) or last member; the block steps unless that puts the neighbour under the pointer.
 */
const stepGrid = (args: ProjectArgs, side: -1 | 1, lock: Key | null): Projection => {
  const { items, activeIndex } = args;
  const neighbour = items.find((item) => item.index === activeIndex + side);
  const block = blockOf(items, activeIndex);
  const cell = side > 0 ? block[0] : block[block.length - 1];
  if (!neighbour || !cell) return { index: null, lock, key: null };
  const landing = createRect(cell.rect.left, cell.rect.top, neighbour.rect.width, neighbour.rect.height);
  return containsPoint(landing, args.pointer)
    ? { index: null, lock, key: null }
    : { index: activeIndex + side, lock: null, key: neighbour.key };
};

/**
 * Lists: an item counts as hovered when the pointer is within its band on the main
 * axis, so drifting sideways keeps sorting. The active item moves past a neighbour
 * only once the pointer crosses the neighbour's center in the direction of travel.
 * After the move the neighbour's center is on the other side of the pointer, so
 * items of different sizes can't swap back and forth.
 *
 * Generally the slot goes next to the hovered item, on the side of its center the
 * pointer is on. Frames can be far apart (fast flicks, a busy main thread, WebKit
 * coalescing input), so the pointer may skip items and land in the near half of one
 * that isn't adjacent: the slot still catches up. For an adjacent item this is the
 * crossing rule above.
 */
const projectList = (args: ProjectArgs): Projection => {
  const axis = axisOf(args.strategy);
  const { pointer, items, activeKey, activeIndex, length } = args;
  const p = pointer[axis.axis];
  const keep: Projection = { index: null, lock: null, key: null };
  let hit: ProjectionItem | undefined;
  for (const item of items) {
    if (!inBand(item.rect, p, axis)) continue;
    // After a reorder the active slot itself is the target: nothing moves while the pointer is on it.
    if (item.key === activeKey) return keep;
    if (item.side) return stepList(args, item.side, axis);
    hit ??= item;
  }
  if (!hit) return { index: projectEdges(p, items, axis, activeIndex, length), lock: null, key: null };

  const center = (hit.rect[axis.start] + hit.rect[axis.end]) / 2;
  if (activeIndex === -1) return { index: p < center ? hit.index : hit.index + 1, lock: null, key: hit.key };
  // The slot goes to the side of the hovered item the pointer is on. For a direct
  // neighbour that means "past it once its center is crossed"; a pointer that skipped
  // whole items within one frame (fast drags, engines that coalesce input) still
  // lands next to the item it ended up over.
  const index =
    hit.index > activeIndex ? (p > center ? hit.index : hit.index - 1) : p < center ? hit.index : hit.index + 1;
  return index === activeIndex ? keep : { index, lock: null, key: hit.key };
};

/**
 * Grids: entering an item moves the active item to its slot. The item that moved
 * is locked until the pointer leaves it, which stops ping-pong between cells of
 * different sizes. Items from another list, and items you can drop into (`targets`),
 * go before or after the hovered item instead.
 */
const projectGrid = (args: ProjectArgs): Projection => {
  const { pointer, items, activeKey, activeIndex, length } = args;
  let lock = args.lock;
  if (lock != null) {
    const locked = items.find((item) => item.key === lock);
    if (!locked || !containsPoint(locked.rect, pointer)) lock = null;
  }
  let hit: ProjectionItem | undefined;
  for (const item of items) {
    if (!containsPoint(item.rect, pointer)) continue;
    if (item.key === activeKey) return { index: null, lock, key: null };
    if (item.side) return stepGrid(args, item.side, lock);
    hit ??= item;
  }
  if (hit) {
    if (hit.key === lock) return { index: null, lock, key: null };
    if (activeIndex !== -1 && !args.targets?.has(hit.key)) return { index: hit.index, lock: hit.key, key: hit.key };
    // Before or after the item, by the side of its center the pointer is on. Passing it
    // leaves the slot under the pointer, so it needs no lock (an entering item does).
    let index = pointer.x < getCenter(hit.rect).x ? hit.index : hit.index + 1;
    if (activeIndex !== -1 && hit.index > activeIndex) index--;
    if (index === activeIndex) return { index: null, lock, key: null };
    return { index, lock: activeIndex === -1 ? hit.key : lock, key: hit.key };
  }
  if (!items.length) return { index: activeIndex === -1 ? 0 : null, lock, key: null };
  const last = items[items.length - 1]!;
  const afterLast =
    pointer.y > last.rect.bottom ||
    (pointer.y >= last.rect.top && pointer.x > last.rect.right);
  if (afterLast && last.index === length - 1 && activeIndex !== length - 1) {
    return { index: activeIndex === -1 ? length : length - 1, lock, key: null };
  }
  return { index: null, lock, key: null };
};

export const projectIndex = (args: ProjectArgs): Projection =>
  args.strategy === 'grid' ? projectGrid(args) : projectList(args);

export interface IndicatorProjection {
  /** Insertion position in the list as rendered (the active item still in place). */
  index: number;
  key: Key | null;
  side: 'before' | 'after';
}

/**
 * Indicator mode: the list doesn't move, so a plain before/after split of the
 * hovered item is stable. `undefined` keeps the previous indicator (pointer in a gap).
 */
export const projectIndicator = (
  args: Omit<ProjectArgs, 'lock' | 'activeIndex'>,
): IndicatorProjection | null | undefined => {
  const { strategy, pointer, items, activeKey, length } = args;
  const hit =
    strategy === 'grid'
      ? items.find((item) => containsPoint(item.rect, pointer))
      : items.find((item) => inBand(item.rect, pointer[axisOf(strategy).axis], axisOf(strategy)));
  const alongX = strategy !== 'vertical';
  if (hit) {
    if (hit.key === activeKey) return null;
    const center = getCenter(hit.rect);
    const before = alongX ? pointer.x < center.x : pointer.y < center.y;
    return { index: before ? hit.index : hit.index + 1, key: hit.key, side: before ? 'before' : 'after' };
  }
  if (!items.length) return { index: 0, key: null, side: 'before' };
  const first = items[0]!;
  const last = items[items.length - 1]!;
  const afterLast = alongX
    ? pointer.y > last.rect.bottom || (pointer.y >= last.rect.top && pointer.x > last.rect.right)
    : pointer.y > last.rect.bottom;
  if (afterLast && last.index === length - 1) return { index: length, key: last.key, side: 'after' };
  const beforeFirst = alongX ? pointer.x < first.rect.left && pointer.y <= first.rect.bottom : pointer.y < first.rect.top;
  if (beforeFirst && first.index === 0) return { index: 0, key: first.key, side: 'before' };
  return undefined;
};

export interface SwapArgs {
  strategy: SortableStrategy;
  pointer: Coordinates;
  items: ProjectionItem[];
  activeKey: Key;
  /** Item the active one is currently exchanged with. */
  partner: Key | null;
}

/**
 * Swap behaviour: hovering an item exchanges it with the active one. The current
 * partner sits in the active item's original slot, so hovering it reverts the swap.
 * `partner: undefined` keeps the current state (pointer on the active slot or in a gap).
 */
export const projectSwap = ({ strategy, pointer, items, activeKey, partner }: SwapArgs): {
  partner: Key | null | undefined;
  key: Key | null;
} => {
  const axis = axisOf(strategy);
  const hit = items.find((item) =>
    strategy === 'grid' ? containsPoint(item.rect, pointer) : inBand(item.rect, pointer[axis.axis], axis),
  );
  if (!hit || hit.key === activeKey) return { partner: undefined, key: null };
  return { partner: hit.key === partner ? null : hit.key, key: hit.key };
};

// ─── Keyboard ──────────────────────────────────────────────────────────────────

/**
 * Grids: index of the nearest item (by center x) in the next row above or below
 * the active item. `null` when there is no row in that direction.
 */
export const nextRowIndex = (items: ProjectionItem[], active: Rect, direction: 1 | -1): number | null => {
  const x = getCenter(active).x;
  let row: number | null = null;
  let best: ProjectionItem | null = null;
  for (const item of items) {
    const ahead = direction > 0 ? item.rect.top >= active.bottom - 1 : item.rect.bottom <= active.top + 1;
    if (!ahead) continue;
    const edge = direction > 0 ? item.rect.top : -item.rect.bottom;
    // Items in the same row share their leading edge (within a pixel); masonry rows don't, so take the closest edge.
    if (row === null || edge < row - 1) {
      row = edge;
      best = item;
    } else if (edge <= row + 1) {
      const center = getCenter(item.rect).x;
      if (!best || Math.abs(center - x) < Math.abs(getCenter(best.rect).x - x)) best = item;
    }
  }
  return best?.index ?? null;
};

/** Closest container in the arrow's direction, by center distance (cross-axis offsets weigh double). */
export const pickAdjacent = <T extends { rect: Rect }>(
  from: Rect,
  candidates: T[],
  direction: Coordinates,
): T | null => {
  const origin = getCenter(from);
  let best: T | null = null;
  let score = Infinity;
  for (const candidate of candidates) {
    const center = getCenter(candidate.rect);
    const along = (center.x - origin.x) * direction.x + (center.y - origin.y) * direction.y;
    if (along <= 1) continue;
    const across = Math.abs((center.x - origin.x) * direction.y) + Math.abs((center.y - origin.y) * direction.x);
    const value = along + across * 2;
    if (value < score) {
      score = value;
      best = candidate;
    }
  }
  return best;
};
