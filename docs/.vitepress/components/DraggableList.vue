<script setup>
  import { useDraggable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';
  const emit = defineEmits(['start', 'leave', 'hover', 'move', 'end']);

  const props = defineProps({
    index: {
      type: Number,
      required: true,
    },
    source: {
      type: Array,
      required: true,
    },
  });

  const { elementRef, handleDragStart, isDragging, isOvered } = useDraggable({
    groups: ['list'],
    data: computed(() => ({
      index: props.index,
      source: props.source,
    })),
  });
</script>

<template>
  <div
    ref="elementRef"
    tabindex="1"
    role="button"
    class="draggable"
    @pointerdown="handleDragStart"
    @keydown.space.prevent="handleDragStart"
    :class="{ 'is-dragging': isDragging, 'is-overed': isOvered }"
  >
    <slot />
  </div>
</template>

<style scoped>
  .draggable {
    padding: 10px 16px;
    border: 1px solid #3eaf7c;
    border-radius: 6px;
    cursor: move;
    background-color: #3eaf7c;
    color: white;
    width: 100%;
  }

  .is-dragging {
    opacity: 0.5;
  }

  .is-overed {
    background-color: #42b983;
  }
</style>
