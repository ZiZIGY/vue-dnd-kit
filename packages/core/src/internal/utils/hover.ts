/**
 * Hover utilities: distance from pointer to element center
 */

import type { ICoordinates } from '../../external';

/** Distance from pointer to element center */
export const getDistanceFromPointerToElement = (
  pointer: ICoordinates,
  element: HTMLElement
): number => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return Math.hypot(pointer.x - centerX, pointer.y - centerY);
};

/**
 * Get element center coordinates from DOMRect
 * Utility for inline calculations without getBoundingClientRect call
 */
export const getCenterFromRect = (rect: DOMRect): ICoordinates => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

/** Calculate distance between pointer and rect center */
export const getDistanceToRectCenter = (
  pointer: ICoordinates,
  rect: DOMRect
) => {
  const center = getCenterFromRect(rect);
  return Math.hypot(pointer.x - center.x, pointer.y - center.y);
};

/** Pick closest to pointer among zone and element (by distance to center). Returns { zone?, element? } */
export const pickClosestToPointer = (
  pointer: ICoordinates,
  zone: HTMLElement | undefined,
  element: HTMLElement | undefined
): { zone?: HTMLElement; element?: HTMLElement } => {
  if (!zone && !element) return {};
  if (!zone) return { element };
  if (!element) return { zone };
  if (zone === element) return { zone, element };

  const zoneDistance = getDistanceFromPointerToElement(pointer, zone);
  const elementDistance = getDistanceFromPointerToElement(pointer, element);

  return elementDistance < zoneDistance ? { element } : { zone };
};
