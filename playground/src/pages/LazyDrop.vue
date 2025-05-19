<script setup lang="ts">
  import { useDraggable, useDroppable } from '@vue-dnd-kit/core';

  const { elementRef: droppableRef } = useDroppable();

  const {
    handleDragStart,
    elementRef: draggableRef,
    isLazyAllowed: isLazyAllowed1,
  } = useDraggable();

  const {
    handleDragStart: handleDragStart2,
    elementRef: draggableRef2,
    isLazyAllowed: isLazyAllowed2,
  } = useDraggable();
</script>

<template>
  <div>
    <h1>Lazy Drop</h1>

    <div ref="droppableRef">
      <div
        ref="draggableRef"
        @pointerdown="handleDragStart"
        :class="{ 'is-lazy-allowed': isLazyAllowed1 }"
      >
        <p>Draggable</p>
      </div>
      <div
        ref="draggableRef2"
        @pointerdown="handleDragStart2"
        :class="{ 'is-lazy-allowed': isLazyAllowed2 }"
      >
        <p>Draggable</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .is-lazy-allowed {
    background-color: red;
  }
</style>
