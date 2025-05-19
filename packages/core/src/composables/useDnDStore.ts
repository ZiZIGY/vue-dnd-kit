import type {
  IDragElement,
  IDraggingElement,
  IDropZone,
  IPoint,
} from '../types';
import {
  computed,
  ref,
  shallowRef,
  type Component,
  type TransitionProps,
} from 'vue';
import { createGlobalState, useMagicKeys } from '@vueuse/core';

export const useDnDStore = createGlobalState(() => {
  const isPending = shallowRef<boolean>(false);
  const draggingElements = ref<Map<HTMLElement | Element, IDraggingElement>>(
    new Map()
  );
  const isDragging = computed<boolean>(() => draggingElements.value.size > 0);

  const activeContainer = {
    component: ref<Component | null>(null),
    ref: shallowRef<HTMLElement | null>(null),
    options: shallowRef<TransitionProps | null>(null),
    animating: {
      enter: shallowRef<boolean>(false),
      leave: shallowRef<boolean>(false),
      appear: shallowRef<boolean>(false),
    },
  };

  const elementsMap = ref<Map<HTMLElement | Element, IDragElement>>(new Map());
  const selectedElements = ref<Set<HTMLElement | Element>>(new Set());
  const zonesMap = ref<Map<HTMLElement | Element, IDropZone>>(new Map());
  const visibleZones = shallowRef<Set<HTMLElement | Element>>(new Set());
  const visibleElements = shallowRef<Set<HTMLElement | Element>>(new Set());

  const hasIntersectionObserver =
    typeof window !== 'undefined' && 'IntersectionObserver' in window;

  const elementObserver = hasIntersectionObserver
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) =>
          visibleElements.value[entry.isIntersecting ? 'add' : 'delete'](
            entry.target
          )
        );
      })
    : null;

  const zoneObserver = hasIntersectionObserver
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) =>
          visibleZones.value[entry.isIntersecting ? 'add' : 'delete'](
            entry.target
          )
        );
      })
    : null;

  const handleDragElementIntersection = (
    action: 'add' | 'remove',
    element: HTMLElement | Element
  ) => {
    if (!elementObserver) return;

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
    if (!zoneObserver) return;

    if (action === 'add') {
      zoneObserver.observe(element);
    } else {
      zoneObserver.unobserve(element);
      visibleZones.value.delete(element);
    }
  };

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
    zone: shallowRef<HTMLElement | Element | null>(null),
    element: shallowRef<HTMLElement | Element | null>(null),
  };

  return {
    draggingElements,
    isDragging,
    activeContainer,
    elementsMap,
    selectedElements,
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
    isPending,
    handleDragElementIntersection,
    handleDropZoneIntersection,
  };
});
