import type {
  IDragElement,
  IDraggingElement,
  IDropZone,
  IPoint,
} from '../types';
import { computed, ref, type Component } from 'vue';
import { createGlobalState, useEventListener } from '@vueuse/core';

export const useDnDStore = createGlobalState(() => {
  const draggingElements = ref<IDraggingElement[]>([]);
  const isDragging = computed<boolean>(() => draggingElements.value.length > 0);

  const activeContainer = {
    component: ref<Component | null>(null),
    ref: ref<HTMLElement | null>(null),
  };

  const elements = ref<IDragElement[]>([]);
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

  useEventListener(window, 'keydown', (event) => {
    if (event.key === 'Escape') {
      selectedElements.value = [];
      draggingElements.value = [];
    }
  });

  return {
    isDragging,
    activeContainer,
    elements,
    draggingElements,
    selectedElements,
    zones,
    hovered,
    pointerPosition,
  };
});
