/**
 * Mouse, touch and pen via Pointer Events (rfcs/0001-v3.md §10), built on the public
 * sensor API like any custom sensor: the provider checks where a press may start and
 * waits for its activation constraint (`SensorContext.activate`). What is left here is
 * what pointers need from the page: capture, no text selection, no native drag or
 * context menu, no scrolling under a touch drag, no click after the drop.
 */

import { defaultDocument, defaultWindow, useEventListener } from '@vueuse/core';
import type { PointerKind, SensorDrag } from '../../types';
import { defineSensor } from './host';

/** How long the click suppressor waits for the click that follows a drop. */
const CLICK_SUPPRESS_MS = 100;

const pointerKind = (event: PointerEvent): PointerKind =>
  event.pointerType === 'touch' || event.pointerType === 'pen' ? event.pointerType : 'mouse';

/**
 * Swallows the click that follows a drag (with capture on <body> it lands on a
 * common ancestor). Removed by that click, by the next press, or after a moment.
 */
const suppressNextClick = () => {
  const stop = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    cleanup();
  };
  const cleanup = () => {
    clearTimeout(timer);
    window.removeEventListener('click', stop, true);
    window.removeEventListener('pointerdown', cleanup, true);
  };
  window.addEventListener('click', stop, true);
  window.addEventListener('pointerdown', cleanup, true);
  const timer = setTimeout(cleanup, CLICK_SUPPRESS_MS);
};

const USER_SELECT = ['-webkit-user-select', 'user-select'] as const;

const isUnselectable = (element: Element): boolean => {
  const style = getComputedStyle(element);
  return USER_SELECT.some((name) => style.getPropertyValue(name) === 'none');
};

/**
 * Makes the pressed node selectable until the returned function runs, so that the
 * press dispatches a `selectstart` the sensor can cancel (see the pointerdown handler).
 * Only an inline value the sensor set is ever restored (rfcs/0001-v3.md §13).
 */
export const makeSelectableForPress = (element: Element): (() => void) => {
  if (!(element instanceof HTMLElement || element instanceof SVGElement) || !isUnselectable(element)) {
    return () => {};
  }
  const { style } = element;
  const saved = USER_SELECT.map(
    (name) => [name, style.getPropertyValue(name), style.getPropertyPriority(name)] as const,
  );
  for (const name of USER_SELECT) style.setProperty(name, 'text', 'important');
  let restored = false;
  return () => {
    if (restored) return;
    restored = true;
    for (const [name, value, priority] of saved) {
      if (value) style.setProperty(name, value, priority);
      else style.removeProperty(name);
    }
  };
};

/** A press on a draggable, from pointerdown to pointerup (or cancel). */
interface Press {
  pointerId: number;
  drag: SensorDrag;
  /** Undoes `makeSelectableForPress` once the press has been handled. */
  restoreSelectable: () => void;
  stops: Array<() => void>;
}

/** Mouse, touch and pen via Pointer Events. In `sensors` by default. */
export const pointerSensor = /* @__PURE__ */ defineSensor({
  name: 'pointer',
  setup(context) {
    let press: Press | null = null;

    const release = () => {
      if (!press) return;
      press.stops.forEach((stop) => stop());
      press.restoreSelectable();
      if (document.body.hasPointerCapture?.(press.pointerId)) {
        document.body.releasePointerCapture(press.pointerId);
      }
      press = null;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!press || event.pointerId !== press.pointerId) return;
      // The mousedown that came with the press has been handled by now.
      press.restoreSelectable();
      press.drag.move({ x: event.clientX, y: event.clientY });
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!press || event.pointerId !== press.pointerId) return;
      const { drag } = press;
      release();
      // Even when the drag was cancelled meanwhile (Escape): the press was a drag.
      if (drag.started) suppressNextClick();
      void drag.drop();
    };

    const onPointerCancel = (event: PointerEvent) => {
      if (!press || event.pointerId !== press.pointerId) return;
      const { drag } = press;
      release();
      drag.cancel();
    };

    const preventWhileActive = (event: Event) => {
      if (press) event.preventDefault();
    };

    /**
     * A press on a draggable never starts a text selection (rfcs/0001-v3.md §10). Beyond
     * the selection itself, WebKit uses it to auto-scroll the scroll container the press
     * started in whenever the pointer is outside it, even with the library's auto-scroll
     * off: that fights the library's own auto-scroll and moves targets under the pointer.
     * WebKit settles this on mousedown, by dispatching `selectstart`: once that is
     * cancelled, it neither selects nor auto-scrolls. (Cancelling `mousemove` or
     * `-webkit-user-drag: none` don't stop it.)
     */
    const cancelSelection = (event: Event) => {
      if (!press) return;
      event.preventDefault();
      press.restoreSelectable();
      // What the press would have done otherwise: a click drops the selection elsewhere.
      if (!press.drag.started) document.getSelection()?.removeAllRanges();
    };

    /** A touch drag owns the gesture: the page must not scroll or zoom under it. */
    const preventTouchScroll = (event: TouchEvent) => {
      if (event.cancelable && press?.drag.state === 'dragging') event.preventDefault();
    };

    useEventListener(defaultDocument, 'pointerdown', (event: PointerEvent) => {
      if (press || !event.isPrimary || event.button !== 0) return;
      const target = event.composedPath()[0];
      if (!(target instanceof Element)) return;
      const kind = pointerKind(event);
      const { pointerId } = event;
      const drag = context.activate({
        target,
        point: { x: event.clientX, y: event.clientY },
        event,
        activation: kind,
        onStart() {
          // Capture on <body>, not on the item: the item may be recreated mid-drag.
          try {
            document.body.setPointerCapture(pointerId);
          } catch {
            // The pointer may already be gone; document listeners still work.
          }
        },
        // An aborted activation (moved past the tolerance, Escape) ends the press. A drag
        // that ended keeps it until the pointerup, whose click it swallows.
        onEnd(ended) {
          if (!ended.started && press?.drag === ended) release();
        },
      });
      if (!drag) return;

      const stops = [
        useEventListener(document, 'pointermove', onPointerMove),
        useEventListener(document, 'pointerup', onPointerUp),
        useEventListener(document, 'pointercancel', onPointerCancel),
        useEventListener(window, 'contextmenu', preventWhileActive),
        useEventListener(window, 'dragstart', preventWhileActive),
        // From the press on: the mousedown that follows decides about selecting.
        useEventListener(document, 'selectstart', cancelSelection, { capture: true }),
      ];
      if (kind === 'touch') {
        // Touch events keep targeting the element the finger landed on. When a drag into
        // another list re-creates the item, that element leaves the document and its
        // touchmoves no longer bubble to the window listener below: the browser would
        // pan the page and fire `pointercancel`. A listener on the target itself still
        // sees them.
        stops.push(useEventListener(target, 'touchmove', preventTouchScroll, { passive: false }));
      }
      press = {
        pointerId,
        drag,
        // WebKit dispatches no `selectstart` for a `user-select: none` node, yet still
        // auto-scrolls: such a node is selectable for the press, so it can be cancelled.
        restoreSelectable: kind === 'touch' ? () => {} : makeSelectableForPress(target),
        stops,
      };
    });

    // iOS Safari honours preventDefault() on touchmove only when a non-passive
    // listener exists before the gesture starts. While activating, the page must
    // still scroll (a quick swipe is a scroll, not a drag).
    useEventListener(defaultWindow, 'touchmove', preventTouchScroll, { passive: false });

    // The provider cancels the drag of a hidden tab; its pointerup may never come.
    useEventListener(defaultDocument, 'visibilitychange', () => {
      if (document.visibilityState === 'hidden') release();
    });

    return release;
  },
});
