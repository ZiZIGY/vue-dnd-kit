<script setup lang="ts">
  import { useDraggable, useDroppable } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';

  const {
    elementRef: draggableRef,
    handleDragStart,
    isDragging,
  } = useDraggable();
  const { elementRef: droppableRef, isOvered } = useDroppable({
    events: {
      onDrop() {
        return new Promise((resolve) => {
          const result = confirm('Are you sure?');
          resolve(result);
        });
      },
    },
  });
</script>

<template>
  <ExampleContainer>
    <div class="container">
      <div
        ref="draggableRef"
        class="draggable"
        :class="{ 'is-dragging': isDragging }"
        @pointerdown="handleDragStart"
      >
        Draggable
      </div>

      <div
        ref="droppableRef"
        class="droppable"
        :class="{ 'is-overed': isOvered }"
      >
        Droppable
      </div>
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .draggable {
    padding: 1rem;
    border-radius: 6px;
    background-color: rgba(62, 175, 124);
  }

  .is-dragging {
    opacity: 0.5;
  }

  .droppable {
    width: 100%;
    height: 100%;
    padding: 1rem;
    border: 1px dashed rgba(62, 175, 124, 0.3);
    border-radius: 6px;
    background-color: rgba(62, 175, 124, 0.1);
  }

  .droppable.is-overed {
    background-color: rgba(62, 175, 124, 0.2);
  }
</style>
