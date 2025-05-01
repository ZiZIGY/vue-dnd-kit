import { computed, ref, shallowRef, useId } from 'vue';

import type { IUseDragOptions } from '../types';
import { draggableDataName } from '../utils/namespaces';
import { preventEvent } from '../utils/events';
import { useDnDStore } from '../composables/useDnDStore';

export const useElementManager = (options?: IUseDragOptions) => {
  const {
    elementsMap,
    draggingElements,
    hovered,
    selectedElements,
    isDragging: isDragStarted,
    visibleElements,
    handleDragElementIntersection,
  } = useDnDStore();

  const elementRef = ref<HTMLElement | null>(null);
  const isOvered = computed<boolean>(
    () =>
      visibleElements.value.has(elementRef.value as HTMLElement) &&
      hovered.element.value === elementRef.value
  );

  const id = shallowRef(options?.id || useId());

  const isDragging = computed<boolean>(() => {
    if (!elementRef.value) return false;
    if (!elementsMap.value.has(elementRef.value)) return false;
    return draggingElements.value.has(elementRef.value);
  });

  const isAllowed = computed<boolean>(() => {
    if (!elementRef.value) return false;
    if (!isDragStarted.value) return false;
    if (!visibleElements.value.has(elementRef.value)) return false;

    const currentElement = elementsMap.value.get(elementRef.value);
    if (!currentElement?.groups.length) return true;

    return !Array.from(draggingElements.value.entries()).some(
      ([_, draggingElement]) => {
        if (!draggingElement.groups.length) return false;
        return !draggingElement.groups.some((group) =>
          currentElement.groups.includes(group)
        );
      }
    );
  });

  const registerElement = () => {
    if (!elementRef.value) throw new Error('ElementRef is not set');

    elementsMap.value.set(elementRef.value, {
      node: elementRef.value,
      groups: options?.groups ?? [],
      layer: options?.layer ?? null,
      defaultLayer: options?.layer ?? null,
      events: options?.events ?? {},
      data: options?.data ?? null,
      id: id.value,
    });

    handleDragElementIntersection('add', elementRef.value);

    elementRef.value.addEventListener('dragstart', preventEvent);
    elementRef.value.addEventListener('drag', preventEvent);
    elementRef.value.setAttribute(draggableDataName, 'true');
    elementRef.value.setAttribute('draggable', 'false');
  };

  const unregisterElement = () => {
    if (!elementRef.value) return;

    elementsMap.value.delete(elementRef.value);
    selectedElements.value.delete(elementRef.value);

    elementRef.value.removeEventListener('dragstart', preventEvent);
    elementRef.value.removeEventListener('drag', preventEvent);
    elementRef.value.removeAttribute(draggableDataName);
    elementRef.value.removeAttribute('draggable');
  };

  return {
    elementRef,
    registerElement,
    unregisterElement,
    isDragging,
    isOvered,
    isAllowed,
    id,
  };
};
