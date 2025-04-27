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
  ): Map<HTMLElement | Element, IDraggingElement> => {
    if (!draggableElement) return new Map();

    const isDraggableInSelection =
      store.selectedElements.value.has(draggableElement);

    if (store.selectedElements.value.size > 0 && isDraggableInSelection) {
      const result = new Map<HTMLElement | Element, IDraggingElement>();

      store.selectedElements.value.forEach((node) => {
        const element = store.elementsMap.value.get(node);
        if (!element) return;

        result.set(node, {
          ...element,
          initialHTML: element.node?.outerHTML ?? '',
          initialRect: element.node?.getBoundingClientRect(),
        });
      });

      return result;
    }

    store.selectedElements.value.clear();

    const element = store.elementsMap.value.get(draggableElement);
    if (!element) return new Map();

    const result = new Map<HTMLElement | Element, IDraggingElement>();
    result.set(draggableElement, {
      ...element,
      initialHTML: element.node?.outerHTML ?? '',
      initialRect: element.node?.getBoundingClientRect(),
    });

    return result;
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

    const activeDragNodes = Array.from(store.draggingElements.value.keys());

    const filteredZoneElement = elements.find((htmlElement) => {
      if (!store.visibleZones.value.has(htmlElement)) return false;

      const zone = store.zonesMap.value.get(htmlElement);
      if (!zone) return false;

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
        const isCompatible = !Array.from(
          store.draggingElements.value.values()
        ).some((element) => {
          if (!element.groups.length) return false;
          return !element.groups.some((group) => zone.groups.includes(group));
        });
        if (!isCompatible) return false;
      }

      return true;
    });

    if (!filteredZoneElement) {
      return { element: null, zone: null };
    }

    const possibleElement = elements.find(
      (htmlElement) =>
        store.visibleElements.value.has(htmlElement) &&
        store.elementsMap.value.has(htmlElement) &&
        !activeDragNodes.some(
          (dragNode) =>
            dragNode &&
            (dragNode === htmlElement ||
              isDescendant(
                htmlElement as HTMLElement,
                dragNode as HTMLElement
              ) ||
              isDescendant(dragNode as HTMLElement, htmlElement as HTMLElement))
        ) &&
        (htmlElement === filteredZoneElement ||
          isDescendant(
            htmlElement as HTMLElement,
            filteredZoneElement as HTMLElement
          ))
    );

    return {
      element: possibleElement || null,
      zone: filteredZoneElement,
    };
  };

  const detectCollisions = options?.sensor?.setup || defaultCollisionDetection;

  const processCollisionResults = (results: ICollisionDetectionResult) => {
    const previousElement = store.hovered.element.value;
    const previousZone = store.hovered.zone.value;

    store.hovered.element.value = results.element;
    store.hovered.zone.value = results.zone;

    if (previousElement) {
      if (store.hovered.element.value !== previousElement) {
        store.elementsMap.value.get(previousElement)?.events?.onLeave?.(store);

        if (store.hovered.element.value)
          store.elementsMap.value
            .get(store.hovered.element.value)
            ?.events?.onHover?.(store);
      }
    }

    if (previousZone) {
      if (store.hovered.zone.value !== previousZone) {
        store.zonesMap.value.get(previousZone)?.events?.onLeave?.(store);

        if (store.hovered.zone.value)
          store.zonesMap.value
            .get(store.hovered.zone.value)
            ?.events?.onHover?.(store);
      }
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
    store.draggingElements.value.forEach((element) =>
      element.events.onStart?.(store)
    );

    if (event instanceof PointerEvent) {
      onPointerStart(event);
    } else {
      onKeyboardStart(event);
    }

    startDetection();
  };

  const track = (event: PointerEvent | WheelEvent | KeyboardEvent) => {
    store.draggingElements.value.forEach((element) =>
      element.events.onMove?.(store)
    );

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
      if (store.hovered.zone.value) {
        const zone = store.zonesMap.value.get(store.hovered.zone.value);
        zone?.events.onDrop?.(store);
      } else {
        store.draggingElements.value.forEach((element) =>
          element.events.onEnd?.(store)
        );
      }

      store.selectedElements.value.clear();
    }
    store.draggingElements.value.clear();

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
