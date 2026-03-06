<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { motion } from 'motion-v';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const emit = defineEmits<{
    (e: 'started'): void;
    (e: 'ended'): void;
    (e: 'cancelled'): void;
  }>();

  const draggableRef = useTemplateRef<HTMLElement>('draggableRef');

  const { isDragging } = makeDraggable(draggableRef, {
    events: {
      onSelfDragStart() {
        emit('started');
      },
      onSelfDragEnd() {
        emit('ended');
      },
      onSelfDragCancel() {
        emit('cancelled');
      },
    },
  } as any);
</script>

<template>
  <motion.div
    ref="draggableRef"
    class="draggable"
    :initial="{ scale: 0.9, y: -8, opacity: 0 }"
    :animate="{ scale: 1, y: 0, opacity: 1 }"
    :class="{ 'is-dragging': isDragging }"
  >
    Drag me
  </motion.div>
</template>

<style scoped>
  .draggable {
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    background-color: var(--vp-c-brand-1);
    color: var(--vp-c-bg);
    cursor: grab;
    user-select: none;
    touch-action: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: max-content;
  }

  .draggable:active {
    cursor: grabbing;
  }

  .draggable.is-dragging {
    opacity: 0.4 !important;
  }
</style>
