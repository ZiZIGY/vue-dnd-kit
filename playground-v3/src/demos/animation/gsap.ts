/**
 * Recipe: GSAP drives every animation of the library, through its hooks. Each one gets the
 * element and its rects and returns a promise (`tween.then()`), so the library knows when
 * the animation ends. Use it as `<DnDProvider v-bind="gsapAnimations">`.
 */

import gsap from 'gsap';
import type {
  DropAnimationContext,
  EnterAnimationContext,
  LayoutAnimationContext,
  LeaveAnimationContext,
  Rect,
} from '@vue-dnd-kit/core';

// Drag hooks run with reduced motion too, so they check it; `animate` doesn't run at all then.
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * An item slides to its new place, while dragging and after a data change. It moves on
 * the CSS `translate` property, as the library's own animation does: that composes with
 * the `transform` a virtual list positions rows with, and drags measure items without it.
 */
const move = ({ element, from, to, signal }: LayoutAnimationContext) => {
  if (reduced()) return;
  const offset = `${from.left - to.left}px ${from.top - to.top}px`;
  const tween = gsap.fromTo(element, { translate: offset }, { translate: '0px 0px', duration: 0.4, ease: 'power3.out' });
  // It moves again before landing: undo the tween at once, the library measures right after.
  signal.addEventListener('abort', () => tween.revert());
  return tween.then();
};

const box = (rect: Rect) => ({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });

/** The overlay lands on its slot: position and size, never `scale` (the content re-lays out). */
const drop = ({ overlay, from, to }: DropAnimationContext) => {
  if (reduced()) return;
  if (!to) return gsap.to(overlay, { opacity: 0, duration: 0.2 }).then();
  return gsap.fromTo(overlay, box(from), { ...box(to), duration: 0.45, ease: 'back.out(1.2)' }).then();
};

/** An item that appeared pops in (GSAP's `scale` keeps the `transform` a row may have). */
const enter = ({ element }: EnterAnimationContext) =>
  gsap.from(element, { opacity: 0, scale: 0.85, duration: 0.35, ease: 'back.out(2)' }).then();

/** The copy of an item that left shrinks away; the library removes it once the tween ends. */
const leave = ({ element }: LeaveAnimationContext) =>
  gsap.to(element, { opacity: 0, scale: 0.85, duration: 0.25, ease: 'power2.in' }).then();

export const gsapAnimations = {
  animation: move,
  dropAnimation: drop,
  animate: { move, enter, leave },
};
