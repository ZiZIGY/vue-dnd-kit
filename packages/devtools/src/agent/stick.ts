/**
 * The joystick. The tab tells where its knob is (`-1…1` per axis, like a gamepad's stick)
 * and the drag moves that way, faster the farther the knob is from the center. It is a
 * pointer drag of the `devtools` sensor (`drive.ts`): hit-tested where it goes, sorting
 * the lists under it, auto-scrolling their containers at the edges. Pushing the knob while
 * no drag runs picks up the item the tab chose, at its center; any drag that runs is
 * steered (one started from the page's keyboard too).
 */

import type { Coordinates, Key, SensorDrag } from '@vue-dnd-kit/core';
import type { DevtoolsProvider } from '@vue-dnd-kit/core/devtools';
import type { Drive } from './drive';

/** Pixels per second with the knob at the rim. */
export const MAX_SPEED = 900;
/** A knob this close to the center doesn't move the drag. */
export const DEAD_ZONE = 0.08;
/** Speed grows with the tilt to this power: fine moves near the center, fast ones at the rim. */
const CURVE = 1.7;
/** Longest step between two frames (a frame that came late doesn't jump). */
const MAX_STEP = 0.05;

/** Pixels per second for a knob at `tilt` (its distance from the center, 0–1). */
export const speedOf = (tilt: number): number =>
  tilt <= DEAD_ZONE ? 0 : MAX_SPEED * ((Math.min(tilt, 1) - DEAD_ZONE) / (1 - DEAD_ZONE)) ** CURVE;

/** Center of the visible part of `element`, scrolled into view first when it is out of it. */
const centerOf = (element: Element): Coordinates => {
  element.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  const rect = element.getBoundingClientRect();
  const left = Math.max(rect.left, 0);
  const top = Math.max(rect.top, 0);
  const right = Math.min(rect.right, window.innerWidth);
  const bottom = Math.min(rect.bottom, window.innerHeight);
  return right > left && bottom > top
    ? { x: (left + right) / 2, y: (top + bottom) / 2 }
    : { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), Math.max(max - 1, 0));

export interface Stick {
  /** The knob is at `x`, `y`; `grab` is picked up when its provider runs no drag. */
  set(x: number, y: number, grab?: { provider: DevtoolsProvider; id: Key }): void;
  /** Drops the steered drag: resolves `true` when it went through. */
  drop(): Promise<boolean>;
  /** Cancels the steered drag (or a press that is activating). */
  cancel(): void;
  /** Lets the knob go (the tab is gone). */
  stop(): void;
}

export function createStick(drive: Drive, providers: () => DevtoolsProvider[]): Stick {
  let vector = { x: 0, y: 0 };
  /** The drag being steered, and where its pointer is. */
  let steered: { provider: DevtoolsProvider; drag: SensorDrag; point: Coordinates } | null = null;
  let frame = 0;
  let last = 0;

  /** The drag to steer: ours, else whichever drag runs (its pointer as the provider last saw it). */
  const current = () => {
    if (steered?.drag.state !== 'ended' && steered) return steered;
    steered = null;
    for (const provider of providers()) {
      const drag = drive.contextOf(provider)?.drag;
      const pointer = drag?.state === 'dragging' ? provider.snapshot().session.pointer : null;
      if (drag && pointer) return (steered = { provider, drag, point: { ...pointer } });
    }
    return null;
  };

  const tick = (now: number) => {
    frame = 0;
    const tilt = Math.hypot(vector.x, vector.y);
    const target = tilt > DEAD_ZONE ? current() : null;
    if (!target) return;
    const step = Math.min((now - last) / 1000, MAX_STEP);
    last = now;
    const distance = speedOf(tilt) * step;
    target.point = {
      x: clamp(target.point.x + (vector.x / tilt) * distance, window.innerWidth),
      y: clamp(target.point.y + (vector.y / tilt) * distance, window.innerHeight),
    };
    if (target.drag.state === 'dragging') target.drag.move(target.point);
    frame = requestAnimationFrame(tick);
  };

  const grabbed = (provider: DevtoolsProvider, id: Key) => {
    const context = drive.contextOf(provider);
    const element = provider.snapshot().draggables.find((entry) => entry.id === id)?.element;
    if (!context || !element || context.status !== 'idle') return null;
    const point = centerOf(element);
    const drag = context.activate({ target: id, type: 'pointer', point });
    return drag && (steered = { provider, drag, point });
  };

  return {
    set(x, y, grab) {
      vector = { x, y };
      if (Math.hypot(x, y) <= DEAD_ZONE) return;
      if (!current() && grab) grabbed(grab.provider, grab.id);
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    },
    async drop() {
      vector = { x: 0, y: 0 };
      const target = current();
      steered = null;
      return target ? target.drag.drop() : false;
    },
    cancel() {
      vector = { x: 0, y: 0 };
      const target = current();
      steered = null;
      if (target) target.drag.cancel();
      else for (const provider of providers()) provider.cancel();
    },
    stop() {
      vector = { x: 0, y: 0 };
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}
