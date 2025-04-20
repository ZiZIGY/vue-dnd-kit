<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const props = defineProps<{
    source?: any[];
    index?: number;
  }>();

  const { elementRef, handleDragStart, isOvered } = useDraggable({
    data: computed(() => ({
      source: props.source,
      index: props.index,
    })),
  });
</script>

<template>
  <div
    ref="elementRef"
    @pointerdown="handleDragStart"
  >
    <slot />
    <hr v-if="isOvered" />
  </div>
</template>
