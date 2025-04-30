<script setup lang="ts">
  import { useDraggable, useDroppable } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import ExampleOverlay from './ExampleOverlay.vue';
  import { markRaw } from 'vue';

  const { elementRef, handleDragStart, isDragging } = useDraggable();

  const { elementRef: dropZoneRef, isOvered } = useDroppable({
    events: {
      onHover: (store) =>
        (store.activeContainer.component.value = markRaw(ExampleOverlay)),
      onLeave: (store) => (store.activeContainer.component.value = null),
    },
  });
</script>

<template>
  <ExampleContainer>
    <div
      ref="elementRef"
      @pointerdown="handleDragStart"
      class="draggable-item"
      :class="{ 'is-dragging': isDragging }"
    >
      Move me to drop zone
    </div>

    <div
      ref="dropZoneRef"
      class="drop-zone"
      :class="{ 'is-overed': isOvered }"
    >
      Drop zone
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .draggable-item {
    padding: 12px 16px;
    background-color: rgba(62, 175, 124, 0.15);
    border: 2px solid rgba(62, 175, 124, 0.5);
    border-radius: 8px;
    cursor: grab;
    user-select: none;
    font-weight: 500;
    transition: all 0.2s ease;
    max-width: 200px;
    text-align: center;
    margin-bottom: 20px;
  }

  .is-dragging {
    opacity: 0;
  }

  .draggable-item:hover {
    background-color: rgba(62, 175, 124, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .draggable-item:active {
    cursor: grabbing;
    transform: scale(1.02);
  }

  .drop-zone {
    padding: 30px;
    border: 2px dashed rgba(62, 175, 124, 0.4);
    border-radius: 8px;
    background-color: rgba(62, 175, 124, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    color: rgba(60, 60, 60, 0.7);
    transition: all 0.3s ease;
  }

  .is-overed {
    background-color: rgba(62, 175, 124, 0.1);
    border-color: rgba(62, 175, 124, 0.6);
  }
</style>
