<script setup lang="ts">
  import { makeDroppable } from '@vue-dnd-kit/core';
</script>

<template>
  <Transition name="preview-pop">
    <DragPreview />
  </Transition>
</template>

<style>
  .preview-pop-enter-active {
    transition: opacity 0.15s ease,
      scale 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .preview-pop-leave-active {
    transition: opacity 0.1s ease, scale 0.1s ease;
  }
  .preview-pop-enter-from,
  .preview-pop-leave-to {
    opacity: 0;
    scale: 0.85;
  }
</style>
