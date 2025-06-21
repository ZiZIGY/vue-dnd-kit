<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const {
    index,
    source,
    groups = ['dashboard'],
  } = defineProps<{
    index: number;
    source: any[];
    groups?: string[];
  }>();

  const { elementRef, handleDragStart } = useDraggable({
    groups,
    data: computed(() => ({
      source,
      index,
    })),
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
