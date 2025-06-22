<script setup lang="ts" generic="T">
  import { useDraggable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const {
    groups = ['sortable'],
    index,
    source,
  } = defineProps<{
    source: T[];
    index: number;
    groups?: string[];
  }>();

  const { elementRef, handleDragStart, isDragging } = useDraggable({
    groups,
    data: computed(() => ({
      source,
      index,
    })),
  });
</script>

<template>
  <li
    ref="elementRef"
    :class="{
      'vue-dnd-sortable-item-dragging': isDragging,
      'vue-dnd-sortable-item': true,
    }"
    @pointerdown="handleDragStart"
  >
    <slot />
  </li>
</template>
