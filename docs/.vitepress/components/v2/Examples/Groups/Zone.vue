<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeDroppable, useDnDProvider } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';

  const props = defineProps<{
    label: string;
    groups?: string[];
  }>();

  const emit = defineEmits<{ (e: 'drop', event: IDragEvent): void }>();

  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');

  const { isAllowed, isDragOver } = makeDroppable(zoneRef, {
    groups: props.groups ?? [],
    events: {
      onDrop: (event) => {
        emit('drop', event);
      },
    },
  });

  const provider = useDnDProvider();
  const isDragging = computed(() => provider.state.value !== 'idle');

  const status = computed(() => {
    if (!isDragging.value) return 'idle';
    return isAllowed.value ? 'allowed' : 'blocked';
  });
</script>

<template>
  <div
    ref="zoneRef"
    class="zone"
    :class="[`zone--${status}`, { 'zone--over': isDragOver }]"
  >
    <div class="zone-header">
      <span class="zone-label">{{ label }}</span>
      <span
        v-if="props.groups?.length"
        class="zone-tag"
      >
        group: {{ props.groups.join(', ') }}
      </span>
      <span
        v-else
        class="zone-tag zone-tag--any"
      >
        accepts all
      </span>
    </div>

    <div class="zone-status-badge">
      <template v-if="status === 'allowed'">✓ allowed</template>
      <template v-else-if="status === 'blocked'">✗ blocked</template>
    </div>

    <slot />
  </div>
</template>

<style scoped>
  .zone {
    flex: 1;
    min-height: 110px;
    padding: 0.875rem;
    border: 2px dashed rgba(148, 163, 184, 0.25);
    border-radius: 10px;
    background-color: rgba(148, 163, 184, 0.04);
    transition: background-color 0.15s, border-color 0.15s;
  }

  .zone--allowed {
    border-color: rgba(62, 175, 124, 0.6);
    background-color: rgba(62, 175, 124, 0.07);
  }

  .zone--blocked {
    border-color: rgba(239, 68, 68, 0.4);
    background-color: rgba(239, 68, 68, 0.04);
  }

  .zone--over {
    border-style: solid;
    background-color: rgba(62, 175, 124, 0.12);
  }

  .zone-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.625rem;
    flex-wrap: wrap;
  }

  .zone-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  .zone-tag {
    font-size: 0.65rem;
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    background-color: rgba(168, 85, 247, 0.15);
    color: rgb(196, 154, 250);
    border: 1px solid rgba(168, 85, 247, 0.3);
    letter-spacing: 0.03em;
  }

  .zone-tag--any {
    background-color: rgba(62, 175, 124, 0.1);
    color: rgba(62, 175, 124, 0.9);
    border-color: rgba(62, 175, 124, 0.3);
  }

  .zone-status-badge {
    min-height: 1.25rem;
    font-size: 0.7rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--vp-c-text-2);
    transition: color 0.15s;
  }

  .zone--allowed .zone-status-badge {
    color: rgba(62, 175, 124, 0.9);
  }

  .zone--blocked .zone-status-badge {
    color: rgba(239, 68, 68, 0.7);
  }
</style>
