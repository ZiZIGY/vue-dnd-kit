<script setup lang="ts">
  import { useDroppable, DnDOperations } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const { source } = defineProps<{
    source: any[];
  }>();

  const { elementRef, isOvered } = useDroppable({
    data: computed(() => ({
      source,
    })),
    events: {
      onDrop: DnDOperations.applyTransfer,
    },
  });
</script>

<template>
  <div
    class="droppable"
    ref="elementRef"
    :class="{ 'is-overed': isOvered }"
  >
    <slot />
  </div>
</template>

<style scoped>
  .droppable {
    padding: 16px;
    border-radius: 6px;
    border: 1px dashed rgba(62, 175, 124, 0.3);
    background-color: rgba(62, 175, 124, 0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
  }

  .is-overed {
    background-color: rgba(62, 175, 124, 0.2);
  }
</style>
