import type { AnimationOptions, DropAnimation, DropAnimationContext, Rect } from '../types';
import { canAnimate, prefersReducedMotion, resolveAnimation } from './layout';

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
  /** A clone in the overlay's column, positioned inside the overlay box. */
  element: HTMLElement;
  /** Where it is now (viewport). */
  from: Rect;
  /** Final rect of its item; `null` when it isn't visible (the clone fades out). */
  to: Rect | null;
}

const translate = (x: number, y: number) => `translate(${x}px, ${y}px)`;

/**
 * Multi-drag: the clones of the other items ride inside the overlay box, which flies
 * from `box.from` to `box.to`. Each one animates relative to the box with the box's
 * timing, so position and box add up to a straight flight that ends exactly on its
 * slot. Width and height animate, never `scale()` (see `runDropAnimation`).
 */
export const landOverlayItems = async (
  option: DropAnimation | undefined,
  items: OverlayItemLanding[],
  box: { from: Rect; to: Rect | null },
): Promise<void> => {
  const timing = items.length ? companionTiming(option) : null;
  if (!timing) return;
  // A box that fades out stays where it is.
  const end = box.to ?? box.from;
  await Promise.all(
    items.map(({ element, from, to }) => {
      if (!canAnimate(element)) return undefined;
      const start: Keyframe = {
        transform: translate(from.left - box.from.left, from.top - box.from.top),
        width: `${from.width}px`,
        height: `${from.height}px`,
        opacity: 1,
      };
      const finish: Keyframe = to
        ? {
            transform: translate(to.left - end.left, to.top - end.top),
            width: `${to.width}px`,
            height: `${to.height}px`,
            opacity: 1,
          }
        : { ...start, opacity: 0 };
      return settle(element.animate([start, finish], { ...timing, fill: 'forwards' }), timing.duration + STALL_MARGIN);
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
