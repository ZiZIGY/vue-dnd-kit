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

  const elements = ref<IDragElement[]>([]);
  const selectedElements = ref<IDragElement[]>([]);
  const zones = ref<IDropZone[]>([]);

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

    return elements.value.filter((element) => {
      if (!element.node) return false;

      if (
        !isDescendant(
          element.node as HTMLElement,
          hovered.zone.value!.node as HTMLElement
        )
      ) {
        return false;
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
        return false;
      }
      if (element.groups.length) {
        const isCompatible = !draggingElements.value.some((draggingElement) => {
          if (!draggingElement.groups.length) return false;
          return !draggingElement.groups.some((group) =>
            element.groups.includes(group)
          );
        });
        return isCompatible;
      }

      return true;
    });
  });

  const { w, s, a, d, ctrl, shift, alt, meta } = useMagicKeys();

  return {
    isDragging,
    activeContainer,
    elements,
    draggingElements,
    selectedElements,
    zones,
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
