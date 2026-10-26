/**
 * The frame loop of a drag: at most once per animation frame it applies the modifiers
 * to the pointer, moves the overlay box, detects the target and tells the target, the
 * monitors and the live region.
 */

import { nextTick } from 'vue';
import type { Coordinates } from '../../types';
import type { ManagerContext } from './state';
import { vibrate } from '../haptics';

export type FrameLoop = ReturnType<typeof createFrameLoop>;

const samePoint = (a: Coordinates, b: Coordinates | null) => !!b && a.x === b.x && a.y === b.y;

export function createFrameLoop(ctx: ManagerContext) {
  let frame = 0;
  /** Pointer of the last target detection (after modifiers), and the pointer as reported then. */
  let detectedAt: Coordinates | null = null;
  let detectedRaw: Coordinates | null = null;
  /** Scroll, resize or an external request since the last frame: detect even if the pointer stood still. */
  let refreshRequested = false;

  const runFrame = () => {
    frame = 0;
    const current = ctx.active.value;
    if (ctx.status.value !== 'dragging' || !current) return;
    const { overlay, origin, raw } = ctx;
    // Reorders render between frames: the slot may have moved into another list.
    overlay.updateFitSize(current);
    overlay.stepResize();
    const refresh = refreshRequested;
    refreshRequested = false;
    const offset = overlay.applyModifiers(current, { x: raw.x - origin.x, y: raw.y - origin.y });
    const point = { x: origin.x + offset.x, y: origin.y + offset.y };
    // A modifier moved the point off the pointer (it may hold it while the pointer moves on).
    if (point.x !== raw.x || point.y !== raw.y) ctx.pointerElement = null;

    // The target follows the pointer, scrolling and resizing, never a layout shift
    // alone: a frame where none of them changed (a repeated pointermove) does nothing.
    // A point a modifier holds still (at the edge of a box) runs on while the pointer
    // moves: lists project from the pointer there (`sortable/modes/sort.ts`).
    if (!refresh && detectedAt && samePoint(point, detectedAt) && samePoint(raw, detectedRaw)) return;
    // The first detection of the drag: the target found under the item at pickup isn't news.
    const pickup = !detectedAt;
    detectedAt = point;
    detectedRaw = { x: raw.x, y: raw.y };
    ctx.transform.value = offset;
    ctx.pointer.value = point;
    ctx.measurer.nextFrame();
    // Scrolling moves the content under the pointer: the hysteresis, which measures
    // pointer travel, no longer applies.
    if (refresh) ctx.detection.stabilizer.reset();

    const previous = ctx.over.value;
    const next = ctx.detection.detectOver(current, point);
    const changed = previous?.id !== next?.id || previous?.accepted !== next?.accepted;
    if (changed) ctx.over.value = next;
    else if (previous && next) previous.rect = next.rect;

    const { events } = ctx;
    const event = events.createEvent();
    if (changed) {
      if (previous) ctx.droppables.get(previous.id)?.onDragLeave?.(event);
      if (next) ctx.droppables.get(next.id)?.onDragEnter?.(event);
      events.emit('onDragOver', event);
      if (!pickup) {
        events.announce('onDragOver', event);
        if (next?.accepted) vibrate(ctx.props.haptics, 'enter', ctx.touch);
      }
    }
    events.emit('onDragMove', event);
    // The move may have reordered (sortable): fit the slot once that rendered, even if
    // the pointer stops here and no further frame runs.
    void nextTick(() => {
      if (ctx.status.value === 'dragging' && ctx.active.value === current) overlay.updateFitSize(current);
    });
  };

  const requestFrame = () => {
    if (!frame && ctx.status.value === 'dragging') frame = requestAnimationFrame(runFrame);
  };

  return {
    runFrame,
    requestFrame,
    /** Re-detects the target on the next frame even if the pointer stands still (scroll, resize). */
    scheduleFrame() {
      if (ctx.status.value !== 'dragging') return;
      refreshRequested = true;
      requestFrame();
    },
    /** Runs a pending frame now. Without one, the target is already up to date. */
    flushFrame() {
      if (!frame) return;
      cancelAnimationFrame(frame);
      runFrame();
    },
    /** Drops the pending frame. */
    cancel() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    },
    /** A new session (or none): its first detection is the pickup's. */
    reset() {
      detectedAt = null;
      detectedRaw = null;
      refreshRequested = false;
    },
  };
}
