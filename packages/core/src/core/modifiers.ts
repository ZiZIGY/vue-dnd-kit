import type { Coordinates, MaybeElementRef, Modifier, Rect } from '../types';
import { getRect } from '../animation/layout';
import { toElement } from '../utils/dom';

/** Keeps `rect` moved by `transform` inside `bounds`. */
const restrictToRect = (transform: Coordinates, rect: Rect, bounds: Rect): Coordinates => {
  let { x, y } = transform;
  if (rect.left + x < bounds.left) x = bounds.left - rect.left;
  else if (rect.right + x > bounds.right) x = bounds.right - rect.right;
  if (rect.top + y < bounds.top) y = bounds.top - rect.top;
  else if (rect.bottom + y > bounds.bottom) y = bounds.bottom - rect.bottom;
  return { x, y };
};

/** `overlayRect` is the rect after `transform`; this gives the rect before it. */
const baseRect = (overlayRect: Rect, transform: Coordinates): Rect => ({
  ...overlayRect,
  left: overlayRect.left - transform.x,
  right: overlayRect.right - transform.x,
  top: overlayRect.top - transform.y,
  bottom: overlayRect.bottom - transform.y,
});

export const restrictToVerticalAxis: Modifier = ({ transform }) => ({ x: 0, y: transform.y });

export const restrictToHorizontalAxis: Modifier = ({ transform }) => ({ x: transform.x, y: 0 });

export const restrictToWindowEdges: Modifier = ({ transform, overlayRect, windowRect }) =>
  restrictToRect(transform, baseRect(overlayRect, transform), windowRect);

/** Keeps the overlay inside the sortable list (or parent element) the drag started in. */
export const restrictToParent: Modifier = ({ transform, overlayRect, containerRect }) =>
  containerRect ? restrictToRect(transform, baseRect(overlayRect, transform), containerRect) : transform;

export const restrictToElement =
  (target: MaybeElementRef): Modifier =>
  ({ transform, overlayRect }) => {
    const element = toElement(target);
    return element
      ? restrictToRect(transform, baseRect(overlayRect, transform), getRect(element))
      : transform;
  };

const isScrollable = (element: Element) => {
  const style = getComputedStyle(element);
  return /(auto|scroll|overlay)/.test(style.overflow + style.overflowX + style.overflowY);
};

/** Keeps the overlay inside the first scrollable ancestor of the dragged element. */
export const restrictToFirstScrollableAncestor: Modifier = ({ transform, overlayRect, active }) => {
  let element = active.element.parentElement;
  while (element && !isScrollable(element)) element = element.parentElement;
  return element
    ? restrictToRect(transform, baseRect(overlayRect, transform), getRect(element))
    : transform;
};

export interface SnapToGridOptions {
  x: number;
  y: number;
}

/** Snaps the drag offset to a grid (rounding to the nearest cell). */
export const snapToGrid = (size: number | SnapToGridOptions): Modifier => {
  const { x: sx, y: sy } = typeof size === 'number' ? { x: size, y: size } : size;
  return ({ transform }) => ({
    x: sx > 0 ? Math.round(transform.x / sx) * sx : transform.x,
    y: sy > 0 ? Math.round(transform.y / sy) * sy : transform.y,
  });
};

/** Centers the overlay under the pointer instead of keeping the grab offset. */
export const snapCenterToCursor: Modifier = ({ transform, activeRect, overlayRect, origin }) => ({
  x: transform.x + origin.x - activeRect.left - overlayRect.width / 2,
  y: transform.y + origin.y - activeRect.top - overlayRect.height / 2,
});
