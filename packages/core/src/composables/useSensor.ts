import type {
  ICollisionDetectionResult,
  IDragElement,
  IDraggingElement,
  IDropZone,
  IUseSensorOptions,
} from '../types';

import type { Ref } from 'vue';
import { defaultCollisionDetection } from '../utils/sensor';
import { isDescendant } from '../utils/dom';
import { useDnDStore } from './useDnDStore';
import { usePointer } from './usePointer';
import { useThrottleFn } from '@vueuse/core';

export const useSensor = (
  elementRef: Ref<HTMLElement | null>,
  options?: IUseSensorOptions
) => {
  const store = useDnDStore();

  const { onPointerStart, onPointerMove, onPointerEnd } =
    usePointer(elementRef);

  let animationFrameId: number | null = null;

  const getDraggingElements = (
    draggableElement: HTMLElement | null
  ): IDraggingElement[] => {
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

  const processUserCollisionResults = (
    htmlElements: HTMLElement | HTMLElement[] | null
  ) => {
    if (!htmlElements) {
      return { element: null, zone: null };
    }

    const elements = Array.isArray(htmlElements)
      ? htmlElements
      : [htmlElements];
    const activeDragNodes = store.draggingElements.value.map((el) => el.node);

    let bestElement: IDragElement | null = null;
    for (const htmlElement of elements) {
      const element = store.elements.value.find((e) => e.node === htmlElement);
      if (!element) continue;

      if (
        activeDragNodes.some(
          (dragNode) =>
            dragNode && isDescendant(htmlElement, dragNode as HTMLElement)
        )
      )
        continue;

      if (element.groups.length) {
        const isCompatible = !store.draggingElements.value.some(
          (draggingElement) => {
            if (!draggingElement.groups.length) return false;
            return !draggingElement.groups.some((group) =>
              element.groups.includes(group)
            );
          }
        );
        if (!isCompatible) continue;
      }

      bestElement = element;
      break;
    }

    let bestZone: IDropZone | null = null;
    for (const htmlElement of elements) {
      const zone = store.zones.value.find((z) => z.node === htmlElement);
      if (!zone) continue;

      if (
        activeDragNodes.some(
          (dragNode) =>
            dragNode && isDescendant(htmlElement, dragNode as HTMLElement)
        )
      )
        continue;

      if (zone.groups.length) {
        const isCompatible = !store.draggingElements.value.some((element) => {
          if (!element.groups.length) return false;
          return !element.groups.some((group) => zone.groups.includes(group));
        });
        if (!isCompatible) continue;
      }

      bestZone = zone;
      break;
    }

    return {
      element: bestElement,
      zone: bestZone,
    };
  };

  const detectCollisions = options?.sensor || defaultCollisionDetection;

  // Функция для обработки результатов определения коллизий
  const processCollisionResults = (results: ICollisionDetectionResult) => {
    const previousElement = store.hovered.element.value;
    const previousZone = store.hovered.zone.value;

    store.hovered.element.value = results.element;
    store.hovered.zone.value = results.zone;

    if (store.hovered.element.value !== previousElement) {
      if (previousElement?.events?.onLeave)
        previousElement.events.onLeave(store);
      if (store.hovered.element.value?.events?.onHover)
        store.hovered.element.value.events.onHover(store);
    }

    // Проверяем изменения для зон
    if (store.hovered.zone.value !== previousZone) {
      if (previousZone?.events?.onLeave) previousZone.events.onLeave(store);
      if (store.hovered.zone.value?.events?.onHover)
        store.hovered.zone.value.events.onHover(store);
    }
  };

  // Создаем троттлированную версию функции
  const throttledDetectAndProcess = useThrottleFn(() => {
    const htmlElements = detectCollisions(store);
    const processedResults = processUserCollisionResults(htmlElements);
    processCollisionResults(processedResults);
  }, options?.throttle ?? 0);

  // Функция для RAF, которая только запускает следующий кадр
  const animationLoop = () => {
    throttledDetectAndProcess();
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
