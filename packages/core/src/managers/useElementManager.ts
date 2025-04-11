import { computed, ref } from 'vue';

import type { IUseDragOptions } from '../types';
import { draggableDataName } from '../utils/namespaces';
import { preventEvent } from '../utils/events';
import { useDnDStore } from '../composables/useDnDStore';

export const useElementManager = (options?: IUseDragOptions) => {
  const {
    elements,
    draggingElements,
    hovered,
    selectedElements,
    isDragging: isDragStarted,
  } = useDnDStore();

  const elementRef = ref<HTMLElement | null>(null);
  const isOvered = computed<boolean>(
    () => hovered.element.value?.node === elementRef.value
  );

  const isDragging = computed<boolean>(() =>
    draggingElements.value.some((element) => element.node === elementRef.value)
  );
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

  const registerElement = () => {
    if (!elementRef.value) throw new Error('ElementRef is not set');

    elements.value.push({
      node: elementRef.value,
      groups: options?.groups ?? [],
      layer: options?.layer ?? null,
      defaultLayer: options?.layer ?? null,
      events: options?.events ?? {},
      data: options?.data ?? undefined,
    });

    elementRef.value.addEventListener('dragstart', preventEvent);
    elementRef.value.addEventListener('drag', preventEvent);
    elementRef.value.setAttribute(draggableDataName, 'true');
    elementRef.value.setAttribute('draggable', 'false');
    elementRef.value.setAttribute('role', 'button');
    elementRef.value.setAttribute('tabindex', '0');
    elementRef.value.style.touchAction = 'none';
  };

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
  };
};
