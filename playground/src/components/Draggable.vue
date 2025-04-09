<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{
    groups?: string[];
  }>();

  const { elementRef, handleDragStart, isOvered, isDragging } = useDraggable({
    throttle: 0,
    ...props,
  });
</script>

<template>
  <div
    ref="elementRef"
    @pointerdown="handleDragStart"
    :style="{
      opacity: isDragging ? 0.5 : 1,
      backgroundColor: isOvered ? 'red' : 'transparent',
    }"
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
