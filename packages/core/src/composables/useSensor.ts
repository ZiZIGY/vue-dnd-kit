import type {
  ICollisionDetectionResult,
  IDraggingElement,
  IUseDragOptions,
} from '../types';

import type { Ref } from 'vue';
import { defaultCollisionDetection } from '../utils/sensor';
import { isDescendant } from '../utils/dom';
import { useDnDStore } from './useDnDStore';
import { useKeyboard } from './useKeyboard';
import { usePointer } from './usePointer';
import { useThrottleFn } from '@vueuse/core';

export const useSensor = (
  elementRef: Ref<HTMLElement | null>,
  options?: IUseDragOptions
) => {
  const store = useDnDStore();

  const { onPointerStart, onPointerMove, onPointerEnd } =
    usePointer(elementRef);

  const { onKeyboardStart, onKeyboardMove, onKeyboardEnd } = useKeyboard(
    elementRef,
    options?.keyboard
  );

  let animationFrameId: number | null = null;

  const getDraggingElements = (
    draggableElement: HTMLElement | null
  ): IDraggingElement[] => {
    if (!draggableElement) return [];

    const isDraggableInSelection =
      store.selectedElementsMap.value.has(draggableElement);

    if (store.selectedElementsMap.value.size > 0 && isDraggableInSelection) {
      return Array.from(store.selectedElementsMap.value.values()).map(
        (element) => ({
          ...element,
          initialHTML: element.node?.outerHTML ?? '',
          initialRect: element.node?.getBoundingClientRect(),
        })
      );
    }

    store.selectedElementsMap.value.clear();

    const element = store.elementsMap.value.get(draggableElement);
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
    htmlElements: HTMLElement | HTMLElement[] | Element | Element[] | null
  ) => {
    if (!htmlElements) {
      return { element: null, zone: null };
    }

    const elements = Array.isArray(htmlElements)
      ? htmlElements
      : [htmlElements];

    const filteredZones = elements
      .filter((htmlElement) => store.visibleZones.value.has(htmlElement))
      .map((htmlElement) => store.zonesMap.value.get(htmlElement))
      .filter((zone) => {
        if (!zone) return false;

        const activeDragNodes = store.draggingElements.value.map(
          (element) => element.node
        );

        if (
          activeDragNodes.some(
            (dragNode) =>
              dragNode &&
              (dragNode === zone.node ||
                isDescendant(zone.node as HTMLElement, dragNode as HTMLElement))
          )
        )
          return false;

        if (zone.groups.length) {
          const isCompatible = !store.draggingElements.value.some((element) => {
            if (!element.groups.length) return false;
            return !element.groups.some((group) => zone.groups.includes(group));
          });
          if (!isCompatible) return false;
        }

        return true;
      });

    if (filteredZones.length === 0) {
      return { element: null, zone: null };
    }

    const currentZone = filteredZones[0];

    store.hovered.zone.value = currentZone ?? null;

    const possibleElement = elements.find((htmlElement) =>
      store.visibleElements.value.has(htmlElement)
    );

    const matchedElement = possibleElement
      ? store.possibleElements.value.find(
          (element) => element.node === possibleElement
        )
      : null;

    return {
      element: matchedElement ?? null,
      zone: currentZone ?? null,
    };
  };

  const detectCollisions = options?.sensor?.setup || defaultCollisionDetection;

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

    if (store.hovered.zone.value !== previousZone) {
      if (previousZone?.events?.onLeave) previousZone.events.onLeave(store);
      if (store.hovered.zone.value?.events?.onHover)
        store.hovered.zone.value.events.onHover(store);
    }
  };

  const throttledDetectAndProcess = useThrottleFn(() => {
    const htmlElements = detectCollisions(store);
    const processedResults = processUserCollisionResults(htmlElements);
    processCollisionResults(processedResults);
  }, options?.sensor?.throttle ?? 0);

  const animationLoop = () => {
    throttledDetectAndProcess();

    animationFrameId = requestAnimationFrame(animationLoop);
  };

  const startDetection = () => animationLoop();

  const stopDetection = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  const activate = (event: PointerEvent | KeyboardEvent) => {
    store.draggingElements.value = getDraggingElements(elementRef.value);

    if (event instanceof PointerEvent) {
      onPointerStart(event);
    } else {
      onKeyboardStart(event);
    }

    startDetection();
  };

  const track = (event: PointerEvent | WheelEvent | KeyboardEvent) => {
    if (event instanceof KeyboardEvent) {
      onKeyboardMove();
    } else {
      onPointerMove(event);
    }
  };

  const deactivate = (triggerEvents = true) => {
    onPointerEnd();
    onKeyboardEnd();

    if (triggerEvents) {
      if (store.hovered.zone.value)
        store.hovered.zone.value.events.onDrop?.(store);
      else
        store.draggingElements.value.forEach((element) =>
          element.events.onEnd?.(store)
        );

      store.selectedElementsMap.value.clear();
    }
    store.draggingElements.value = [];

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
