/**
 * Where the active item should go, given the pointer and the mounted items of a list.
 * Pure functions: the group feeds them layout rects (without in-flight FLIP offsets).
 */

import type { Coordinates, Key, Rect, SortableStrategy } from '../types';
import { containsPoint, getCenter } from '../animation/layout';

export interface ProjectionItem {
  key: Key;
  /** Index in the list's draft. */
  index: number;
  rect: Rect;
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
}

export interface Projection {
  /** New index of the active item in the target draft; `null` keeps the current position. */
  index: number | null;
  lock: Key | null;
}

const AXES = {
  vertical: { axis: 'y', start: 'top', end: 'bottom' },
  horizontal: { axis: 'x', start: 'left', end: 'right' },
} as const;

type Axis = (typeof AXES)[keyof typeof AXES];

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
  // Same list, pointer in a gap or beside the items: keep the position. Moving to
  // the nearest edge here is what made v2 items "teleport" on lateral drift.
  return null;
};

/**
 * Lists: an item counts as hovered when the pointer is within its band on the main
 * axis, so drifting sideways keeps sorting. The active item moves past a neighbour
 * only once the pointer crosses the neighbour's center in the direction of travel.
 * After the move the neighbour's center is on the other side of the pointer, so
 * items of different sizes can't swap back and forth.
 */
const projectList = (args: ProjectArgs): Projection => {
  const axis = AXES[args.strategy === 'horizontal' ? 'horizontal' : 'vertical'];
  const { pointer, items, activeKey, activeIndex, length } = args;
  const p = pointer[axis.axis];
  const hit = items.find(
    (item) => item.key !== activeKey && p >= item.rect[axis.start] && p <= item.rect[axis.end],
  );
  if (!hit) return { index: projectEdges(p, items, axis, activeIndex, length), lock: null };

  const center = (hit.rect[axis.start] + hit.rect[axis.end]) / 2;
  if (activeIndex === -1) return { index: p < center ? hit.index : hit.index + 1, lock: null };
  if (hit.index > activeIndex && p > center) return { index: hit.index, lock: null };
  if (hit.index < activeIndex && p < center) return { index: hit.index, lock: null };
  return { index: null, lock: null };
};

/**
 * Grids: entering an item moves the active item to its slot. The item that moved
 * is locked until the pointer leaves it, which stops ping-pong between cells of
 * different sizes.
 */
const projectGrid = (args: ProjectArgs): Projection => {
  const { pointer, items, activeKey, activeIndex, length } = args;
  let lock = args.lock;
  if (lock != null) {
    const locked = items.find((item) => item.key === lock);
    if (!locked || !containsPoint(locked.rect, pointer)) lock = null;
  }
  const hit = items.find((item) => item.key !== activeKey && containsPoint(item.rect, pointer));
  if (hit) {
    if (hit.key === lock) return { index: null, lock };
    if (activeIndex === -1) {
      const before = pointer.x < getCenter(hit.rect).x;
      return { index: before ? hit.index : hit.index + 1, lock: hit.key };
    }
    return { index: hit.index, lock: hit.key };
  }
  if (!items.length) return { index: activeIndex === -1 ? 0 : null, lock };
  const last = items[items.length - 1]!;
  const afterLast =
    pointer.y > last.rect.bottom ||
    (pointer.y >= last.rect.top && pointer.x > last.rect.right);
  if (afterLast && last.index === length - 1 && activeIndex !== length - 1) {
    return { index: activeIndex === -1 ? length : length - 1, lock };
  }
  return { index: null, lock };
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
  const hit = items.find((item) => containsPoint(item.rect, pointer));
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
