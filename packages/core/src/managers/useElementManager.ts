import { computed, ref } from 'vue';

import type { IUseDragOptions } from '../types';
import { draggableDataName } from '../utils/namespaces';
import { preventEvent } from '../utils/events';
import { useDnDStore } from '../composables/useDnDStore';
import { useElementVisibility } from '@vueuse/core';

/**
 * Hook for managing draggable elements and their interactions.
 * Provides methods for registering, unregistering elements,
 * checking if an element is being dragged, and determining if it can be dropped.
 *
 * @param options - Optional configuration object for element management
 * @returns Object containing element management state and methods
 */
export const useElementManager = (options?: IUseDragOptions) => {
  const {
    elements,
    draggingElements,
    hovered,
    selectedElements,
    isDragging: isDragStarted,
  } = useDnDStore();

  /** Reference to the element being managed */
  const elementRef = ref<HTMLElement | null>(null);

  /** Whether the element is currently hovered over */
  const isOvered = computed<boolean>(
    () => hovered.element.value?.node === elementRef.value
  );

  const isVisible = useElementVisibility(elementRef);

  /** Whether the element is currently being dragged */
  const isDragging = computed<boolean>(() =>
    draggingElements.value.some((element) => element.node === elementRef.value)
  );

  /** Whether element can interact with current drop zone based on group matching */
  const isAllowed = computed<boolean>(() => {
    if (!elementRef.value) return false;
    if (!isDragStarted.value) return false;

    const currentElement = elements.value.find(
      (element) => element.node === elementRef.value
    );
    if (!currentElement?.groups.length) return true;

    return !draggingElements.value.some((element) => {
      if (!element.groups.length) return false;
      return !element.groups.some((group) =>
        currentElement.groups.includes(group)
      );
    });
  });

  /** Registers the element with the manager */
  const registerElement = () => {
    if (!elementRef.value) throw new Error('ElementRef is not set');

    elements.value.push({
      node: elementRef.value,
      groups: options?.groups ?? [],
      layer: options?.layer ?? null,
      defaultLayer: options?.layer ?? null,
      events: options?.events ?? {},
      data: options?.data ?? undefined,
      isVisible,
    });

    elementRef.value.addEventListener('dragstart', preventEvent);
    elementRef.value.addEventListener('drag', preventEvent);
    elementRef.value.setAttribute(draggableDataName, 'true');
    elementRef.value.setAttribute('draggable', 'false');
  };

  /** Unregister the element from the manager */
  const unregisterElement = () => {
    const index = elements.value.findIndex(
      (element) => element.node === elementRef.value
    );
    if (index !== -1) elements.value.splice(index, 1);

    const selectedIndex = selectedElements.value.findIndex(
      (element) => element.node === elementRef.value
    );
    if (selectedIndex !== -1) selectedElements.value.splice(selectedIndex, 1);

    elementRef.value?.removeEventListener('dragstart', preventEvent);
    elementRef.value?.removeEventListener('drag', preventEvent);
    elementRef.value?.removeAttribute(draggableDataName);
    elementRef.value?.removeAttribute('draggable');
  };

  return {
    elementRef,
    registerElement,
    unregisterElement,
    isDragging,
    isOvered,
    isAllowed,
    isVisible,
  };
};
