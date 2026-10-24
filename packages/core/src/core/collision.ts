import type { CollisionDetection, Coordinates, Rect } from '../types';
import { getCenter } from '../animation/layout';

const area = (rect: Rect) => rect.width * rect.height;

const intersectionRatio = (a: Rect, b: Rect): number => {
  const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  if (width <= 0 || height <= 0) return 0;
  const intersection = width * height;
  return intersection / (area(a) + area(b) - intersection);
};

const distance = (a: Coordinates, b: Coordinates) => Math.hypot(a.x - b.x, a.y - b.y);

/** Targets under the pointer, from hit-testing: respects z-order, overlays and shadow roots. */
export const pointerWithin: CollisionDetection = ({ hits }) => hits;

/** Targets overlapping the overlay, by intersection over union. */
export const rectIntersection: CollisionDetection = ({ overlayRect, candidates }) => {
  if (!overlayRect) return [];
  return candidates
    .map((candidate) => ({ id: candidate.id, ratio: intersectionRatio(overlayRect, candidate.rect) }))
    .filter((entry) => entry.ratio > 0)
    .sort((a, b) => b.ratio - a.ratio)
    .map((entry) => entry.id);
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
