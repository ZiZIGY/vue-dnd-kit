import type { AnimationOptions, Coordinates, MaybeElementRef, Modifier, Rect } from '../types';
import type { AreaEntry } from './manager';
import { getCenter, getRect } from '../animation/layout';
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

/** Moves only vertically: horizontally it stays with the content it started in (`containerShift`). */
export const restrictToVerticalAxis: Modifier = ({ transform, containerShift }) => ({ x: containerShift.x, y: transform.y });

/** Moves only horizontally: vertically it stays with the content it started in (`containerShift`). */
export const restrictToHorizontalAxis: Modifier = ({ transform, containerShift }) => ({ x: transform.x, y: containerShift.y });

/** `modifiers` with the lock of the `axis` option last, so it holds whatever they do. */
export const withAxis = (modifiers: Modifier[] | undefined, axis: 'x' | 'y' | null | undefined): Modifier[] | undefined =>
  axis ? [...(modifiers ?? []), axis === 'x' ? restrictToHorizontalAxis : restrictToVerticalAxis] : modifiers;

/**
 * The modifiers of a drag after the provider's: those of its area (`makeDragArea`), the
 * draggable's own (or its list's), the area's bounds (`restrictToArea`), and the axis
 * lock last. The draggable's `axis` (or its list's) wins over the area's.
 */
export const dragModifiers = (
  own: Modifier[] | undefined,
  axis: 'x' | 'y' | undefined,
  area: AreaEntry | null,
): Modifier[] | undefined => {
  if (!area) return withAxis(own, axis);
  const modifiers = [...(area.getModifiers() ?? []), ...(own ?? [])];
  if (area.restricts()) modifiers.push(restrictToElement(area.getElement));
  return withAxis(modifiers, axis ?? area.getAxis());
};

export const restrictToWindowEdges: Modifier = ({ transform, overlayRect, windowRect }) =>
  restrictToRect(transform, baseRect(overlayRect, transform), windowRect);

/**
 * Keeps the overlay inside the container the drag started in: the sortable list
 * (not its DOM parent) or, for plain draggables, the parent element.
 */
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

// Modifiers run every frame: resolve the ancestor once per dragged element.
const scrollableAncestors = new WeakMap<Element, Element | null>();

/** Keeps the overlay inside the first scrollable ancestor of the dragged element. */
export const restrictToFirstScrollableAncestor: Modifier = ({ transform, overlayRect, active }) => {
  let element = scrollableAncestors.get(active.element);
  if (element === undefined) {
    element = active.element.parentElement;
    while (element && !isScrollable(element)) element = element.parentElement;
    scrollableAncestors.set(active.element, element);
  }
  return element?.isConnected
    ? restrictToRect(transform, baseRect(overlayRect, transform), getRect(element))
    : transform;
};

export interface SnapToGridOptions {
  x: number;
  y: number;
  /**
   * `'container'` (default): the overlay's top-left lands on grid lines drawn from the
   * container's top-left (`containerRect`: the sortable list or the parent element).
   * `'delta'`: the drag offset is rounded, keeping where the item started off-grid.
   */
  origin?: 'container' | 'delta';
  /**
   * Glide the overlay between snapped positions (default 80ms). Collision still
   * uses the snapped position at once.
   */
  smooth?: boolean | AnimationOptions;
}

/** Marker read by the overlay: glide between the positions this modifier produces. */
export type SmoothModifier = Modifier & { smooth?: Required<AnimationOptions> };

const DEFAULT_SMOOTH: Required<AnimationOptions> = { duration: 80, easing: 'ease-out' };

const snap = (value: number, size: number) => (size > 0 ? Math.round(value / size) * size : value);

/** Snaps the overlay to a grid (rounding to the nearest cell). */
export const snapToGrid = (size: number | SnapToGridOptions): Modifier => {
  const options: SnapToGridOptions = typeof size === 'number' ? { x: size, y: size } : size;
  const { x: sx, y: sy, origin = 'container' } = options;
  const modifier: Modifier = ({ transform, overlayRect, containerRect }) => {
    if (origin === 'delta' || !containerRect) {
      return { x: snap(transform.x, sx), y: snap(transform.y, sy) };
    }
    const left = overlayRect.left - containerRect.left;
    const top = overlayRect.top - containerRect.top;
    return { x: transform.x + snap(left, sx) - left, y: transform.y + snap(top, sy) - top };
  };
  const smooth = options.smooth;
  if (!smooth) return modifier;
  const resolved = { ...DEFAULT_SMOOTH, ...(smooth === true ? {} : smooth) };
  return resolved.duration > 0 ? Object.assign(modifier, { smooth: resolved }) : modifier;
};

/** The glide the overlay should apply between modifier outputs, if any modifier asks for one. */
export const getOverlaySmoothing = (
  modifiers: readonly Modifier[] | undefined,
): Required<AnimationOptions> | null => {
  for (const modifier of modifiers ?? []) {
    const smooth = (modifier as SmoothModifier).smooth;
    if (smooth) return smooth;
  }
  return null;
};

/** Centers the overlay under the pointer instead of keeping the grab offset. */
export const snapCenterToCursor: Modifier = ({ transform, overlayRect, origin }) => {
  // Moves the box by the distance from its center to the pointer (`origin + transform`).
  const center = getCenter(overlayRect);
  return {
    x: transform.x + origin.x + transform.x - center.x,
    y: transform.y + origin.y + transform.y - center.y,
  };
};
