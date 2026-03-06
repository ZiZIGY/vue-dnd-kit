<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';

  const props = defineProps<{
    label: string;
    disabled?: boolean;
  }>();
  const emit = defineEmits<{ (e: 'drop', event: IDragEvent): void }>();

  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');

  const { isDragOver } = makeDroppable(zoneRef, {
    disabled: props.disabled,
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
    :class="{
      'zone--over': isDragOver,
      'zone--disabled': props.disabled,
    }"
  >
    <div class="zone-header">
      <span class="zone-label">{{ props.label }}</span>
      <span
        v-if="props.disabled"
        class="zone-tag zone-tag--disabled"
      >disabled</span>
      <span
        v-else
        class="zone-tag"
      >accepts drops</span>
    </div>
    <slot />
  </div>
</template>

<style scoped>
  .zone {
    min-height: 90px;
    padding: 0.875rem;
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
    border-color: rgba(62, 175, 124, 0.5);
    background-color: rgba(62, 175, 124, 0.07);
  }

  .zone--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .zone-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .zone-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  .zone-tag {
    font-size: 0.62rem;
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    background-color: rgba(62, 175, 124, 0.1);
    color: rgba(62, 175, 124, 0.9);
    border: 1px solid rgba(62, 175, 124, 0.3);
    letter-spacing: 0.03em;
  }

  .zone-tag--disabled {
    background-color: rgba(148, 163, 184, 0.1);
    color: var(--vp-c-text-3);
    border-color: rgba(148, 163, 184, 0.25);
  }
</style>
