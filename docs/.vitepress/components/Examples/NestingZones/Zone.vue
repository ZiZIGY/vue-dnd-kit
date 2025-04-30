<script setup lang="ts">
  import { useDroppable } from '@vue-dnd-kit/core';

  const emit = defineEmits<{
    (e: 'drop'): void;
  }>();

  const { elementRef, isOvered } = useDroppable({
    events: {
      onDrop: () => emit('drop'),
    },
  });
</script>

<template>
  <div
    ref="elementRef"
    class="zone"
    :class="{ 'is-overed': isOvered }"
  >
    <slot />
  </div>
</template>

<style scoped>
  .zone {
    width: 100%;
    height: 100%;
    padding: 1rem;
    border: 1px dashed rgba(62, 175, 124, 0.3);
    border-radius: 6px;
    background-color: rgba(62, 175, 124, 0.1);
  }

  .is-overed {
    background-color: rgba(62, 175, 124, 0.2);
  }
</style>
