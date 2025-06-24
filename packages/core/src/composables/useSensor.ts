import type {
  ICollisionDetectionResult,
  IDraggingElement,
  IUseDragOptions,
} from '../types';

import type { Ref } from 'vue';
import { createPayload } from '../utils/events';
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

  const validateCollisionResults = (
    htmlElements: HTMLElement | HTMLElement[] | Element | Element[] | null
  ) => {
    if (!htmlElements) {
      return { element: null, zone: null };
    }

    const elements = Array.isArray(htmlElements)
      ? htmlElements
      : [htmlElements];
    const activeDragNodes = Array.from(store.draggingElements.value.keys());

    const disabledZones = Array.from(store.zonesMap.value.entries()).flatMap(
      ([element, zone]) => (zone.disabled ? [element] : [])
    );

    const disabledElements = Array.from(
      store.elementsMap.value.entries()
    ).flatMap(([element, data]) => (data.disabled ? [element] : []));

    const filteredZoneElement = elements.find((htmlElement) => {
      if (!store.visibleZones.value.has(htmlElement)) return false;

      const zone = store.zonesMap.value.get(htmlElement);
      if (!zone) return false;

      if (zone.disabled) return false;

      const isInsideDisabledZone = disabledZones.some(
        (disabledZone) =>
          htmlElement === disabledZone ||
          isDescendant(htmlElement as HTMLElement, disabledZone as HTMLElement)
      );

      if (isInsideDisabledZone) return false;

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

    const filteredElements = elements.filter((htmlElement) => {
      if (!store.visibleElements.value.has(htmlElement)) return false;
      if (!store.elementsMap.value.has(htmlElement)) return false;

      const element = store.elementsMap.value.get(htmlElement);
      if (element?.disabled) return false;

      const isInsideDisabledZone = disabledZones.some(
        (disabledZone) =>
          htmlElement === disabledZone ||
          isDescendant(htmlElement as HTMLElement, disabledZone as HTMLElement)
      );

      const isInsideDisabledElement = disabledElements.some(
        (disabledElement) =>
          htmlElement === disabledElement ||
          isDescendant(
            htmlElement as HTMLElement,
            disabledElement as HTMLElement
          )
      );

      if (isInsideDisabledZone || isInsideDisabledElement) return false;

      const isGroupsCompatible = !Array.from(
        store.draggingElements.value.values()
      ).some((element) => {
        if (!element.groups.length) return false;
        return !element.groups.some((group) =>
          store.elementsMap.value.get(htmlElement)?.groups.includes(group)
        );
      });

      return isGroupsCompatible;
    });

    const possibleElement = filteredElements.find((htmlElement) => {
      const isCompatible = !activeDragNodes.some(
        (dragNode) =>
          dragNode &&
          (dragNode === htmlElement ||
            isDescendant(htmlElement as HTMLElement, dragNode as HTMLElement) ||
            isDescendant(dragNode as HTMLElement, htmlElement as HTMLElement))
      );

      if (!isCompatible) return false;

      return (
        htmlElement === filteredZoneElement ||
        isDescendant(
          htmlElement as HTMLElement,
          filteredZoneElement as HTMLElement
        )
      );
    });

    return {
      element: possibleElement || null,
      zone: filteredZoneElement,
    };
  };

  const detectCollisions = options?.sensor?.setup || defaultCollisionDetection;

  const processCollisionResults = (results: ICollisionDetectionResult) => {
    const previousElement = store.hovered.element.value;
    const previousZone = store.hovered.zone.value;

    let newElement = results.element;
    let newZone = results.zone;

    store.hovered.element.value = newElement;
    store.hovered.zone.value = newZone;

    if (previousElement !== newElement) {
      if (previousElement) {
        store.elementsMap.value
          .get(previousElement)
          ?.events?.onLeave?.(store, createPayload(store));
      }

      if (newElement) {
        store.elementsMap.value
          .get(newElement)
          ?.events?.onHover?.(store, createPayload(store));
      }
    }

    if (previousZone !== newZone) {
      if (previousZone) {
        store.zonesMap.value
          .get(previousZone)
          ?.events?.onLeave?.(store, createPayload(store));
      }

      if (newZone) {
        store.zonesMap.value
          .get(newZone)
          ?.events?.onHover?.(store, createPayload(store));
      }
    }
  };

  const throttledDetectAndProcess = useThrottleFn(() => {
    const htmlElements = detectCollisions(store);
    const processedResults = validateCollisionResults(htmlElements);
    processCollisionResults(processedResults);
  }, options?.sensor?.throttle ?? 0);

  const animationLoop = () => {
    throttledDetectAndProcess();

    animationFrameId = requestAnimationFrame(animationLoop);
  };

  const startDetection = () => animationLoop();

  const stopDetection = () => {
    if (animationFrameId !== null) {
      onPointerEnd();
      onKeyboardEnd();
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  const activate = (event: PointerEvent | KeyboardEvent) => {
    store.draggingElements.value = getDraggingElements(elementRef.value);
    store.draggingElements.value.forEach((element) =>
      element.events.onStart?.(store, createPayload(store))
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
      element.events.onMove?.(store, createPayload(store))
    );

    if (event instanceof KeyboardEvent) {
      onKeyboardMove();
    } else {
      onPointerMove(event);
    }
  };

  const deactivate = async (triggerEvents = true) => {
    if (store.hovered.zone.value) {
      const zone = store.zonesMap.value.get(store.hovered.zone.value);
      const result = zone?.events.onDrop?.(store, createPayload(store));

      if (result instanceof Promise) {
        try {
          store.isPending.value = true;

          const promiseResult = await result;

          if (promiseResult) {
            if (triggerEvents) store.selectedElements.value.clear();

            store.draggingElements.value.clear();

            store.hovered.zone.value = null;
            store.hovered.element.value = null;

            stopDetection();
          }

          return promiseResult;
        } catch {
          return false;
        } finally {
          store.isPending.value = false;
        }
      } else {
        if (triggerEvents) store.selectedElements.value.clear();

        store.draggingElements.value.clear();

        store.hovered.zone.value = null;
        store.hovered.element.value = null;

        stopDetection();
      }
    } else {
      store.draggingElements.value.forEach((element) =>
        element.events.onEnd?.(store, createPayload(store))
      );

      if (triggerEvents) store.selectedElements.value.clear();

      store.draggingElements.value.clear();

      store.hovered.zone.value = null;
      store.hovered.element.value = null;

      stopDetection();
    }
  };

  return {
    activate,
    track,
    deactivate,
  };
};
