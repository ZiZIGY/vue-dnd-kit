/**
 * Mouse, touch and pen via Pointer Events (rfcs/0001-v3.md §10), built on the public
 * sensor API like any custom sensor: the provider checks where a press may start and
 * waits for its activation constraint (`SensorContext.activate`). What is left here is
 * what pointers need from the page: capture, no text selection, no native drag or
 * context menu, no scrolling under a touch drag, no click after the drop.
 */

import { useEventListener } from '@vueuse/core';
import type { Coordinates, PointerKind, SensorDrag } from '../../types';
import { isElement } from '../../utils/dom';
import { defineSensor } from './host';

/** How long the click suppressor waits for the click that follows a drop. */
const CLICK_SUPPRESS_MS = 100;

/**
 * Movement (px) a press may make and stay a click: a drag that starts at once (a mouse
 * on a handle) and is let go where it started clicks what was pressed.
 */
const CLICK_TOLERANCE = 3;

const pointerKind = (event: PointerEvent): PointerKind =>
  event.pointerType === 'touch' || event.pointerType === 'pen' ? event.pointerType : 'mouse';

/**
 * Swallows the click that follows a drag in `view` (with capture on <body> it lands on a
 * common ancestor). Removed by that click, by the next press, or after a moment.
 */
const suppressNextClick = (view: Window) => {
  const stop = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    cleanup();
  };
  const cleanup = () => {
    clearTimeout(timer);
    view.removeEventListener('click', stop, true);
    view.removeEventListener('pointerdown', cleanup, true);
  };
  view.addEventListener('click', stop, true);
  view.addEventListener('pointerdown', cleanup, true);
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
  // HTML and SVG elements have a `style`; another window's are of its own classes.
  if (!isElement(element) || !('style' in element) || !isUnselectable(element)) {
    return () => {};
  }
  const { style } = element as HTMLElement | SVGElement;
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
  /** `null` while a resumed drag is carried with no button held: any primary pointer moves it. */
  pointerId: number | null;
  drag: SensorDrag;
  kind: PointerKind;
  /** Where it was pressed; `null` for a carried drag. */
  point: Coordinates | null;
  /** It went past `CLICK_TOLERANCE`: a drag, not a click. */
  moved: boolean;
  /** Undoes `makeSelectableForPress` once the press has been handled. */
  restoreSelectable: () => void;
  /** The window it was pressed in: the whole drag runs there. */
  view: Window;
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
      const { body } = press.view.document;
      if (press.pointerId !== null && body.hasPointerCapture?.(press.pointerId)) {
        body.releasePointerCapture(press.pointerId);
      }
      press = null;
    };

    /**
     * Capture on <body>, not on the item: the item may be recreated mid-drag. Captured,
     * the click of the press would go to <body>: a press waits until it has moved.
     */
    const capture = (pointerId: number | null, view: Window) => {
      if (pointerId === null) return;
      try {
        view.document.body.setPointerCapture(pointerId);
      } catch {
        // The pointer may already be gone; document listeners still work.
      }
    };

    /** What a press in `view` listens to until it is released. */
    const listenDuringPress = (view: Window) => {
      const doc = view.document;
      return [
        useEventListener(doc, 'pointermove', onPointerMove),
        useEventListener(doc, 'pointerup', onPointerUp),
        useEventListener(doc, 'pointercancel', onPointerCancel),
        useEventListener(view, 'contextmenu', preventWhileActive),
        useEventListener(view, 'dragstart', preventWhileActive),
        // From the press on: the mousedown that follows decides about selecting.
        useEventListener(doc, 'selectstart', cancelSelection, { capture: true }),
      ];
    };

    /** The pointer of the press; a carried drag (no button held) follows the primary one. */
    const isOurs = (event: PointerEvent) =>
      !!press && (press.pointerId === null ? event.isPrimary : event.pointerId === press.pointerId);

    const onPointerMove = (event: PointerEvent) => {
      if (!press || !isOurs(event)) return;
      // The mousedown that came with the press has been handled by now.
      press.restoreSelectable();
      const { point } = press;
      if (!press.moved && point && Math.hypot(event.clientX - point.x, event.clientY - point.y) > CLICK_TOLERANCE) {
        press.moved = true;
        if (press.drag.started) capture(press.pointerId, press.view);
      }
      press.drag.move({ x: event.clientX, y: event.clientY });
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!press || event.pointerId !== press.pointerId) return;
      const { drag, kind, moved, view } = press;
      release();
      // Even when the drag was cancelled meanwhile (Escape): the press was a drag. A mouse
      // press that started at once and didn't move is a click (a touch held still is not).
      if (drag.started && (moved || kind === 'touch')) suppressNextClick(view);
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
      if (!press.drag.started) press.view.document.getSelection()?.removeAllRanges();
    };

    /** A touch drag owns the gesture: the page must not scroll or zoom under it. */
    const preventTouchScroll = (event: TouchEvent) => {
      if (event.cancelable && press?.drag.state === 'dragging') event.preventDefault();
    };

    /**
     * A carried drag's press: it takes the item in hand where it lands (a touch has no
     * hover, the item comes to the finger) and its release drops. The page under the item
     * never sees it.
     */
    const onCarriedDown = (event: PointerEvent) => {
      if (!press || press.pointerId !== null || !event.isPrimary) return;
      event.preventDefault();
      event.stopPropagation();
      press.pointerId = event.pointerId;
      capture(event.pointerId, press.view);
      press.drag.move({ x: event.clientX, y: event.clientY });
    };

    /**
     * The drop the pointer asked for didn't happen and the drag goes on (`'continue'`),
     * with no button held any more: the item follows the pointer, and the next release
     * drops it, so a click does.
     */
    const carry = (drag: SensorDrag) => {
      // The window the released press was in: the drag goes on there.
      const view = press?.view ?? window;
      release();
      press = {
        pointerId: null,
        drag,
        kind: 'mouse',
        point: null,
        moved: true,
        restoreSelectable: () => {},
        view,
        stops: [useEventListener(view, 'pointerdown', onCarriedDown, { capture: true }), ...listenDuringPress(view)],
      };
    };

    const onPointerDown = (event: PointerEvent, view: Window) => {
      if (press || !event.isPrimary || event.button !== 0) return;
      const target = event.composedPath()[0];
      if (!isElement(target)) return;
      const kind = pointerKind(event);
      const { pointerId } = event;
      const point = { x: event.clientX, y: event.clientY };
      const drag = context.activate({
        target,
        point,
        event,
        activation: kind,
        onStart() {
          // A drag that starts at once (`press` isn't set yet) waits for the pointer to move.
          if (kind === 'touch' || press?.moved) capture(pointerId, view);
        },
        // An aborted activation (moved past the tolerance, Escape) ends the press. A drag
        // that ended keeps it until the pointerup, whose click it swallows.
        onEnd(ended) {
          if (!ended.started && press?.drag === ended) release();
          // A carried drag ended otherwise (Escape): nothing to release with a click.
          else if (press?.drag === ended && press.pointerId === null) release();
        },
        onResume: carry,
      });
      if (!drag) return;

      const stops = listenDuringPress(view);
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
        kind,
        point,
        moved: false,
        // WebKit dispatches no `selectstart` for a `user-select: none` node, yet still
        // auto-scrolls: such a node is selectable for the press, so it can be cancelled.
        restoreSelectable: kind === 'touch' ? () => {} : makeSelectableForPress(target),
        view,
        stops,
      };
    };

    // Every window the provider works in: a press there drags there.
    context.onWindow((view) => {
      const doc = view.document;
      useEventListener(doc, 'pointerdown', (event: PointerEvent) => onPointerDown(event, view));
      // iOS Safari honours preventDefault() on touchmove only when a non-passive
      // listener exists before the gesture starts. While activating, the page must
      // still scroll (a quick swipe is a scroll, not a drag).
      useEventListener(view, 'touchmove', preventTouchScroll, { passive: false });
      // The provider cancels the drag of a hidden tab; its pointerup may never come.
      useEventListener(doc, 'visibilitychange', () => {
        if (doc.visibilityState === 'hidden' && press?.view === view) release();
      });
      // The window closes: a press of it is over.
      return () => {
        if (press?.view === view) release();
      };
    });

    return release;
  },
});
