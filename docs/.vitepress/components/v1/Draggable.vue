<script setup>
  import { useDraggable } from '@vue-dnd-kit/core';
  import Container from './Container.vue';
  import Skeleton from './Skeleton.vue';
  import { markRaw } from 'vue';
  const emit = defineEmits(['start', 'leave', 'hover', 'move', 'end']);

  const { elementRef, handleDragStart, isDragging } = useDraggable({
    container: markRaw(Container),
    layer: markRaw(Skeleton),
    groups: ['example'],
    events: {
      onStart: () => emit('start'),
      onLeave: () => emit('leave'),
      onHover: () => emit('hover'),
      onMove: () => emit('move'),
      onEnd: () => emit('end'),
    },
  });
</script>

<template>
  <button
    ref="elementRef"
    tabindex="1"
    role="button"
    class="draggable"
    @pointerdown="handleDragStart"
    @keydown.space.prevent="handleDragStart"
    :class="{ 'is-dragging': isDragging }"
  >
    <slot />
  </button>
</template>

<style scoped>
  .draggable {
    padding: 10px 16px;
    border: 1px solid #3eaf7c;
    border-radius: 6px;
    cursor: move;
    background-color: #3eaf7c;
    color: white;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(62, 175, 124, 0.2);
    user-select: none;
    touch-action: none;
  }

  .draggable:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.3);
  }

  .is-dragging {
    opacity: 0.5;
    transform: scale(0.9);
  }
</style>
