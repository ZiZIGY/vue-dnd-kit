<script setup>
  import { useDraggable } from '@vue-dnd-kit/core';
  import ExampleContainer from '../ExampleContainer.vue';

  const { elementRef, isDragging, handleDragStart } = useDraggable({
    id: 'draggable-1',
  });
</script>

<template>
  <ExampleContainer>
    <div
      ref="elementRef"
      :class="{ dragging: isDragging }"
      @pointerdown="handleDragStart"
      style="touch-action: none"
    >
      Drag me!
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .dragging {
    opacity: 0.5;
    cursor: grabbing;
  }
  .draggable {
    touch-action: none;
  }
</style>
