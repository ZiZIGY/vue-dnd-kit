import type { IDragActivation, TPointerState } from '../../external/types';
import type { IDnDProviderInternal } from '../types/provider';
import { startDraggingForProvider } from './pointer';

/**
 * Checks if the click target is within the drag handle (if specified)
 */
export function checkDragHandle(
  target: HTMLElement,
  draggable: HTMLElement,
  handleSelector?: string
): boolean {
  if (!handleSelector) return true;

  const handleElement = target.closest(handleSelector) as HTMLElement | null;

  if (!handleElement) return false;

  return draggable.contains(handleElement);
}

/**
 * Calculates distance progress (0-1) for activation threshold
 */
export function calculateDistanceProgress(
  pointer: TPointerState,
  distanceThreshold: IDragActivation['distance']
): number {
  if (!pointer || !distanceThreshold) return 1;

  const deltaX = Math.abs(pointer.current.x - pointer.start.x);
  const deltaY = Math.abs(pointer.current.y - pointer.start.y);

  if (typeof distanceThreshold === 'number') {
    const movedDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return Math.min(movedDistance / distanceThreshold, 1);
  }

  const {
    x: distanceX = 0,
    y: distanceY = 0,
    condition = 'any',
  } = distanceThreshold;

  if (distanceX === 0 && distanceY === 0) return 1;

  const progressX = distanceX > 0 ? Math.min(deltaX / distanceX, 1) : 1;
  const progressY = distanceY > 0 ? Math.min(deltaY / distanceY, 1) : 1;

  return condition === 'both'
    ? Math.min(progressX, progressY)
    : Math.max(progressX, progressY);
}

/**
 * Returns true if distance threshold is met
 */
export function isDistanceThresholdPassed(
  pointer: TPointerState,
  distanceThreshold: IDragActivation['distance']
): boolean {
  return calculateDistanceProgress(pointer, distanceThreshold) >= 1;
}

/**
 * Returns true if activation conditions are met (distance + delay, respecting condition)
 */
export function isActivationComplete(
  distanceProgress: number,
  delayProgress: number,
  activation?: IDragActivation
): boolean {
  if (!activation) return true;

  const hasDistance = activation.distance != null;
  const hasDelay = activation.delay != null;

  if (!hasDistance && !hasDelay) return true;
  if (hasDistance && !hasDelay) return distanceProgress >= 1;
  if (!hasDistance && hasDelay) return delayProgress >= 1;

  const condition = activation.condition ?? 'both';
  return condition === 'both'
    ? distanceProgress >= 1 && delayProgress >= 1
    : distanceProgress >= 1 || delayProgress >= 1;
}

/**
 * If activation is complete, starts dragging. Returns true if drag was started
 */
export function tryStartDragIfActivationComplete(
  provider: IDnDProviderInternal
): boolean {
  if (
    provider.state.value !== 'activating' ||
    !provider.entities.initiatingDraggable
  )
    return false;
  const entity = provider.entities.draggableMap.get(
    provider.entities.initiatingDraggable
  );
  if (
    !isActivationComplete(
      provider.distanceProgress.value,
      provider.delay.progress,
      entity?.activation
    )
  ) {
    return false;
  }
  startDraggingForProvider(provider);
  return true;
}

/**
 * Creates RAF-based delay timer that ticks until activation is complete, then calls onComplete
 */
export function createActivationDelayTimer(
  provider: IDnDProviderInternal,
  onComplete: () => void
): { cancel: () => void } {
  let rafId: number | null = null;
  const tick = () => {
    if (
      provider.state.value !== 'activating' ||
      !provider.entities.initiatingDraggable
    ) {
      rafId = null;
      return;
    }
    const entity = provider.entities.draggableMap.get(
      provider.entities.initiatingDraggable
    );
    const delay = entity?.activation?.delay;
    if (!delay) {
      rafId = null;
      return;
    }
    provider.delay.progress = Math.min(
      (Date.now() - provider.delay.startTime) / (delay * 1000),
      1
    );
    if (
      isActivationComplete(
        provider.distanceProgress.value,
        provider.delay.progress,
        entity?.activation
      )
    ) {
      onComplete();
      rafId = null;
    } else {
      rafId = requestAnimationFrame(tick);
    }
  };
  rafId = requestAnimationFrame(tick);
  return {
    cancel: () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
  };
}
