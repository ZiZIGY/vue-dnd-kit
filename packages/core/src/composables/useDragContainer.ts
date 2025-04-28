import { onUnmounted, onMounted, ref, type TransitionProps } from 'vue';

import { useDnDStore } from './useDnDStore';

export const useDragContainer = (options?: TransitionProps) => {
  const elementRef = ref<HTMLElement | null>(null);

  const { draggingElements, pointerPosition, isDragging, activeContainer } =
    useDnDStore();

  onMounted(() => {
    activeContainer.ref = elementRef;
    activeContainer.options.value = options ?? null;
  });

  onUnmounted(() => {
    activeContainer.ref.value = null;
    activeContainer.options.value = null;
  });

  return {
    elementRef,
    draggingElements,
    pointerPosition,
    isDragging,
  };
};
