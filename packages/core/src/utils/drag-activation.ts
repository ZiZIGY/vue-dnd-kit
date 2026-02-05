import type { IDragActivation, TPointerState } from '../types';

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

export function calculateDistanceProgress(
  pointer: TPointerState,
  distanceThreshold: IDragActivation['distance']
): number {
  if (!pointer || !distanceThreshold) return 1;

  const dx = Math.abs(pointer.current.x - pointer.start.x);
  const dy = Math.abs(pointer.current.y - pointer.start.y);

  if (typeof distanceThreshold === 'number') {
    const moved = Math.sqrt(dx * dx + dy * dy);
    return Math.min(moved / distanceThreshold, 1);
  }

  const { x = 0, y = 0, condition = 'any' } = distanceThreshold;
  
  if (x === 0 && y === 0) return 1;
  
  const progressX = x > 0 ? Math.min(dx / x, 1) : 1;
  const progressY = y > 0 ? Math.min(dy / y, 1) : 1;

  return condition === 'both'
    ? Math.min(progressX, progressY)
    : Math.max(progressX, progressY);
}

export function isDistanceThresholdPassed(
  pointer: TPointerState,
  distanceThreshold: IDragActivation['distance']
): boolean {
  return calculateDistanceProgress(pointer, distanceThreshold) >= 1;
}
