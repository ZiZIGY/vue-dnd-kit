/**
 * Keeps a dropped overlay on what it lands on. The box is `position: fixed`: when that
 * moves while the drop is decided or lands (the page or a container scrolls, the layout
 * shifts), the box moves with it, by its `translate`, on top of the `transform` the drop
 * animation moves. The flight then ends on the slot where it is now.
 */

import type { Coordinates, Rect } from '../../types';
import { getSettledRect } from '../../animation/layout';
import type { ManagerContext } from './state';

export type Follow = ReturnType<typeof createFollow>;

export function createFollow(ctx: ManagerContext) {
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
    const box = ctx.overlayElement.value;
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

  /** What the box moved so far goes into its offset: it stays where it is on screen. */
  const fold = () => {
    if (!shift) return;
    const { x, y } = ctx.transform.value;
    ctx.transform.value = { x: x + shift.x, y: y + shift.y };
    place(null);
  };

  return {
    /** The box follows `element` from now on, from where it is; `null`: it stays there. */
    follow(element: Element | null) {
      fold();
      anchor = element?.isConnected ? element : null;
      start = anchor && getSettledRect(anchor);
      if (anchor && !frame) frame = requestAnimationFrame(step);
    },
    /** Stops following, the shift with it: the box is gone, or follows the pointer again. */
    stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      anchor = start = null;
      place(null);
    },
  };
}
