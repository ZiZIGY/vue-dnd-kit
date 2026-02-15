/**
 * Hover utilities: distance from pointer to element center
 */

/** Distance from pointer to element center */
export const getDistanceFromPointerToElement = (
  pointer: { x: number; y: number },
  element: HTMLElement
): number => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return Math.hypot(pointer.x - centerX, pointer.y - centerY);
};

/** Pick closest to pointer among zone and element (by distance to center). Returns { zone?, element? } */
export const pickClosestToPointer = (
  pointer: { x: number; y: number },
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
