import { onBeforeUnmount, onMounted, ref } from 'vue';

import { useDnDStore } from './useDnDStore';

export const useDragContainer = () => {
  const elementRef = ref<HTMLElement | null>(null);

  const { draggingElements, pointerPosition, isDragging, activeContainer } =
    useDnDStore();

  onMounted(() => {
    activeContainer.ref = elementRef;
  });

  onBeforeUnmount(() => {
    activeContainer.ref.value = null;
  });

  return {
    elementRef,
    draggingElements,
    pointerPosition,
    isDragging,
  };
};
