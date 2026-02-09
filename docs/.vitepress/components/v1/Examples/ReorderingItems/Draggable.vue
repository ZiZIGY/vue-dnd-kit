<script lang="ts" setup>
  import { DnDOperations, useDraggable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const { index, source } = defineProps<{
    source: any[];
    index: number;
  }>();

  const { elementRef, handleDragStart, isDragging, isOvered } = useDraggable({
    data: computed(() => ({
      index,
      source,
    })),
  });
</script>

<template>
  <div
    ref="elementRef"
    class="draggable-item"
    :class="{ 'is-dragging': isDragging, 'is-overed': isOvered }"
  >
    <button
      class="drag-handle"
      @pointerdown="handleDragStart"
    >
      ⋮⋮
    </button>
    <slot />
  </div>
</template>

<style scoped>
  .draggable-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 12px 16px;
    border-radius: 6px;
    background-color: #3eaf7c;
    color: white;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(62, 175, 124, 0.2);
    transition: all 0.2s ease;
    user-select: none;
    position: relative;
    cursor: grab;
    width: 100%;
    height: 52px;
  }

  .is-dragging {
    opacity: 0.5;
  }

  .is-overed {
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      top: 100%;
      left: 0;
      height: 2px;
      margin-top: 5px;
      background-color: #3eaf7c;
      box-shadow: 0 2px 4px rgba(62, 175, 124, 0.2);
      border-radius: 6px;
    }
  }

  .drag-handle {
    cursor: grab;
    padding: 8px 6px;
    border-radius: 4px;
    color: white;
    width: min-content;
    font-weight: bold;
    user-select: none;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
  }

  .drag-handle:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .drag-handle:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.3);
  }
</style>
