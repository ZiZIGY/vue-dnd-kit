<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';

  const props = defineProps<{ label: string }>();
  const emit = defineEmits<{ (e: 'drop', event: IDragEvent): void }>();

  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');

  const { isDragOver } = makeDroppable(zoneRef, {
    events: {
      onDrop: (event) => {
        emit('drop', event);
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
    <p class="zone-label">{{ props.label }}</p>
    <slot />
  </div>
</template>

<style scoped>
  .zone {
    min-height: 80px;
    padding: 0.75rem;
    border: 2px dashed rgba(148, 163, 184, 0.25);
    border-radius: 10px;
    background-color: rgba(148, 163, 184, 0.04);
    transition: background-color 0.15s, border-color 0.15s;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .zone--over {
    border-style: solid;
    border-color: rgba(99, 102, 241, 0.5);
    background-color: rgba(99, 102, 241, 0.07);
  }

  .zone-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--vp-c-text-2);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
</style>
