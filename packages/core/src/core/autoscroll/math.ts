/**
 * Auto-scroll math (rfcs/0001-v3.md §11): edge zones, speeds, scroll intent and options.
 * Pure functions of numbers and rects; `dom.ts` measures, `loop.ts` runs them per frame.
 */

import type { AutoScrollOptions, Coordinates, Rect } from '../../types';

export interface Directions {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export const DEFAULT_AUTO_SCROLL: Required<AutoScrollOptions> = {
  threshold: 0.2,
  maxSpeed: 25,
  acceleration: 10,
};

const MIN_EDGE = 24;
const MAX_EDGE = 96;
/** A pointer this far beside a container (across the scroll axis) still scrolls it. */
const CROSS_AXIS_TOLERANCE = 10;
/** Pointer travel in px that unlocks a scroll direction. */
const INTENT_DISTANCE = 5;

/** Edge zone for a container `size` px long: `threshold × size`, clamped to 24–96px and to half the size. */
export const getEdgeSize = (size: number, threshold: number): number =>
  threshold > 0 && size > 0
    ? Math.min(Math.max(threshold * size, MIN_EDGE), MAX_EDGE, size / 2)
    : 0;

/**
 * Speed in px per frame for a pointer `depth` zones into the edge zone: 0 at its
 * inner border, 1 at the container edge, more beyond it. Quadratic inside the zone
 * for fine control, linear past the edge (same slope at 1), capped by `maxSpeed`.
 */
export const getEdgeSpeed = (
  depth: number,
  { acceleration, maxSpeed }: Required<AutoScrollOptions>,
): number => {
  if (depth <= 0) return 0;
  const curve = depth <= 1 ? depth * depth : 2 * depth - 1;
  return Math.min(acceleration * curve, maxSpeed);
};

const axisVelocity = (
  position: number,
  start: number,
  end: number,
  backward: boolean,
  forward: boolean,
  options: Required<AutoScrollOptions>,
): number => {
  const edge = getEdgeSize(end - start, options.threshold);
  if (!edge) return 0;
  if (backward && position < start + edge) {
    return -getEdgeSpeed((start + edge - position) / edge, options);
  }
  if (forward && position > end - edge) {
    return getEdgeSpeed((position - end + edge) / edge, options);
  }
  return 0;
};

/**
 * Velocity in px per 60fps frame (negative: up/left) for a container whose visible
 * client area is `rect`. A direction needs room to scroll and the user's intent;
 * a pointer beside the container (past the cross-axis tolerance) doesn't scroll it.
 */
export const getScrollVelocity = (
  pointer: Coordinates,
  rect: Rect,
  canScroll: Directions,
  intent: Directions,
  options: Required<AutoScrollOptions>,
): Coordinates => {
  const t = CROSS_AXIS_TOLERANCE;
  const besideX = pointer.x < rect.left - t || pointer.x > rect.right + t;
  const besideY = pointer.y < rect.top - t || pointer.y > rect.bottom + t;
  return {
    x: besideY
      ? 0
      : axisVelocity(
          pointer.x,
          rect.left,
          rect.right,
          canScroll.left && intent.left,
          canScroll.right && intent.right,
          options,
        ),
    y: besideX
      ? 0
      : axisVelocity(
          pointer.y,
          rect.top,
          rect.bottom,
          canScroll.up && intent.up,
          canScroll.down && intent.down,
          options,
        ),
  };
};

export interface ScrollIntent {
  /** Extremes of the pointer since the drag started. */
  min: Coordinates;
  max: Coordinates;
  directions: Directions;
}

export const createScrollIntent = (pointer: Coordinates): ScrollIntent => ({
  min: { ...pointer },
  max: { ...pointer },
  directions: { up: false, down: false, left: false, right: false },
});

/**
 * Unlocks a direction once the pointer has moved that way since the drag started,
 * so an item picked up near an edge doesn't scroll by itself. Directions stay unlocked.
 */
export const updateScrollIntent = (intent: ScrollIntent, pointer: Coordinates): Directions => {
  const { min, max, directions } = intent;
  if (pointer.y - min.y > INTENT_DISTANCE) directions.down = true;
  if (max.y - pointer.y > INTENT_DISTANCE) directions.up = true;
  if (pointer.x - min.x > INTENT_DISTANCE) directions.right = true;
  if (max.x - pointer.x > INTENT_DISTANCE) directions.left = true;
  min.x = Math.min(min.x, pointer.x);
  min.y = Math.min(min.y, pointer.y);
  max.x = Math.max(max.x, pointer.x);
  max.y = Math.max(max.y, pointer.y);
  return directions;
};

const mergeOptions = (
  base: Required<AutoScrollOptions>,
  patch: boolean | AutoScrollOptions | undefined,
): Required<AutoScrollOptions> => {
  if (typeof patch !== 'object' || !patch) return base;
  const result = { ...base };
  for (const key of Object.keys(patch) as Array<keyof AutoScrollOptions>) {
    const value = patch[key];
    if (typeof value === 'number' && Number.isFinite(value)) result[key] = value;
  }
  return result;
};

/** Options for one container: a per-container override wins over the provider; `null` means off. */
export const resolveAutoScrollOptions = (
  provider: boolean | AutoScrollOptions | undefined,
  override?: boolean | AutoScrollOptions,
): Required<AutoScrollOptions> | null => {
  if ((override ?? provider ?? true) === false) return null;
  return mergeOptions(mergeOptions(DEFAULT_AUTO_SCROLL, provider), override);
};

/** How far to scroll so `rect` fits into `view` (its start edge wins when it is larger). */
export const getRevealDelta = (rect: Rect, view: Rect, margin = 0): Coordinates => {
  const axis = (start: number, end: number, viewStart: number, viewEnd: number) => {
    if (start < viewStart + margin) return start - viewStart - margin;
    if (end > viewEnd - margin) return Math.min(end - viewEnd + margin, start - viewStart - margin);
    return 0;
  };
  return {
    x: axis(rect.left, rect.right, view.left, view.right),
    y: axis(rect.top, rect.bottom, view.top, view.bottom),
  };
};
