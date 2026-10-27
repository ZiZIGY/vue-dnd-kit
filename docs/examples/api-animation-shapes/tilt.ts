import type { DropAnimation, LayoutAnimation, Rect } from '@vue-dnd-kit/core';

const SPRING = 'cubic-bezier(.3, 1.5, .5, 1)';

/** A row slides to its new place tilted, and springs straight. */
export const tiltMove: LayoutAnimation = ({ element, from, to, reducedMotion }) => {
  if (reducedMotion) return;
  // Animate `translate` from the old place to none: it composes with the row's own transforms.
  return element.animate(
    [
      { translate: `${from.left - to.left}px ${from.top - to.top}px`, rotate: '-5deg' },
      { translate: '0 0', rotate: '0deg' },
    ],
    { duration: 480, easing: SPRING },
  );
};

const place = (rect: Rect, angle: number): Keyframe => ({
  transform: `translate3d(${rect.left}px, ${rect.top}px, 0) rotate(${angle}deg)`,
  transformOrigin: '50% 50%',
  width: `${rect.width}px`,
  height: `${rect.height}px`,
});

/** The overlay swings onto its slot; with no slot to land on, it fades out. */
export const tiltDrop: DropAnimation = ({ overlay, from, to, reducedMotion }) => {
  if (reducedMotion) return;
  if (!to) return overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
  return overlay.animate([place(from, 8), place(to, 0)], { duration: 520, easing: SPRING, fill: 'forwards' });
};
