import type { CSSProperties } from 'vue';
import type { ICoordinates } from '../../external/types';
import { DnDSelectors } from './namespaces';
import { areGroupsCompatible } from './groups';
import { checkIntersection } from './dom';
import { isEffectivelyDisabledDraggable } from './disabled';
import type { IDnDProviderInternal } from '../types/provider';

/**
 * Returns the closest SelectionArea ANCESTOR of el (not including el itself).
 * Used to determine whether el "belongs" to a nested SelectionArea.
 */
function getClosestAncestorSelectionArea(el: HTMLElement): HTMLElement | null {
  return (el.parentElement?.closest(DnDSelectors.SELECT_AREA) as HTMLElement | null) ?? null;
}

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
 * Returns CSS properties for a bounded selection box within its container.
 *
 * Uses position: absolute (not fixed) so the rect is placed correctly even when
 * an ancestor element has a CSS transform / will-change / filter — any of those
 * break fixed positioning by creating a new containing block.
 *
 * Coordinates are converted from viewport-space (pointer positions) to
 * container-local space, accounting for the container's own scroll offset so it
 * also works inside scrollable containers.
 */
export const getBoundedSelectionArea = (
  start: ICoordinates,
  current: ICoordinates,
  container: HTMLElement | null
): CSSProperties => {
  if (!container) return {};

  const rect = container.getBoundingClientRect();

  // Clamp selection edges to the container's visible viewport region
  const vpLeft = Math.max(rect.left, Math.min(start.x, current.x));
  const vpTop = Math.max(rect.top, Math.min(start.y, current.y));
  const vpRight = Math.min(rect.right, Math.max(start.x, current.x));
  const vpBottom = Math.min(rect.bottom, Math.max(start.y, current.y));

  const width = Math.max(0, vpRight - vpLeft);
  const height = Math.max(0, vpBottom - vpTop);

  // Convert from viewport to container-local coordinates.
  // container.scrollLeft/Top handles the case where the container itself scrolls.
  const left = vpLeft - rect.left + container.scrollLeft;
  const top = vpTop - rect.top + container.scrollTop;

  return {
    position: 'absolute',
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    pointerEvents: 'none',
    border: '1px solid #3b82f6',
    backgroundColor: '#3b82f61a',
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
 * Updates selectedSet based on selection box (pointer start → current).
 * Uses rectCache to avoid getBoundingClientRect() on every pointer move.
 */
export const updateSelectionByBox = (provider: IDnDProviderInternal): void => {
  if (!provider.pointer.value || !provider.entities.selectingArea) return;
  const { selectingArea } = provider.entities;
  const selectionBoxRect = getSelectionBoxRect(
    provider.pointer.value.start,
    provider.pointer.value.current
  );
  const selectionAreaGroups =
    provider.entities.selectableAreaMap.get(selectingArea)?.groups ?? [];
  const cache = provider.lib.rectCache;

  provider.entities.visibleDraggableSet.forEach((el) => {
    // The selectingArea itself is never selectable from its own context.
    if (el === selectingArea) return;

    if (!selectingArea.contains(el)) return;

    // Skip elements inside a nested SelectionArea — they belong to that area's context,
    // not to the current selectingArea.
    const closestAncestorArea = getClosestAncestorSelectionArea(el);
    if (closestAncestorArea && closestAncestorArea !== selectingArea) {
      provider.entities.selectedSet.delete(el);
      return;
    }

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
    let rect = cache.get(el);
    if (!rect) {
      rect = el.getBoundingClientRect();
      cache.set(el, rect);
    }
    const inBase = provider.entities.selectionBase.has(el);
    const intersects = checkIntersection(selectionBoxRect, rect);

    // Toggle semantics: the new rect XORs against the previous selection.
    // Covering a previously-selected element deselects it; not covering it restores it.
    if (intersects) {
      if (inBase) {
        provider.entities.selectedSet.delete(el);
      } else {
        provider.entities.selectedSet.add(el);
      }
    } else {
      if (inBase) {
        provider.entities.selectedSet.add(el);
      } else {
        provider.entities.selectedSet.delete(el);
      }
    }
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
