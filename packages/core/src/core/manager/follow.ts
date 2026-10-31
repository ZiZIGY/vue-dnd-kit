/**
 * Keeps a dropped overlay box on what it lands on. The box is `position: fixed`: when
 * that moves while the drop is decided or lands (the page or a container scrolls, the
 * layout shifts), the box moves with it, by its `translate`, on top of the `transform` the
 * drop animation moves. The flight then ends on the slot where it is now.
 */

import type { Coordinates, Rect } from '../../types';
import { getSettledRect } from '../../animation/layout';

export type Follow = ReturnType<typeof createFollow>;

/** `getBox`: the box to move, read when it moves. */
export function createFollow(getBox: () => HTMLElement | null) {
  let anchor: Element | null = null;
  /** Where the anchor was when the box began to follow it: where it settles (FLIP aside). */
  let start: Rect | null = null;
  /** How far the box has moved with the anchor: its `translate`. */
  let shift: Coordinates | null = null;
  let frame = 0;

  const place = (next: Coordinates | null) => {
    shift = next;
    // On the element, not through its rendered style: re-rendering that would write back
    // the `transform` and size an animation library (GSAP, motion) moves inline.
    const box = getBox();
    if (box) box.style.translate = next ? `${next.x}px ${next.y}px` : '';
  };

  // Every frame rather than on scroll events: a layout shift moves the anchor too.
  const step = () => {
    frame = 0;
    // An anchor that went away (a virtual row scrolled off) leaves the box where it got to.
    if (!anchor?.isConnected || !start) return;
    const { left, top } = getSettledRect(anchor);
    const x = left - start.left;
    const y = top - start.top;
    // Written every frame it is moved: a re-render of the box's style clears it.
    const moved = x !== 0 || y !== 0;
    if (moved || shift) place(moved ? { x, y } : null);
    frame = requestAnimationFrame(step);
  };

  const halt = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    anchor = start = null;
  };

  return {
    /** The box follows `element` from now on, from where it is; `null`: it stays there. */
    follow(element: Element | null) {
      halt();
      place(null);
      anchor = element?.isConnected ? element : null;
      start = anchor && getSettledRect(anchor);
      if (anchor) frame = requestAnimationFrame(step);
    },
    /** Stops following and takes the shift off the box: what it was, for its new place. */
    take(): Coordinates | null {
      const taken = shift;
      halt();
      place(null);
      return taken;
    },
    /** Stops following, the shift with it. */
    stop() {
      halt();
      place(null);
    },
  };
}
