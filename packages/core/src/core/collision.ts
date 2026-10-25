import type { CollisionDetection, Coordinates, Key, Rect } from '../types';
import { distance, getCenter } from '../animation/layout';

const area = (rect: Rect) => rect.width * rect.height;

const intersectionRatio = (a: Rect, b: Rect): number => {
  const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  if (width <= 0 || height <= 0) return 0;
  const intersection = width * height;
  return intersection / (area(a) + area(b) - intersection);
};

/** Targets under the pointer, from hit-testing: respects z-order, overlays and shadow roots. */
export const pointerWithin: CollisionDetection = ({ hits }) => hits;

/** Targets overlapping the overlay: higher priority, then deeper nesting, then intersection over union. */
export const rectIntersection: CollisionDetection = ({ overlayRect, candidates }) => {
  if (!overlayRect) return [];
  return candidates
    .map((candidate) => ({ candidate, ratio: intersectionRatio(overlayRect, candidate.rect) }))
    .filter((entry) => entry.ratio > 0)
    .sort(
      (a, b) =>
        b.candidate.priority - a.candidate.priority ||
        (b.candidate.depth ?? 0) - (a.candidate.depth ?? 0) ||
        b.ratio - a.ratio,
    )
    .map((entry) => entry.candidate.id);
};

/** Every target, by distance between centers. */
export const closestCenter: CollisionDetection = ({ overlayRect, pointer, candidates }) => {
  const center = overlayRect ? getCenter(overlayRect) : pointer;
  return [...candidates]
    .sort((a, b) => distance(center, getCenter(a.rect)) - distance(center, getCenter(b.rect)))
    .map((candidate) => candidate.id);
};

const corners = (rect: Rect): Coordinates[] => [
  { x: rect.left, y: rect.top },
  { x: rect.right, y: rect.top },
  { x: rect.left, y: rect.bottom },
  { x: rect.right, y: rect.bottom },
];

/** Every target, by summed distance between corners (good for stacked targets such as kanban columns). */
export const closestCorners: CollisionDetection = ({ overlayRect, pointer, candidates }) => {
  const source = overlayRect
    ? corners(overlayRect)
    : [pointer, pointer, pointer, pointer];
  const score = (rect: Rect) =>
    corners(rect).reduce((sum, corner, index) => sum + distance(corner, source[index]!), 0);
  return [...candidates]
    .sort((a, b) => score(a.rect) - score(b.rect))
    .map((candidate) => candidate.id);
};

/** Default: what is under the pointer, else what the overlay overlaps. */
export const pointerFirst: CollisionDetection = (args) => {
  const within = pointerWithin(args);
  return within.length ? within : rectIntersection(args);
};

// ─── Stability (rfcs/0001-v3.md §6) ────────────────────────────────────────────

/** Pointer travel (px) before a target that was just left can win again. */
export const HYSTERESIS = 10;

export interface StabilizeContext {
  pointer: Coordinates;
  /** Current target. */
  previous: Key | null;
  /** Best target of this frame by the collision detection. */
  next: Key | null;
  /** The target can still be kept (mounted, enabled, visible). */
  isValid(id: Key): boolean;
  /** The pointer is over `parent`, between the drop targets nested in it, one of which is `child`. */
  isGap(parent: Key, child: Key): boolean;
  /** Input without jitter (keyboard): no hysteresis. */
  exact?: boolean;
}

/**
 * Damps target switches:
 * - a target that was just left can't win again until the pointer has moved
 *   `HYSTERESIS` px from where it was left: boundaries don't flicker, and a layout
 *   shift after a cross-list move can't bounce the item back;
 * - between nested targets the last one is kept: the gaps of a parent zone don't
 *   flash the parent.
 */
export function createTargetStabilizer() {
  let recent: { id: Key; point: Coordinates } | null = null;

  return {
    /** Forgets the hysteresis, e.g. after a scroll moved the content under the pointer. */
    reset() {
      recent = null;
    },
    resolve(context: StabilizeContext): Key | null {
      const { pointer, previous, next } = context;
      if (recent && distance(pointer, recent.point) >= HYSTERESIS) recent = null;
      if (next === previous) return next;
      if (previous != null && context.isValid(previous)) {
        if (next != null && context.isGap(next, previous)) return previous;
        if (!context.exact && recent?.id === next) return previous;
      } else if (previous == null && !context.exact && recent?.id === next) {
        return null;
      }
      if (previous != null) recent = { id: previous, point: pointer };
      return next;
    },
  };
}

export type TargetStabilizer = ReturnType<typeof createTargetStabilizer>;
