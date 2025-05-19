<script setup lang="ts">
  import { useDraggable, useDroppable } from '@vue-dnd-kit/core';

  const { elementRef: draggableRef, handleDragStart } = useDraggable();

  const { elementRef: droppableRef } = useDroppable({
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
  <div>
    <h1>Promises</h1>
    <div
      ref="draggableRef"
      class="draggable"
      @pointerdown="handleDragStart"
      >Draggable</div
    >
    <div
      ref="droppableRef"
      class="droppable"
      >Droppable</div
    >
  </div>
</template>
