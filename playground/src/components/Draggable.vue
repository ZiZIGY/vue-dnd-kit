<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';

  defineProps<{
    groups?: string[];
  }>();

  const { elementRef, handleDragStart, isOvered, isDragging } = useDraggable({
    sensor: {
      throttle: 0,
    },
    groups: ['sex'],
  });
</script>

<template>
  <div
    ref="elementRef"
    role="button"
    tabindex="10"
    @pointerdown="handleDragStart"
    @keydown.space.self="handleDragStart"
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
