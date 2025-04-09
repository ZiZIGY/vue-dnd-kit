import type { IBoundingBox, IDraggingElement } from '../types';
import {
  checkCollision,
  getBoundingBox,
  getCenter,
  getDistance,
} from '../utils/geometry';

import type { Ref } from 'vue';
import { isDescendant } from '../utils/dom';
import { useDnDStore } from './useDnDStore';
import { usePointer } from './usePointer';
import { useThrottleFn } from '@vueuse/core';

export const useSensor = (elementRef: Ref<HTMLElement | null>) => {
  const store = useDnDStore();

  const { onPointerStart, onPointerMove, onPointerEnd } =
    usePointer(elementRef);

  let animationFrameId: number | null = null;

  const getDraggingElements = (
    draggableElement: HTMLElement | null
  ): IDraggingElement[] => {
    // Проверяем, содержится ли draggableElement в selectedElements
    const isDraggableInSelection = store.selectedElements.value.some(
      (element) => element.node === draggableElement
    );

    if (store.selectedElements.value.length && isDraggableInSelection) {
      return store.selectedElements.value.map((element) => ({
        ...element,
        initialHTML: element.node?.outerHTML ?? '',
        initialRect: element.node?.getBoundingClientRect(),
      }));
    }

    store.selectedElements.value = [];

    const element = store.elements.value.find(
      (element) => element.node === draggableElement
    );
    if (!element) return [];

    return [
      {
        ...element,
        initialHTML: element.node?.outerHTML ?? '',
        initialRect: element.node?.getBoundingClientRect(),
      },
    ];
  };

  const getOverlapPercent = (
    boxA: IBoundingBox,
    boxB: IBoundingBox
  ): number => {
    const xOverlap = Math.max(
      0,
      Math.min(boxA.x + boxA.width, boxB.x + boxB.width) -
        Math.max(boxA.x, boxB.x)
    );
    const yOverlap = Math.max(
      0,
      Math.min(boxA.y + boxA.height, boxB.y + boxB.height) -
        Math.max(boxA.y, boxB.y)
    );

    const overlapArea = xOverlap * yOverlap;
    
    const boxAArea = boxA.width * boxA.height;
    const boxBArea = boxB.width * boxB.height;

    // Возвращаем среднее значение процентов перекрытия относительно обоих элементов
    return (
      ((overlapArea / boxAArea) * 100 + (overlapArea / boxBArea) * 100) / 2
    );
  };

  // Создаем троттлированную функцию для обработки коллизий
  const processCollisions = useThrottleFn(() => {
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

    // Используем visibleElements для получения только видимых элементов
    const collidingElements = store.visibleElements.value
      .map((index) => store.elements.value[index])
      .filter((element) => {
        if (
          !element.node ||
          activeDragNodes.some(
            (dragNode) =>
              dragNode &&
              isDescendant(element.node as HTMLElement, dragNode as HTMLElement)
          )
        ) return false;

        if (element.groups.length) {
          const isCompatible = !store.draggingElements.value.some(
            (draggingElement) => {
              if (!draggingElement.groups.length) return false;
              return !draggingElement.groups.some((group) =>
                element.groups.includes(group)
              );
            }
          );
          if (!isCompatible) return false;
        }

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
            isDescendant(
              element.node as HTMLElement,
              parent.node as HTMLElement
            )
        ).length;

        return {
          element,
          isPointerInElement,
          overlapPercent,
          depth,
          centerDistance,
        };
      })
      .sort((a, b) => {
        if (!shouldUseNormalPriority) {
          if (a.isPointerInElement && b.isPointerInElement) return b.depth - a.depth;
          if (a.isPointerInElement !== b.isPointerInElement) return a.isPointerInElement ? -1 : 1;
        }
        // Если процент перекрытия примерно одинаковый
        if (Math.abs(a.overlapPercent - b.overlapPercent) <= 1) {
          // Используем расстояние между центрами
          return a.centerDistance - b.centerDistance;
        }

        return b.overlapPercent - a.overlapPercent;
      });

    const collidingZones = store.zones.value
      .filter((zone) => {
        if (
          !zone.node ||
          activeDragNodes.some(
            (dragNode) =>
              dragNode &&
              isDescendant(zone.node as HTMLElement, dragNode as HTMLElement)
          )
        ) return false;
        

        if (zone.groups.length) {
          const isCompatible = !store.draggingElements.value.some((element) => {
            if (!element.groups.length) return false;
            return !element.groups.some((group) => zone.groups.includes(group));
          });
          if (!isCompatible) return false;
        }

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
          isPointerInElement,
          overlapPercent,
          depth,
          centerDistance,
        };
      })
      .sort((a, b) => {
        if (!shouldUseNormalPriority) {
          if (a.isPointerInElement && b.isPointerInElement) return b.depth - a.depth;
          if (a.isPointerInElement !== b.isPointerInElement) return a.isPointerInElement ? -1 : 1;
        }
        if (Math.abs(a.overlapPercent - b.overlapPercent) <= 1) return a.centerDistance - b.centerDistance;
        return b.overlapPercent - a.overlapPercent;
      });

    
    const previousElement = store.hovered.element.value;
    const previousZone = store.hovered.zone.value;

    // Обновляем текущие значения
    store.hovered.element.value = collidingElements[0]?.element ?? null;
    store.hovered.zone.value = collidingZones[0]?.zone ?? null;

    // Проверяем изменения для элементов
    if (store.hovered.element.value !== previousElement) {
      if (previousElement?.events?.onLeave) previousElement.events.onLeave(store);
      if (store.hovered.element.value?.events?.onHover) store.hovered.element.value.events.onHover(store);
      
    }

    // Проверяем изменения для зон
    if (store.hovered.zone.value !== previousZone) {
      if (previousZone?.events?.onLeave) previousZone.events.onLeave(store);
      if (store.hovered.zone.value?.events?.onHover) store.hovered.zone.value.events.onHover(store);
      
    }
  }, 1000);

  // Функция для RAF, которая только запускает следующий кадр
  const animationLoop = () => {
    processCollisions();
    animationFrameId = requestAnimationFrame(animationLoop);
  };

  const startDetection = () => {
    animationLoop(); // Запускаем цикл анимации
  };

  const stopDetection = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  const activate = (event: PointerEvent) => {
    store.draggingElements.value = getDraggingElements(elementRef.value);
    onPointerStart(event);

    startDetection();
  };

  const track = (event: PointerEvent | WheelEvent) => {
    onPointerMove(event);
  };

  const deactivate = () => {
    onPointerEnd();

    if (store.hovered.zone.value) {
      store.hovered.zone.value.events.onDrop?.(store);
    } else {
      store.draggingElements.value.forEach((element) =>
        element.events.onEnd?.(store)
      );
    }

    store.draggingElements.value = [];
    store.selectedElements.value = [];

    store.hovered.zone.value = null;
    store.hovered.element.value = null;

    stopDetection();
  };

  return {
    activate,
    track,
    deactivate,
  };
};
