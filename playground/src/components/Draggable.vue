<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';

  const { elementRef, handleDragStart, isOvered } = useDraggable({
    sensor: (store) => {
      const pointerX = store.pointerPosition.current.value?.x ?? 0;
      const pointerY = store.pointerPosition.current.value?.y ?? 0;

      const elementUnderCursor = document.elementFromPoint(
        pointerX,
        pointerY
      ) as HTMLElement;

      return elementUnderCursor;
    },
  });
</script>

<template>
  <div
    ref="elementRef"
    @pointerdown="handleDragStart"
  >
    <slot> draggable {{ isOvered }}</slot>
  </div>
</template>

<style scoped>
  div {
    padding: 10px;
    border: 1px solid red;
  }
</style>
