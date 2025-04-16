<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';

  const { elementRef, handleDragStart } = useDraggable();
</script>

<template>
  <div
    ref="elementRef"
    @pointerdown="handleDragStart"
  >
    <slot />
  </div>
</template>
