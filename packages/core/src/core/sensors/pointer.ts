import { defaultDocument, defaultWindow, useEventListener } from '@vueuse/core';
import { onScopeDispose } from 'vue';
import type { ActivationConstraint, ActivationOptions, Coordinates, PointerKind } from '../../types';
import type { DnDManager, DraggableEntry } from '../manager';
import { isInsideInteractive } from '../../utils/dom';

const DEFAULT_ACTIVATION: Record<PointerKind, ActivationConstraint> = {
  mouse: { distance: 4 },
  pen: { distance: 4 },
  touch: { delay: 200, tolerance: 5 },
};

/** Default `tolerance` of a delay without a distance. */
const DEFAULT_TOLERANCE = 5;

/** How long the click suppressor waits for the click that follows a drop. */
const CLICK_SUPPRESS_MS = 100;

const pointerKind = (event: PointerEvent): PointerKind =>
  event.pointerType === 'touch' || event.pointerType === 'pen' ? event.pointerType : 'mouse';

/**
 * Activation constraint for a press: the item's option, then the provider's, then the
 * defaults (mouse/pen 4px, touch 200ms with 5px tolerance). A mouse press on an
 * explicit handle starts at once unless something was configured.
 */
export const resolveActivation = (
  kind: PointerKind,
  item: ActivationOptions | undefined,
  provider: ActivationOptions | undefined,
  onHandle: boolean,
): ActivationConstraint =>
  item?.[kind] ?? provider?.[kind] ?? (onHandle && kind === 'mouse' ? {} : DEFAULT_ACTIVATION[kind]);

/**
 * State of a pending activation after the pointer moved `distance` px in `elapsed` ms:
 * `'start'`, `'abort'` or the progress (0–1). Distance and delay have OR semantics,
 * whichever is met first; moving past `tolerance` while a delay runs aborts, so the
 * page can scroll. No constraint at all starts immediately.
 */
export const checkActivation = (
  constraint: ActivationConstraint,
  distance: number,
  elapsed: number,
): 'start' | 'abort' | number => {
  const required = constraint.distance ?? 0;
  const delay = constraint.delay ?? 0;
  if (required <= 0 && delay <= 0) return 'start';
  if (required > 0 && distance >= required) return 'start';
  if (delay > 0) {
    if (elapsed >= delay) return 'start';
    const tolerance = constraint.tolerance ?? (required > 0 ? Infinity : DEFAULT_TOLERANCE);
    if (distance > tolerance) return 'abort';
  }
  return Math.min(
    Math.max(required > 0 ? distance / required : 0, delay > 0 ? elapsed / delay : 0),
    1,
  );
};

/** True when the drag may start from `target`: on the handle, or anywhere but interactive children. */
const canStartFrom = (entry: DraggableEntry, element: HTMLElement, target: Element) => {
  const handle = entry.getHandle();
  if (handle) {
    const handleElement = typeof handle === 'string' ? target.closest(handle) : handle;
    return !!handleElement && handleElement.contains(target) && element.contains(handleElement);
  }
  return !isInsideInteractive(target, element);
};

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

interface PendingSession {
  pointerId: number;
  id: DraggableEntry['id'];
  origin: Coordinates;
  current: Coordinates;
  constraint: ActivationConstraint;
  timer?: ReturnType<typeof setTimeout>;
  progressFrame?: number;
  startedAt: number;
  /** The press turned into a drag (even if it was cancelled since): its click is swallowed. */
  dragged: boolean;
  /** Undoes `makeSelectableForPress` once the press has been handled. */
  restoreSelectable: () => void;
  stops: Array<() => void>;
}

/** Mouse, touch and pen via Pointer Events. */
export function usePointerSensor(manager: DnDManager): void {
  let session: PendingSession | null = null;

  const release = () => {
    if (!session) return;
    clearTimeout(session.timer);
    if (session.progressFrame) cancelAnimationFrame(session.progressFrame);
    session.stops.forEach((stop) => stop());
    session.restoreSelectable();
    if (document.body.hasPointerCapture?.(session.pointerId)) {
      document.body.releasePointerCapture(session.pointerId);
    }
    session = null;
  };

  const abort = () => {
    const wasActivating = manager.status.value === 'activating';
    release();
    if (wasActivating) {
      manager.status.value = 'idle';
      manager.activationProgress.value = 0;
    }
  };
  manager.activationAborts.add(abort);

  const activate = () => {
    if (!session) return;
    clearTimeout(session.timer);
    if (session.progressFrame) cancelAnimationFrame(session.progressFrame);
    manager.status.value = 'idle';
    if (!manager.start(session.id, session.origin, 'pointer')) return abort();
    session.dragged = true;
    // Capture on <body>, not on the item: the item may be recreated mid-drag.
    try {
      document.body.setPointerCapture(session.pointerId);
    } catch {
      // The pointer may already be gone; document listeners still work.
    }
    manager.move(session.current);
  };

  /** Re-evaluates a pending activation; returns false when it ended (started or aborted). */
  const evaluate = (): boolean => {
    if (!session || manager.status.value !== 'activating') return false;
    const { constraint, origin, current, startedAt } = session;
    const distance = Math.hypot(current.x - origin.x, current.y - origin.y);
    const state = checkActivation(constraint, distance, performance.now() - startedAt);
    if (state === 'start') activate();
    else if (state === 'abort') abort();
    else {
      manager.activationProgress.value = state;
      return true;
    }
    return false;
  };

  const trackDelay = () => {
    const delay = session?.constraint.delay;
    if (!session || !delay) return;
    session.timer = setTimeout(evaluate, delay);
    // Progress for the UI (e.g. a long-press ring), once per frame.
    const tick = () => {
      if (session && evaluate()) session.progressFrame = requestAnimationFrame(tick);
    };
    session.progressFrame = requestAnimationFrame(tick);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!session || event.pointerId !== session.pointerId) return;
    // The mousedown that came with the press has been handled by now.
    session.restoreSelectable();
    session.current = { x: event.clientX, y: event.clientY };
    if (manager.status.value === 'activating') evaluate();
    else if (session.dragged && manager.status.value === 'dragging') manager.move(session.current);
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!session || event.pointerId !== session.pointerId) return;
    const { dragged } = session;
    const dropping = dragged && manager.status.value === 'dragging';
    abort();
    if (dragged) suppressNextClick();
    if (dropping) void manager.drop();
  };

  const onPointerCancel = (event: PointerEvent) => {
    if (!session || event.pointerId !== session.pointerId) return;
    const cancelling = session.dragged && manager.status.value === 'dragging';
    abort();
    if (cancelling) manager.cancel();
  };

  const preventWhileActive = (event: Event) => {
    if (session) event.preventDefault();
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
    if (!session) return;
    event.preventDefault();
    session.restoreSelectable();
    // What the press would have done otherwise: a click drops the selection elsewhere.
    if (!session.dragged) document.getSelection()?.removeAllRanges();
  };

  /** A touch drag owns the gesture: the page must not scroll or zoom under it. */
  const preventTouchScroll = (event: TouchEvent) => {
    if (
      event.cancelable &&
      manager.status.value === 'dragging' &&
      manager.active.value?.sensor === 'pointer'
    ) {
      event.preventDefault();
    }
  };

  useEventListener(defaultDocument, 'pointerdown', (event: PointerEvent) => {
    if (session || manager.status.value !== 'idle') return;
    if (!event.isPrimary || event.button !== 0) return;
    const target = event.composedPath()[0];
    if (!(target instanceof Element)) return;
    const found = manager.findDraggable(target);
    if (!found) return;
    const { entry, element } = found;
    if (entry.isDisabled() || !canStartFrom(entry, element, target)) return;
    if (entry.canDrag && !entry.canDrag(event)) return;

    const kind = pointerKind(event);
    const constraint = resolveActivation(
      kind,
      entry.getActivation?.(),
      manager.props.activation,
      entry.getHandle() != null,
    );
    const origin = { x: event.clientX, y: event.clientY };

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

    session = {
      pointerId: event.pointerId,
      id: entry.id,
      origin,
      current: origin,
      constraint,
      startedAt: performance.now(),
      dragged: false,
      // WebKit dispatches no `selectstart` for a `user-select: none` node, yet still
      // auto-scrolls: such a node is selectable for the press, so it can be cancelled.
      restoreSelectable: kind === 'touch' ? () => {} : makeSelectableForPress(target),
      stops,
    };
    manager.status.value = 'activating';
    manager.activationProgress.value = 0;
    if (evaluate()) trackDelay();
  });

  // iOS Safari honours preventDefault() on touchmove only when a non-passive
  // listener exists before the gesture starts. While activating, the page must
  // still scroll (a quick swipe is a scroll, not a drag).
  useEventListener(defaultWindow, 'touchmove', preventTouchScroll, { passive: false });

  useEventListener(defaultDocument, 'visibilitychange', () => {
    if (document.visibilityState !== 'hidden') return;
    abort();
    manager.cancel();
  });

  onScopeDispose(() => {
    release();
    manager.activationAborts.delete(abort);
  });
}
