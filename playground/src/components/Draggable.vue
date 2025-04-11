<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';

  defineProps<{
    groups?: string[];
  }>();

  const { elementRef, handleDragStart, isOvered, isDragging } = useDraggable({
    keyboard: {
      moveStep: 10,
    },
    sensor: {
      throttle: 0,
      // setup: (store) => {
      //   return document.elementsFromPoint(
      //     store.pointerPosition.current.value?.x || 0,
      //     store.pointerPosition.current.value?.y|| 0
      //   );
      // },
    },
  });
</script>

<template>
  <div
    ref="elementRef"
    :style="{
      opacity: isDragging ? 0.5 : 1,
      backgroundColor: isOvered ? 'red' : 'transparent',
    }"
    @pointerdown.self="handleDragStart"
    @keydown.space.self="handleDragStart"
  >
    <slot> draggable </slot>
  </div>
</template>

<style scoped>
  div {
    padding: 10px;
    border: 1px solid red;
    transition: all 0.3s ease;
  }
</style>
