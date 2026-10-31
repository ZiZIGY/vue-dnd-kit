/**
 * Keeps a dropped overlay box on what it lands on. The box is `position: fixed`: when
 * that moves while the drop is decided or lands (the page or a container scrolls, the
 * layout shifts), the box moves with it, by its `translate`, on top of the `transform` the
 * drop animation moves. The flight then ends on the slot where it is now.
 *
 * A layout change (another drag reorders the list) moves the anchor where it settles at
 * once, and its layout animation (FLIP) slides it there from where it was: the box slides
 * along with it, rather than jump. The layout animations that moved the anchor when the box
 * began to follow are the drop animation's: it already lands where they end.
 */

import type { Coordinates, Rect } from '../../types';
import { getRect, layoutShifts, offsetRect } from '../../animation/layout';

export type Follow = ReturnType<typeof createFollow>;

/** Hundredths of a pixel: a layout animation's last frames leave dust that moves nothing. */
const round = (value: number) => Math.round(value * 100) / 100;

/** `getBox`: the box to move, read when it moves. */
export function createFollow(getBox: () => HTMLElement | null) {
  let anchor: Element | null = null;
  /** Where the anchor settled when the box began to follow it. */
  let start: Rect | null = null;
  /**
   * The part of each layout animation of the anchor the box slides along with, per axis:
   * none of the first ones; of a later one, what the layout change it animates moved.
   */
  let shares = new WeakMap<object, Coordinates>();
  /** The anchor's layout animations last frame: how far each had it moved. */
  let last = new Map<object, Coordinates>();
  /** Frames a new layout animation was seen that hadn't moved the anchor yet. */
  let unstarted = new WeakMap<object, number>();
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

  /**
   * Where the anchor settles, and how far its layout animations still have to slide the
   * box; `null` for a frame a new one hasn't moved the anchor yet (an animation library may
   * start a frame late): what it carries is only known once it has.
   */
  const measure = () => {
    const shifts = layoutShifts(anchor!);
    for (const { animation, offset } of shifts) {
      if (shares.has(animation) || offset.x || offset.y) continue;
      const frames = (unstarted.get(animation) ?? 0) + 1;
      unstarted.set(animation, frames);
      // A library under load may take a few frames. One that never moves it (a hook
      // animating something else) counts after four.
      if (frames <= 4) return null;
    }
    // What the animations that ended or were replaced since last frame still had to go and
    // wasn't the box's: a new animation starts from where they left the anchor.
    let carried = { x: 0, y: 0 };
    for (const [animation, offset] of last) {
      if (shifts.some((entry) => entry.animation === animation)) continue;
      const share = shares.get(animation) ?? { x: 0, y: 0 };
      carried = { x: carried.x + offset.x * (1 - share.x), y: carried.y + offset.y * (1 - share.y) };
    }
    last = new Map();
    let all = { x: 0, y: 0 };
    let pending = { x: 0, y: 0 };
    for (const { animation, offset } of shifts) {
      last.set(animation, offset);
      all = { x: all.x + offset.x, y: all.y + offset.y };
      let share = shares.get(animation);
      if (!share) {
        const part = (value: number, from: number) => (value ? (value - from) / value : 0);
        share = { x: part(offset.x, carried.x), y: part(offset.y, carried.y) };
        carried = { x: 0, y: 0 };
        shares.set(animation, share);
      }
      pending = { x: pending.x + offset.x * share.x, y: pending.y + offset.y * share.y };
    }
    return { settled: offsetRect(getRect(anchor!), -all.x, -all.y), pending };
  };

  // Every frame rather than on scroll events: a layout shift moves the anchor too.
  const step = () => {
    frame = 0;
    // An anchor that went away (a virtual row scrolled off) leaves the box where it got to.
    if (!anchor?.isConnected || !start) return;
    const measured = measure();
    // The box waits where it is: the anchor's slide starts next frame.
    if (!measured) {
      if (shift) place(shift);
      frame = requestAnimationFrame(step);
      return;
    }
    const { settled, pending } = measured;
    const x = round(settled.left - start.left + pending.x);
    const y = round(settled.top - start.top + pending.y);
    // Written every frame it is moved: a re-render of the box's style clears it.
    const moved = x !== 0 || y !== 0;
    if (moved || shift) place(moved ? { x, y } : null);
    frame = requestAnimationFrame(step);
  };

  const halt = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    anchor = start = null;
    shares = new WeakMap();
    last = new Map();
    unstarted = new WeakMap();
  };

  return {
    /** The box follows `element` from now on, from where it is; `null`: it stays there. */
    follow(element: Element | null) {
      halt();
      place(null);
      anchor = element?.isConnected ? element : null;
      if (!anchor) return;
      // The layout animations moving it now: the drop animation lands where they end.
      for (const { animation } of layoutShifts(anchor)) shares.set(animation, { x: 0, y: 0 });
      start = measure()!.settled;
      frame = requestAnimationFrame(step);
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
