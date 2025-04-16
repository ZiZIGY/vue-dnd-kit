import { computed, ref } from 'vue';

import type { IUseDragOptions } from '../types';
import { draggableDataName } from '../utils/namespaces';
import { preventEvent } from '../utils/events';
import { useDnDStore } from '../composables/useDnDStore';

export const useElementManager = (options?: IUseDragOptions) => {
  const {
    elementsMap,
    draggingElements,
    hovered,
    selectedElementsMap,
    isDragging: isDragStarted,
    handleDragElementIntersection,
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

    const currentElement = elementsMap.value.get(elementRef.value);
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

    elementsMap.value.set(elementRef.value, {
      node: elementRef.value,
      groups: options?.groups ?? [],
      layer: options?.layer ?? null,
      defaultLayer: options?.layer ?? null,
      events: options?.events ?? {},
      data: options?.data ?? null,
    });

    // Добавляем элемент в список видимых при регистрации
    // Позже IntersectionObserver в компоненте DnDProvider обновит это состояние
    handleDragElementIntersection('add', elementRef.value);

    elementRef.value.addEventListener('dragstart', preventEvent);
    elementRef.value.addEventListener('drag', preventEvent);
    elementRef.value.setAttribute(draggableDataName, 'true');
    elementRef.value.setAttribute('draggable', 'false');
  };

  const unregisterElement = () => {
    if (!elementRef.value) return;

    // Удаляем элемент из списка видимых при отмене регистрации
    handleDragElementIntersection('remove', elementRef.value);

    elementsMap.value.delete(elementRef.value);
    selectedElementsMap.value.delete(elementRef.value);

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
  };
};
