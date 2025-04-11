import type {
  IDragElement,
  IDraggingElement,
  IDropZone,
  IPoint,
} from '../types';
import { computed, ref, shallowRef, type Component } from 'vue';
import { createGlobalState } from '@vueuse/core';

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

  const keyboard = {
    w: shallowRef(false),
    s: shallowRef(false),
    a: shallowRef(false),
    d: shallowRef(false),
  };

  return {
    isDragging,
    activeContainer,
    elements,
    draggingElements,
    selectedElements,
    zones,
    hovered,
    pointerPosition,
    keyboard,
  };
});
