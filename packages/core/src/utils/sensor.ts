import {
  checkCollision,
  getBoundingBox,
  getCenter,
  getDistance,
  getOverlapPercent,
} from './geometry';

import { IDnDStore } from '../types';
import { isDescendant } from './dom';

export const defaultCollisionDetection = (store: IDnDStore): HTMLElement[] => {
  const containerRect = getBoundingBox(store.activeContainer.ref.value);
  const containerCenter = getCenter(containerRect);
  const pointerX = store.pointerPosition.current.value?.x ?? 0;
  const pointerY = store.pointerPosition.current.value?.y ?? 0;

  const isPointerInActiveContainer =
    containerRect &&
    pointerX >= containerRect.x &&
    pointerX <= containerRect.x + containerRect.width &&
    pointerY >= containerRect.y &&
    pointerY <= containerRect.y + containerRect.height;

  const shouldUseNormalPriority = !isPointerInActiveContainer;

  const activeDragNodes = store.draggingElements.value.map((el) => el.node);

  const allCollidingElements = store.elements.value
    .filter((element) => {
      if (
        !element.node ||
        activeDragNodes.some(
          (dragNode) =>
            dragNode &&
            isDescendant(element.node as HTMLElement, dragNode as HTMLElement)
        )
      )
        return false;

      const rect = getBoundingBox(element.node as HTMLElement);
      return rect && containerRect && checkCollision(rect, containerRect);
    })
    .map((element) => {
      const rect = getBoundingBox(element.node as HTMLElement);
      const elementCenter = getCenter(rect);

      const isPointerInElement =
        pointerX >= rect.x &&
        pointerX <= rect.x + rect.width &&
        pointerY >= rect.y &&
        pointerY <= rect.y + rect.height;

      const overlapPercent = getOverlapPercent(rect, containerRect);
      const centerDistance = getDistance(containerCenter, elementCenter);

      const depth = store.elements.value.filter(
        (parent) =>
          parent !== element &&
          parent.node &&
          element.node &&
          isDescendant(element.node as HTMLElement, parent.node as HTMLElement)
      ).length;

      return {
        element,
        node: element.node as HTMLElement,
        isPointerInElement,
        overlapPercent,
        depth,
        centerDistance,
      };
    })
    .sort((a, b) => {
      if (!shouldUseNormalPriority) {
        if (a.isPointerInElement && b.isPointerInElement)
          return b.depth - a.depth;
        if (a.isPointerInElement !== b.isPointerInElement)
          return a.isPointerInElement ? -1 : 1;
      }
      if (Math.abs(a.overlapPercent - b.overlapPercent) <= 1)
        return a.centerDistance - b.centerDistance;
      return b.overlapPercent - a.overlapPercent;
    });

  const allCollidingZones = store.zones.value
    .filter((zone) => {
      if (
        !zone.node ||
        activeDragNodes.some(
          (dragNode) =>
            dragNode &&
            isDescendant(zone.node as HTMLElement, dragNode as HTMLElement)
        )
      )
        return false;

      const rect = getBoundingBox(zone.node as HTMLElement);

      return rect && containerRect && checkCollision(rect, containerRect);
    })
    .map((zone) => {
      const rect = getBoundingBox(zone.node as HTMLElement);
      const zoneCenter = getCenter(rect);

      const isPointerInElement =
        pointerX >= rect.x &&
        pointerX <= rect.x + rect.width &&
        pointerY >= rect.y &&
        pointerY <= rect.y + rect.height;

      const overlapPercent = getOverlapPercent(rect, containerRect);
      const centerDistance = getDistance(containerCenter, zoneCenter);

      const depth = store.zones.value.filter(
        (parent) =>
          parent !== zone &&
          parent.node &&
          zone.node &&
          isDescendant(zone.node as HTMLElement, parent.node as HTMLElement)
      ).length;

      return {
        zone,
        node: zone.node as HTMLElement,
        isPointerInElement,
        overlapPercent,
        depth,
        centerDistance,
      };
    })
    .sort((a, b) => {
      if (!shouldUseNormalPriority) {
        if (a.isPointerInElement && b.isPointerInElement)
          return b.depth - a.depth;
        if (a.isPointerInElement !== b.isPointerInElement)
          return a.isPointerInElement ? -1 : 1;
      }
      if (Math.abs(a.overlapPercent - b.overlapPercent) <= 1)
        return a.centerDistance - b.centerDistance;
      return b.overlapPercent - a.overlapPercent;
    });

  // Возвращаем все найденные HTML-элементы
  return [
    ...allCollidingElements.map((item) => item.node),
    ...allCollidingZones.map((item) => item.node),
  ];
};
