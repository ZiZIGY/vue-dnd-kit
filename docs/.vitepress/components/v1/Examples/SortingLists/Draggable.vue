<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const { index, source } = defineProps<{
    index: number;
    source: any[];
  }>();

  const { elementRef, handleDragStart, isOvered, isDragging } = useDraggable({
    data: computed(() => ({
      index,
      source,
    })),
  });
</script>

<template>
  <div
    ref="elementRef"
    @pointerdown="handleDragStart"
    :class="{
      'is-over': isOvered,
      'is-dragging': isDragging,
    }"
    class="draggable"
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
    font-weight: 500;
    font-size: 14px;
    width: 100%;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(62, 175, 124, 0.2);
    user-select: none;
    touch-action: none;
    opacity: 0.5;
  }

  .draggable:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.3);
  }

  .is-dragging {
    opacity: 0.2;
  }

  .is-over {
    border-color: #3eaf7c;
    box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.3);
    background-color: #44c98d;
    opacity: 1;
  }
</style>
