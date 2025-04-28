<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';
  import ExampleContainer from '../ExampleContainer.vue';

  const { elementRef, isDragging, handleDragStart } = useDraggable({
    id: 'keyboard-draggable',
  });
</script>

<template>
  <ExampleContainer>
    <div
      ref="elementRef"
      :class="{ 'is-dragging': isDragging }"
      class="draggable-item"
      tabindex="0"
      role="button"
      aria-label="Draggable item"
      @pointerdown="handleDragStart"
      @keydown.space.prevent="handleDragStart"
    >
      <div class="keyboard-hint"> <kbd>Space</kbd> to drag </div>
      <div class="keyboard-hint">
        <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to move
      </div>
      <div class="item-content">Press Space to drag me</div>
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .draggable-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-radius: 6px;
    background-color: #3eaf7c;
    color: white;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(62, 175, 124, 0.2);
    transition: all 0.2s ease;
    user-select: none;
    cursor: grab;
  }

  .draggable-item:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.4);
  }

  .keyboard-hint {
    font-size: 12px;
    background-color: rgba(255, 255, 255, 0.2);
    padding: 4px 8px;
    border-radius: 4px;
    display: flex;
    gap: 4px;
    align-items: center;
    margin-bottom: 4px;
  }

  kbd {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    padding: 2px 6px;
    font-family: monospace;
    font-size: 11px;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
  }

  .is-dragging {
    opacity: 0.5;
    transform: scale(0.95);
    cursor: grabbing;
  }

  .item-content {
    font-size: 14px;
    text-align: center;
  }
</style>
