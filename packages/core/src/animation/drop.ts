import type { AnimationOptions, DropAnimation, DropAnimationContext } from '../types';
import { canAnimate, resolveAnimation } from './layout';

export const DEFAULT_DROP_ANIMATION: Required<AnimationOptions> = {
  duration: 250,
  easing: 'ease',
};

const settle = async (result: Animation | Promise<unknown> | void) => {
  try {
    if (result && typeof (result as Animation).finished === 'object') {
      await (result as Animation).finished;
    } else {
      await result;
    }
  } catch {
    // A cancelled animation still ends the drop.
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
  if (resolved.custom) return settle(resolved.custom(full));
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
  await settle(overlay.animate(keyframes, { ...resolved.options, fill: 'forwards' }));
};
