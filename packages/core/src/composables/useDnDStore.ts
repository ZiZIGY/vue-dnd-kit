import type {
  IDragElement,
  IDraggingElement,
  IDropZone,
  IPoint,
} from '../types';
import { computed, ref, type Component } from 'vue';
import { createGlobalState } from '@vueuse/core';

export const useDnDStore = createGlobalState(() => {
  const draggingElements = ref<IDraggingElement[]>([]);
  const isDragging = computed<boolean>(() => draggingElements.value.length > 0);

  const activeContainer = {
    component: ref<Component | null>(null),
    ref: ref<HTMLElement | null>(null),
  };

  const elements = ref<IDragElement[]>([]);
  const visibleElements = computed<number[]>(() =>
    elements.value
      .map((element, index) => {
        if (element.isVisible?.value || (element.isVisible && index))
          return index;
      })
      .filter((index) => index !== undefined)
  );
  const selectedElements = ref<IDragElement[]>([]);
  const zones = ref<IDropZone[]>([]);

  const hovered = {
    zone: ref<IDropZone | null>(null),
    element: ref<IDragElement | null>(null),
  };
  const pointerPosition = {
    current: ref<IPoint | null>(null),
    start: ref<IPoint | null>(null),
    offset: {
      percent: ref<IPoint | null>(null),
      pixel: ref<IPoint | null>(null),
    },
  };

  return {
    isDragging,
    activeContainer,
    elements,
    draggingElements,
    selectedElements,
    zones,
    visibleElements,
    hovered,
    pointerPosition,
  };
});
