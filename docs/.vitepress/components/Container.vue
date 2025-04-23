<script setup>
  import { computed } from 'vue';
  import { useDragContainer } from '@vue-dnd-kit/core';

  const { elementRef, pointerPosition, isDragging, draggingElements } =
    useDragContainer();

  const computedStyle = computed(() => ({
    transform: `translate3d(${
      (pointerPosition.current.value?.x ?? 0) -
      (pointerPosition.offset.pixel.value?.x ?? 0)
    }px, ${
      (pointerPosition.current.value?.y ?? 0) -
      (pointerPosition.offset.pixel.value?.y ?? 0)
    }px, 0)`,
    zIndex: 1000,
    position: 'fixed',
    top: 0,
    left: 0,
    transition: '0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
  }));
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isDragging"
      ref="elementRef"
      :style="computedStyle"
    >
      <component
        v-for="[_, element] in draggingElements"
        :key="element.id"
        :is="element.layer"
        :style="{
          width: `${element.initialRect?.width}px`,
          height: `${element.initialRect?.height}px`,
        }"
      />
    </div>
  </Transition>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
