import type {
  IDragElement,
  IDraggingElement,
  IDropZone,
  IPoint,
} from '../types';
import { computed, ref, shallowRef, type Component } from 'vue';
import { createGlobalState, useMagicKeys } from '@vueuse/core';
import { isDescendant } from '../utils/dom';

export const useDnDStore = createGlobalState(() => {
  const draggingElements = ref<IDraggingElement[]>([]);
  const isDragging = computed<boolean>(() => draggingElements.value.length > 0);

  const activeContainer = {
    component: ref<Component | null>(null),
    ref: shallowRef<HTMLElement | null>(null),
  };

  const elementsMap = ref<Map<HTMLElement | Element, IDragElement>>(new Map());
  const selectedElementsMap = ref<Map<HTMLElement | Element, IDragElement>>(new Map());
  const zonesMap = ref<Map<HTMLElement | Element, IDropZone>>(new Map());

  const hovered = {
    zone: ref<IDropZone | null>(null),
    element: ref<IDragElement | null>(null),
  };

  const pointerPosition = {
    current: shallowRef<IPoint | null>(null),
    start: shallowRef<IPoint | null>(null),
    offset: {
      percent: shallowRef<IPoint | null>(null),
      pixel: shallowRef<IPoint | null>(null),
    },
  };

  const possibleElements = computed(() => {
    if (!hovered.zone.value || !hovered.zone.value.node) {
      return [];
    }

    const activeDragNodes = draggingElements.value.map(
      (element) => element.node
    );

    const result = [];
    for (const element of elementsMap.value.values()) {
      if (!element.node) continue;

      if (
        !isDescendant(
          element.node as HTMLElement,
          hovered.zone.value.node as HTMLElement
        )
      ) {
        continue;
      }

      if (
        activeDragNodes.some(
          (dragNode) =>
            dragNode &&
            (dragNode === element.node ||
              isDescendant(
                element.node as HTMLElement,
                dragNode as HTMLElement
              ))
        )
      ) {
        continue;
      }
      
      if (element.groups.length) {
        const isCompatible = !draggingElements.value.some((draggingElement) => {
          if (!draggingElement.groups.length) return false;
          return !draggingElement.groups.some((group) =>
            element.groups.includes(group)
          );
        });
        if (!isCompatible) continue;
      }

      result.push(element);
    }

    return result;
  });

  const { w, s, a, d, ctrl, shift, alt, meta } = useMagicKeys();

  return {
    isDragging,
    activeContainer,
    elementsMap,
    selectedElementsMap,
    zonesMap,
    draggingElements,
    hovered,
    pointerPosition,
    possibleElements,
    keyboard: {
      w,
      s,
      a,
      d,
      ctrl,
      shift,
      alt,
      meta,
    },
  };
});
