<script setup lang="ts" generic="T">
  import { DnDOperations, useDroppable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const { data, groups = ['dashboard'] } = defineProps<{
    data: T[];
    groups?: string[];
  }>();

  const { elementRef } = useDroppable({
    groups,
    data: computed(() => ({
      source: data,
    })),
    events: {
      onDrop: DnDOperations.applyTransfer,
    },
  });
</script>

<template>
  <div ref="elementRef">
    <slot />
  </div>
</template>
