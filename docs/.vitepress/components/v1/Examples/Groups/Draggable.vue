<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';

  const { groups } = defineProps<{
    groups: string[];
  }>();

  const emit = defineEmits<{
    (e: 'end'): void;
  }>();

  const { elementRef, isDragging, handleDragStart } = useDraggable({
    groups,
    events: {
      onEnd: () => emit('end'),
    },
  });
</script>

<template>
  <div
    ref="elementRef"
    class="draggable"
    :class="{ 'is-dragging': isDragging }"
    @pointerdown="handleDragStart"
  >
    drag me
  </div>
</template>

<style scoped>
  .draggable {
    padding: 1rem;
    border-radius: 6px;
    background-color: rgba(62, 175, 124);
  }

  .is-dragging {
    opacity: 0.5;
  }
</style>
