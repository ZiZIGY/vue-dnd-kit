<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';
  import ExampleContainer from '../ExampleContainer.vue';

  const { elementRef, isDragging, handleDragStart } = useDraggable({
    id: 'draggable-with-handle',
  });
</script>

<template>
  <ExampleContainer>
    <div
      ref="elementRef"
      :class="{ 'is-dragging': isDragging }"
      class="draggable-item"
    >
      <div
        class="drag-handle"
        role="button"
        tabindex="0"
        aria-label="Drag handle"
        @pointerdown="handleDragStart"
        style="touch-action: none"
      >
        ⋮⋮
      </div>
      <div class="item-content"> Drag using the handle </div>
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .draggable-item {
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 6px;
    background-color: #3eaf7c;
    color: white;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(62, 175, 124, 0.2);
    transition: all 0.2s ease;
    user-select: none;
  }

  .drag-handle {
    cursor: grab;
    padding: 8px 6px;
    border-radius: 4px;
    color: white;
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

  .is-dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }

  .is-dragging .drag-handle {
    cursor: grabbing;
  }

  .item-content {
    flex: 1;
    font-size: 14px;
  }
</style>
