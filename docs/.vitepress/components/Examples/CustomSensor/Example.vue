<script lang="ts" setup>
  import { useDraggable, useDroppable } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';

  const { elementRef, handleDragStart, isDragging } = useDraggable({
    sensor: {
      setup: (store) => {
        const x = store.pointerPosition.current.value?.x ?? 0;
        const y = store.pointerPosition.current.value?.y ?? 0;

        const elements = document.elementsFromPoint(x, y);

        return elements.length > 0 ? elements : null;
      },
    },
  });

  const { elementRef: droppableRef, isOvered } = useDroppable({
    events: {
      onDrop: () => alert('dropped'),
    },
  });
</script>

<template>
  <ExampleContainer>
    <div class="container">
      <div
        ref="elementRef"
        @pointerdown="handleDragStart"
        class="draggable-item"
        :class="{ 'is-dragging': isDragging }"
      >
        drag me
      </div>

      <div
        ref="droppableRef"
        class="droppable"
        :class="{ 'is-overed': isOvered }"
      >
        drop zone
      </div>
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .container {
    display: flex;
    gap: 20px;
    flex-direction: column;
  }

  .draggable-item {
    background-color: rgb(62, 175, 124);
    border-radius: 8px;
    cursor: grab;
    padding: 10px;
  }

  .is-dragging {
    opacity: 0.5;
  }

  .droppable {
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
    transform: scale(1.02);
  }
</style>
