import type {
  IDragElement,
  IDraggingElement,
  IDropZone,
  IPoint,
} from '../types';
import { computed, ref, shallowRef, type Component, onUnmounted } from 'vue';
import { createGlobalState, useMagicKeys } from '@vueuse/core';

export const useDnDStore = createGlobalState(() => {
  const draggingElements = ref<IDraggingElement[]>([]);
  const isDragging = computed<boolean>(() => draggingElements.value.length > 0);

  const activeContainer = {
    component: ref<Component | null>(null),
    ref: shallowRef<HTMLElement | null>(null),
  };

  const elementsMap = ref<Map<HTMLElement | Element, IDragElement>>(new Map());
  const selectedElementsMap = ref<Map<HTMLElement | Element, IDragElement>>(
    new Map()
  );
  const zonesMap = ref<Map<HTMLElement | Element, IDropZone>>(new Map());
  const visibleZones = ref<Set<HTMLElement | Element>>(new Set());
  const visibleElements = ref<Set<HTMLElement | Element>>(new Set());

  // Создаем IntersectionObserver для отслеживания видимости элементов
  const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) =>
      visibleElements.value[entry.isIntersecting ? 'add' : 'delete'](
        entry.target
      )
    );
  });
  const zoneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) =>
      visibleZones.value[entry.isIntersecting ? 'add' : 'delete'](entry.target)
    );
  });

  const handleDragElementIntersection = (
    action: 'add' | 'remove',
    element: HTMLElement | Element
  ) => {
    if (action === 'add') {
      elementObserver.observe(element);
    } else {
      elementObserver.unobserve(element);
      visibleElements.value.delete(element);
    }
  };

  const handleDropZoneIntersection = (
    action: 'add' | 'remove',
    element: HTMLElement | Element
  ) => {
    if (action === 'add') {
      zoneObserver.observe(element);
    } else {
      zoneObserver.unobserve(element);
      visibleZones.value.delete(element);
    }
  };

  onUnmounted(() => {
    elementObserver.disconnect();
    zoneObserver.disconnect();
  });

  const pointerPosition = {
    start: shallowRef<IPoint | null>(null),
    current: shallowRef<IPoint | null>(null),
    offset: {
      percent: shallowRef<IPoint | null>(null),
      pixel: shallowRef<IPoint | null>(null),
    },
  };

  const { w, s, a, d, ctrl, shift, alt, meta } = useMagicKeys();

  const hovered = {
    zone: shallowRef<IDropZone | null>(null),
    element: shallowRef<IDragElement | null>(null),
  };

  return {
    draggingElements,
    isDragging,
    activeContainer,
    elementsMap,
    selectedElementsMap,
    zonesMap,
    visibleZones,
    visibleElements,
    pointerPosition,
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
    hovered,
    handleDragElementIntersection,
    handleDropZoneIntersection,
  };
});
