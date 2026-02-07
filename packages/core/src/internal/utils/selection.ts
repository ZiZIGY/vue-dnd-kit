import type { CSSProperties } from 'vue';
import type { ICoordinates } from '../../external/types';
import { DnDSelectors } from './namespaces';
import { areGroupsCompatible } from './groups';
import { checkIntersection } from './dom';
import { isEffectivelyDisabledDraggable } from './disabled';
import type { IDnDProviderInternal } from '../types/provider';

/**
 * Converts viewport coordinates to container-relative coordinates.
 * scroll - page scroll position (window.scrollX, window.scrollY)
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

/**
 * Returns CSS properties for bounded selection box within container
 */
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

/**
 * Checks if the event target is within the correct selectable area
 */
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
 * Updates selectedSet based on selection box (pointer start → current)
 */
export const updateSelectionByBox = (provider: IDnDProviderInternal): void => {
  if (!provider.pointer.value || !provider.entities.selectingArea) return;
  const { selectingArea } = provider.entities;
  const selectionBoxRect = getSelectionBoxRect(
    provider.pointer.value.start,
    provider.pointer.value.current
  );
  const selectionAreaGroups = provider.entities.selectableAreaMap.get(selectingArea)?.groups ?? [];

  provider.entities.visibleDraggableSet.forEach((el) => {
    if (!selectingArea.contains(el)) return;
    if (isEffectivelyDisabledDraggable(el, provider)) {
      provider.entities.selectedSet.delete(el);
      return;
    }
    const draggableEntity = provider.entities.draggableMap.get(el);
    const draggableGroups = draggableEntity?.groups ?? [];
    if (!areGroupsCompatible(selectionAreaGroups, draggableGroups)) {
      provider.entities.selectedSet.delete(el);
      return;
    }
    checkIntersection(selectionBoxRect, el.getBoundingClientRect())
      ? provider.entities.selectedSet.add(el)
      : provider.entities.selectedSet.delete(el);
  });
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
