<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';

  const { elementRef, handleDragStart } = useDraggable({
    sensor: {
      setup(store) {
        return document.elementsFromPoint(
          store.pointerPosition.current.value?.x || 0,
          store.pointerPosition.current.value?.y || 0
        );
      },
      throttle: 1000,
    },
  });
</script>

<template>
  <div
    ref="elementRef"
    @pointerdown="handleDragStart"
  >
    <slot />
  </div>
</template>
