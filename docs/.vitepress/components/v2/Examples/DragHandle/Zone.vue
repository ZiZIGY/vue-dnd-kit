<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';

  defineProps<{ label: string }>();

  const emit = defineEmits<{ (e: 'drop'): void }>();

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
    <span class="zone-label">{{ label }}</span>
    <slot />
  </div>
</template>

<style scoped>
  .zone {
    flex: 1;
    min-height: 140px;
    padding: 1rem;
    border: 2px dashed rgba(62, 175, 124, 0.4);
    border-radius: 8px;
    background-color: rgba(62, 175, 124, 0.06);
    transition: background-color 0.15s, border-color 0.15s;
  }

  .zone--over {
    background-color: rgba(62, 175, 124, 0.14);
    border-color: rgba(62, 175, 124, 0.7);
  }

  .zone-label {
    display: block;
    font-size: 0.75rem;
    color: var(--vp-c-text-2);
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
</style>
