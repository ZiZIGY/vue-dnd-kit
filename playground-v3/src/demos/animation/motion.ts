/**
 * Recipe: motion (`motion-v`'s `animate`) drives every animation of the library, through
 * its hooks. Each one gets the element and its rects and returns the animation's
 * `finished` promise, so the library knows when it ends. Use it as
 * `<DnDProvider v-bind="motionAnimations">`.
 *
 * Items move on the CSS `translate` property, as the library's own animations do: it
 * composes with the `transform` a virtual list positions rows with (motion's `x`, `y` and
 * `scale` would replace it), and drags measure items without it.
 */

import { animate } from 'motion-v';
import type {
  DropAnimationContext,
  EnterAnimationContext,
  LayoutAnimationContext,
  LeaveAnimationContext,
} from '@vue-dnd-kit/core';

const spring = { type: 'spring', duration: 0.45, bounce: 0.25 } as const;

// Drag hooks run with reduced motion too, so they check it; `animate` doesn't run at all then.
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** An item springs to its new place, while dragging and after a data change. */
const move = ({ element, from, to, signal }: LayoutAnimationContext) => {
  if (reduced()) return;
  const offset = `${from.left - to.left}px ${from.top - to.top}px`;
  const controls = animate(element, { translate: [offset, '0px 0px'] }, spring);
  // It moves again before landing: stop and clear the offset, the library measures right after.
  signal.addEventListener('abort', () => {
    controls.stop();
    element.style.translate = '';
  });
  return controls.finished;
};

/** The overlay lands on its slot: position and size, never `scale` (the content re-lays out). */
const drop = ({ overlay, from, to }: DropAnimationContext) => {
  if (reduced()) return;
  if (!to) return animate(overlay, { opacity: 0 }, { duration: 0.18 }).finished;
  return animate(
    overlay,
    { x: [from.left, to.left], y: [from.top, to.top], width: [from.width, to.width], height: [from.height, to.height] },
    spring,
  ).finished;
};

/** An item that appeared rises into place. */
const enter = ({ element }: EnterAnimationContext) =>
  animate(element, { opacity: [0, 1], translate: ['0px 12px', '0px 0px'] }, spring).finished;

/** The copy of an item that left drifts away; the library removes it once it ends. */
const leave = ({ element }: LeaveAnimationContext) =>
  animate(element, { opacity: 0, translate: '0px -12px' }, { duration: 0.2 }).finished;

export const motionAnimations = {
  animation: move,
  dropAnimation: drop,
  animate: { move, enter, leave },
};
