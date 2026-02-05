import type { CSSProperties } from 'vue';
import type { ICoordinates } from '../types';
import { DnDSelectors } from './namespaces';

/**
 * Конвертирует viewport координаты в координаты относительно контейнера
 * scroll - позиция прокрутки страницы (window.scrollX, window.scrollY)
 */
export const getRelativeCoordinates = (
  event: ICoordinates,
  container: HTMLElement | null,
  scroll: { x: number; y: number } = { x: 0, y: 0 }
) => {
  if (!container) {
    return event;
  }

  const rect = container.getBoundingClientRect();
  const scrollLeft = container.scrollLeft || scroll.x;
  const scrollTop = container.scrollTop || scroll.y;

  const x = event.x - rect.left + scrollLeft + scroll.x;
  const y = event.y - rect.top + scrollTop + scroll.y;

  return { x, y };
};

export const getBoundedSelectionArea = (
  start: ICoordinates,
  current: ICoordinates,
  container: HTMLElement | null
): CSSProperties => {
  if (!container) return {};

  const containerRect = container.getBoundingClientRect();
  
  const left = Math.max(containerRect.left, Math.min(start.x, current.x));
  const top = Math.max(containerRect.top, Math.min(start.y, current.y));
  const right = Math.min(containerRect.right, Math.max(start.x, current.x));
  const bottom = Math.min(containerRect.bottom, Math.max(start.y, current.y));

  const width = Math.max(0, right - left);
  const height = Math.max(0, bottom - top);

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    position: 'fixed', 
    pointerEvents: 'none',
    border: '1px solid #3b82f6',
    backgroundColor: '#3b82f61a'
  };
};

export const checkIsSelectableArea = (
  event: PointerEvent,
  container: HTMLElement
): boolean => {
  const target = event.target as HTMLElement;

  const closestSelectableArea = target.closest(
    DnDSelectors.SELECT_AREA
  ) as HTMLElement | null;

  if (closestSelectableArea && closestSelectableArea !== container)
    return false;

  return true;
};

/**
 * Creates a DOMRect for the selection box from pointer coordinates
 */
export const getSelectionBoxRect = (
  start: ICoordinates,
  current: ICoordinates
): DOMRect => {
  const left = Math.min(start.x, current.x);
  const top = Math.min(start.y, current.y);
  const right = Math.max(start.x, current.x);
  const bottom = Math.max(start.y, current.y);
  
  const width = right - left;
  const height = bottom - top;
  
  return new DOMRect(left, top, width, height);
};
