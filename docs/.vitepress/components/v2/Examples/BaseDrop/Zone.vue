<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';

  const emit = defineEmits<{
    (e: 'drop'): void;
  }>();

  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');

  const { isDragOver } = makeDroppable(zoneRef, {
    events: {
      onDrop: () => {
        emit('drop');
      },
    },
  });
</script>

<template>
  <div
    ref="zoneRef"
    class="zone"
    :class="{ 'zone--over': isDragOver }"
  >
    <slot />
  </div>
</template>

<style scoped>
  .zone {
    min-height: 120px;
    padding: 1rem;
    border: 2px dashed rgba(62, 175, 124, 0.4);
    border-radius: 8px;
    background-color: rgba(62, 175, 124, 0.08);
    transition: background-color 0.15s, border-color 0.15s;
  }

  .zone--over {
    background-color: rgba(62, 175, 124, 0.18);
    border-color: rgba(62, 175, 124, 0.7);
  }
</style>
