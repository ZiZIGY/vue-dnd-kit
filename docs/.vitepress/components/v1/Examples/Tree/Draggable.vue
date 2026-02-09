<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const { index, source } = defineProps<{
    index: number;
    source: any[];
  }>();

  const { elementRef, handleDragStart, isDragging, isOvered } = useDraggable({
    data: computed(() => ({
      source,
      index,
    })),
  });
</script>

<template>
  <div
    class="draggable"
    ref="elementRef"
    :class="{ 'is-dragging': isDragging, 'is-overed': isOvered }"
  >
    <div>
      <button
        class="drag-handle"
        aria-label="Drag handle"
        @pointerdown="handleDragStart"
      >
        ⋮⋮
      </button>
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .draggable {
    padding: 10px 16px;
    border: 1px solid rgba(62, 175, 124, 0.3);
    border-radius: 6px;
    background-color: rgba(62, 175, 124, 0.1);
    font-weight: 500;
    font-size: 14px;
    width: 100%;
    transition: all 0.2s ease;
  }

  .is-dragging {
    opacity: 0.5;
  }
  .is-dragging {
    opacity: 0.5;
  }

  .is-overed {
    background-color: rgba(62, 175, 124, 0.2);
    border-color: rgba(62, 175, 124, 0.3);
  }
</style>
