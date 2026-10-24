import { defaultDocument, defaultWindow, useEventListener } from '@vueuse/core';
import { onScopeDispose } from 'vue';
import type { ActivationConstraint, Coordinates, PointerKind } from '../../types';
import type { DnDManager, DraggableEntry } from '../manager';
import { isInsideInteractive } from '../../utils/dom';

const DEFAULT_ACTIVATION: Record<PointerKind, ActivationConstraint> = {
  mouse: { distance: 4 },
  pen: { distance: 4 },
  touch: { delay: 200, tolerance: 5 },
};

const pointerKind = (event: PointerEvent): PointerKind =>
  event.pointerType === 'touch' || event.pointerType === 'pen' ? event.pointerType : 'mouse';

/** True when the drag may start from `target`: on the handle, or anywhere but interactive children. */
const canStartFrom = (entry: DraggableEntry, element: HTMLElement, target: Element) => {
  const handle = entry.getHandle();
  if (handle) {
    const handleElement = typeof handle === 'string' ? target.closest(handle) : handle;
    return !!handleElement && handleElement.contains(target) && element.contains(handleElement);
  }
  return !isInsideInteractive(target, element);
};

const suppressNextClick = () => {
  const stop = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  window.addEventListener('click', stop, { capture: true, once: true });
  setTimeout(() => window.removeEventListener('click', stop, { capture: true }), 0);
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
    // Capture on <body>, not on the item: the item may be recreated mid-drag.
    try {
      document.body.setPointerCapture(session.pointerId);
    } catch {
      // The pointer may already be gone; document listeners still work.
    }
    manager.move(session.current);
  };

  const trackDelayProgress = () => {
    if (!session?.constraint.delay) return;
    const delay = session.constraint.delay;
    const tick = () => {
      if (!session || manager.status.value !== 'activating') return;
      manager.activationProgress.value = Math.min((performance.now() - session.startedAt) / delay, 1);
      session.progressFrame = requestAnimationFrame(tick);
    };
    session.progressFrame = requestAnimationFrame(tick);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!session || event.pointerId !== session.pointerId) return;
    session.current = { x: event.clientX, y: event.clientY };
    if (manager.status.value === 'activating') {
      const { constraint, origin, current } = session;
      const distance = Math.hypot(current.x - origin.x, current.y - origin.y);
      if (constraint.delay) {
        if (distance > (constraint.tolerance ?? 5)) abort();
        return;
      }
      const required = constraint.distance ?? 0;
      manager.activationProgress.value = required ? Math.min(distance / required, 1) : 1;
      if (distance >= required) activate();
      return;
    }
    if (manager.status.value === 'dragging') manager.move(session.current);
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!session || event.pointerId !== session.pointerId) return;
    const dragging = manager.status.value === 'dragging';
    abort();
    if (dragging) {
      suppressNextClick();
      void manager.drop();
    }
  };

  const onPointerCancel = (event: PointerEvent) => {
    if (!session || event.pointerId !== session.pointerId) return;
    const dragging = manager.status.value === 'dragging';
    abort();
    if (dragging) manager.cancel();
  };

  const preventWhileActive = (event: Event) => {
    if (session) event.preventDefault();
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
    const configured = entry.activation?.[kind] ?? manager.props.activation?.[kind];
    // A mouse press on an explicit handle starts immediately.
    const onHandle = kind === 'mouse' && entry.getHandle() != null;
    const constraint = configured ?? (onHandle ? {} : DEFAULT_ACTIVATION[kind]);
    const origin = { x: event.clientX, y: event.clientY };

    session = {
      pointerId: event.pointerId,
      id: entry.id,
      origin,
      current: origin,
      constraint,
      startedAt: performance.now(),
      stops: [
        useEventListener(document, 'pointermove', onPointerMove),
        useEventListener(document, 'pointerup', onPointerUp),
        useEventListener(document, 'pointercancel', onPointerCancel),
        useEventListener(window, 'contextmenu', preventWhileActive),
        useEventListener(window, 'dragstart', preventWhileActive),
      ],
    };
    manager.status.value = 'activating';
    manager.activationProgress.value = 0;

    if (constraint.delay) {
      session.timer = setTimeout(activate, constraint.delay);
      trackDelayProgress();
    } else if (!constraint.distance) {
      activate();
    }
  });

  // iOS Safari honours preventDefault() on touchmove only when a non-passive
  // listener exists before the gesture starts.
  useEventListener(
    defaultWindow,
    'touchmove',
    (event: TouchEvent) => {
      if (manager.status.value === 'dragging' && manager.active.value?.sensor === 'pointer') {
        event.preventDefault();
      }
    },
    { passive: false },
  );

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
