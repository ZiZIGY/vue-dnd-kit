import {
  checkCollision,
  getBoundingBox,
  getCenter,
  getDistance,
  getOverlapPercent,
} from './geometry';

import { IDnDStore } from '../types';
import { isDescendant } from './dom';

export const defaultCollisionDetection = (store: IDnDStore) => {
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

  // Работаем только с видимыми элементами
  const allCollidingElements = Array.from(store.visibleElements.value)
    .filter((node) => {
      if (!node || !store.elementsMap.value.has(node)) return false;

      const rect = getBoundingBox(node as HTMLElement);
      return rect && containerRect && checkCollision(rect, containerRect);
    })
    .map((node) => {
      const element = store.elementsMap.value.get(node);
      const rect = getBoundingBox(node as HTMLElement);
      const elementCenter = getCenter(rect);

      const isPointerInElement =
        pointerX >= rect.x &&
        pointerX <= rect.x + rect.width &&
        pointerY >= rect.y &&
        pointerY <= rect.y + rect.height;

      const overlapPercent = getOverlapPercent(rect, containerRect);
      const centerDistance = getDistance(containerCenter, elementCenter);

      // Вычисляем глубину вложенности
      let depth = 0;
      for (const parentNode of store.visibleElements.value) {
        if (
          parentNode !== node &&
          parentNode &&
          node &&
          isDescendant(node as HTMLElement, parentNode as HTMLElement)
        ) {
          depth++;
        }
      }

      return {
        element,
        node: node as HTMLElement,
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

  // Работаем только с видимыми зонами
  const allCollidingZones = Array.from(store.visibleZones.value)
    .filter((node) => {
      if (
        !node ||
        !store.zonesMap.value.has(node) ||
        activeDragNodes.some(
          (dragNode) =>
            dragNode &&
            isDescendant(node as HTMLElement, dragNode as HTMLElement)
        )
      )
        return false;

      const rect = getBoundingBox(node as HTMLElement);
      return rect && containerRect && checkCollision(rect, containerRect);
    })
    .map((node) => {
      const zone = store.zonesMap.value.get(node);
      const rect = getBoundingBox(node as HTMLElement);
      const zoneCenter = getCenter(rect);

      const isPointerInElement =
        pointerX >= rect.x &&
        pointerX <= rect.x + rect.width &&
        pointerY >= rect.y &&
        pointerY <= rect.y + rect.height;

      const overlapPercent = getOverlapPercent(rect, containerRect);
      const centerDistance = getDistance(containerCenter, zoneCenter);

      // Вычисляем глубину вложенности
      let depth = 0;
      for (const parentNode of store.visibleZones.value) {
        if (
          parentNode !== node &&
          parentNode &&
          node &&
          isDescendant(node as HTMLElement, parentNode as HTMLElement)
        ) {
          depth++;
        }
      }

      return {
        zone,
        node: node as HTMLElement,
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
