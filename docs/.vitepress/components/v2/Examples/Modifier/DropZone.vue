<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';

  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');
  const dropped = ref(false);

  const { isAllowed, isDragOver } = makeDroppable(zoneRef, {
    events: {
      onDrop() {
        dropped.value = true;
        setTimeout(() => (dropped.value = false), 1200);
      },
    },
  });
</script>

<template>
  <div
    ref="zoneRef"
    class="drop-zone"
    :class="{
      'is-allowed': isAllowed,
      'is-over': isDragOver,
      'is-dropped': dropped,
    }"
  >
    <span v-if="dropped">Dropped!</span>
    <span v-else-if="isDragOver">Release to drop</span>
    <span v-else-if="isAllowed">Drop here</span>
    <span v-else>Drop Zone</span>
  </div>
</template>

<style scoped>
  .drop-zone {
    min-height: 80px;
    border: 2px dashed rgba(148, 163, 184, 0.3);
    border-radius: 10px;
    background: rgba(148, 163, 184, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    color: var(--vp-c-text-3);
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }

  .drop-zone.is-allowed {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }

  .drop-zone.is-over {
    background: rgba(62, 175, 124, 0.12);
  }

  .drop-zone.is-dropped {
    border-color: var(--vp-c-brand-1);
    background: rgba(62, 175, 124, 0.15);
    color: var(--vp-c-brand-1);
  }
</style>
