<script setup lang="ts">
  import { computed, CSSProperties } from 'vue';
  import { useDragContainer } from '@vue-dnd-kit/core';

  const { elementRef, pointerPosition, isDragging, draggingElements } =
    useDragContainer({
      name: 'fade',
    });

  const computedStyle = computed<CSSProperties>(() => ({
    zIndex: 1000,
    position: 'fixed',
    top: `${pointerPosition.current.value?.y}px`,
    left: `${pointerPosition.current.value?.x}px`,
    transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
  }));
</script>

<template>
  <div
    v-if="isDragging"
    ref="elementRef"
    :style="computedStyle"
    class="custom-overlay"
  >
    im working with transition under the hood
  </div>
</template>

<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .custom-overlay {
    background: #3eaf7c;
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
</style>
