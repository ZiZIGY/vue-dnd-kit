import type { AnimationOptions, DropAnimation, DropAnimationContext, Rect } from '../types';
import { canAnimate, getRect, prefersReducedMotion, resolveAnimation } from './layout';

export const DEFAULT_DROP_ANIMATION: Required<AnimationOptions> = {
  duration: 250,
  easing: 'ease',
};

/** Margin over the animation duration after which the drop ends anyway. */
const STALL_MARGIN = 1000;

/**
 * Waits for the drop animation, but never longer than `timeout`: an animation that
 * never settles (a stalled compositor, a custom hook that never resolves) must not
 * leave the session stuck in `dropping` (rfcs/0001-v3.md §13).
 */
const settle = async (result: Animation | Promise<unknown> | void, timeout: number) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const done =
    result && typeof (result as Animation).finished === 'object'
      ? (result as Animation).finished
      : Promise.resolve(result);
  try {
    await Promise.race([done, new Promise((resolve) => (timer = setTimeout(resolve, timeout)))]);
  } catch {
    // A cancelled animation still ends the drop.
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Flies the overlay to the final rect of the dropped item, or fades it out when the
 * item isn't rendered. The size is animated as width/height, not `scale()`: the
 * content re-lays out at the target size instead of being stretched.
 */
export const runDropAnimation = async (
  option: DropAnimation | undefined,
  context: Omit<DropAnimationContext, 'options'>,
): Promise<void> => {
  const resolved = resolveAnimation(option, DEFAULT_DROP_ANIMATION);
  if (!resolved) return;
  const full: DropAnimationContext = { ...context, options: resolved.options };
  if (resolved.custom) return settle(resolved.custom(full), resolved.options.duration + STALL_MARGIN);
  const { overlay, from, to } = context;
  if (!canAnimate(overlay)) return;

  const keyframes: Keyframe[] = to
    ? [
        {
          transform: `translate3d(${from.left}px, ${from.top}px, 0)`,
          width: `${from.width}px`,
          height: `${from.height}px`,
        },
        {
          transform: `translate3d(${to.left}px, ${to.top}px, 0)`,
          width: `${to.width}px`,
          height: `${to.height}px`,
        },
      ]
    : [
        { opacity: 1, transform: `translate3d(${from.left}px, ${from.top}px, 0)` },
        {
          opacity: 0,
          transform: `translate3d(${from.left}px, ${from.top}px, 0) scale(0.96)`,
        },
      ];
  await settle(
    overlay.animate(keyframes, { ...resolved.options, fill: 'forwards' }),
    resolved.options.duration + STALL_MARGIN,
  );
};

/**
 * Timing for what the library animates along with the drop. A custom `dropAnimation`
 * moves the overlay box itself; the rest then uses the default timing, and nothing
 * moves when reduced motion is preferred (custom hooks skip that check).
 */
const companionTiming = (option: DropAnimation | undefined): Required<AnimationOptions> | null => {
  const resolved = resolveAnimation(option, DEFAULT_DROP_ANIMATION);
  if (!resolved || (resolved.custom && prefersReducedMotion())) return null;
  return resolved.options;
};

export interface OverlayItemLanding {
  /**
   * A clone riding in the overlay box: a cell of the default column, or a `DragPreview`
   * of a custom layout, which may be turned or scaled by its wrappers' `transform`.
   */
  element: HTMLElement;
  /** Where it is now (viewport): its bounding box. */
  from: Rect;
  /** Final rect of its item; `null` when it isn't visible (the clone fades out). */
  to: Rect | null;
}

/**
 * A keyframe placing the clone by `matrix` around its top left corner: the translation
 * in pixels, then the turn (and any scale its wrappers give it).
 */
const frame = ({ a, b, c, d, e, f }: DOMMatrix, width: string, height: string, opacity = 1): Keyframe => ({
  transformOrigin: '0 0',
  transform: `translate(${e}px, ${f}px) matrix(${a}, ${b}, ${c}, ${d}, 0, 0)`,
  width,
  height,
  opacity,
});

/**
 * Where a clone with the bounding box `rect` is: the turn and scale of its wrappers inside
 * the overlay (`linear`), its own transform around its top left corner, and that corner
 * (viewport) without it.
 */
const placeOf = (element: HTMLElement, overlay: Element | null, rect = getRect(element)) => {
  let linear = new DOMMatrix();
  for (let node = element.parentElement; node && node !== overlay; node = node.parentElement) {
    linear = new DOMMatrix(getComputedStyle(node).transform).multiply(linear);
  }
  linear.e = linear.f = 0;
  const style = getComputedStyle(element);
  const [x = 0, y = 0] = style.transformOrigin.split(' ').map(parseFloat);
  const own = new DOMMatrix().translate(x, y).multiply(new DOMMatrix(style.transform)).translate(-x, -y);
  // The bounding box starts at the leftmost and topmost corner of the turned box.
  const { a, b, c, d, e, f } = linear.multiply(own);
  const { offsetWidth: w, offsetHeight: h } = element;
  return {
    linear,
    own,
    x: rect.left - e - Math.min(0, a * w) - Math.min(0, c * h),
    y: rect.top - f - Math.min(0, b * w) - Math.min(0, d * h),
    width: style.width,
    height: style.height,
  };
};

/**
 * Multi-drag: the clones of the other items ride inside the overlay box, which flies
 * from `box.from` to `box.to`. Each one animates relative to the box with the box's
 * timing, so position and box add up to a straight flight that ends exactly on its
 * slot, its wrappers' turn undone on the way. Width and height animate, never
 * `scale()` (see `runDropAnimation`).
 */
export const landOverlayItems = async (
  option: DropAnimation | undefined,
  items: OverlayItemLanding[],
  box: { from: Rect; to: Rect | null },
): Promise<void> => {
  const timing = items.length ? companionTiming(option) : null;
  if (!timing) return;
  const { from } = box;
  // A box that fades out stays where it is.
  const end = box.to ?? from;
  const overlay = items[0]!.element.closest<HTMLElement>('[data-dnd-overlay]');
  const places = items.map(({ element, from: rect }) => placeOf(element, overlay, rect));
  // A layout that follows the box's size (a custom one) is measured at the size the box lands
  // with: `!important` wins over the box's animation, which holds the size it starts from.
  let landed = places;
  if (overlay && (end.width !== from.width || end.height !== from.height)) {
    const { style } = overlay;
    const { width, height } = style;
    style.setProperty('width', `${end.width}px`, 'important');
    style.setProperty('height', `${end.height}px`, 'important');
    landed = items.map(({ element }) => placeOf(element, overlay));
    style.width = width;
    style.height = height;
  }
  await Promise.all(
    items.map(({ element, to }, index) => {
      if (!canAnimate(element)) return undefined;
      const { linear, own, width, height } = places[index]!;
      // The box carries the corner to where it is at the landing size, moved by the box's
      // flight; from there the clone goes to the slot, its wrappers' turn undone.
      const corner = landed[index]!;
      const finish = to
        ? frame(
            linear.inverse().translate(to.left - corner.x - end.left + from.left, to.top - corner.y - end.top + from.top),
            `${to.width}px`,
            `${to.height}px`,
          )
        : frame(own, width, height, 0);
      return settle(
        element.animate([frame(own, width, height), finish], { ...timing, fill: 'forwards' }),
        timing.duration + STALL_MARGIN,
      );
    }),
  );
};

/**
 * Dragged items without a clone in the overlay (past the cap, custom overlays) fade in
 * where they are during the drop, from their placeholder opacity. The animations hold
 * full opacity until the caller cancels them, once the placeholder marks are gone.
 */
export const fadeInPlace = (option: DropAnimation | undefined, elements: HTMLElement[]): Animation[] => {
  const timing = elements.length ? companionTiming(option) : null;
  if (!timing) return [];
  // Reads first, then writes.
  const opacities = elements.map((element) => getComputedStyle(element).opacity);
  return elements.flatMap((element, index) => {
    const opacity = opacities[index]!;
    if (!canAnimate(element) || opacity === '1' || opacity === '') return [];
    return [element.animate([{ opacity }, { opacity: 1 }], { ...timing, fill: 'forwards' })];
  });
};
