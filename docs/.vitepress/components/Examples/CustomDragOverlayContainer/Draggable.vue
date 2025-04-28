<script lang="ts" setup>
  import { useDraggable } from '@vue-dnd-kit/core';
  import Container from './Container.vue';
  import ExampleContainer from '../../ExampleContainer.vue';

  const { elementRef, handleDragStart, isDragging, isOvered } = useDraggable({
    container: Container,
  });
</script>

<template>
  <ExampleContainer>
    <div
      ref="elementRef"
      class="draggable-item"
      :class="{ 'is-dragging': isDragging, 'is-overed': isOvered }"
      @pointerdown="handleDragStart"
    >
      Drag me to see custom drag overlay
    </div>
  </ExampleContainer>
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
</style>
