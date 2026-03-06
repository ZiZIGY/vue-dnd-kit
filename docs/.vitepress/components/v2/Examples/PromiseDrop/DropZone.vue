<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';

  const emit = defineEmits<{
    (e: 'accepted'): void;
    (e: 'declined'): void;
  }>();

  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');

  function handleDrop(e: IDragEvent): Promise<void | boolean> {
    return new Promise((resolve) => {
      const ok = window.confirm('Are you sure you want to drop here?');
      if (!ok) {
        emit('declined');
        resolve(false);
        return;
      }

      emit('accepted');
      resolve();
    });
  }

  const { isDragOver } = makeDroppable(zoneRef, {
    events: {
      onDrop(e) {
        return handleDrop(e);
      },
    },
  });
</script>

<template>
  <div
    ref="zoneRef"
    class="droppable droppable--async"
    :class="{ 'droppable--over': !!isDragOver }"
  >
    <slot>
      Drop zone (asks for confirmation)
    </slot>
  </div>
</template>

<style scoped>
  .droppable {
    position: relative;
    min-height: 80px;
    padding: 1rem;
    border-radius: 8px;
    border: 2px dashed rgba(62, 175, 124, 0.4);
    background-color: rgba(62, 175, 124, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: background-color 0.15s, border-color 0.15s;
  }

  .droppable--over {
    background-color: rgba(62, 175, 124, 0.12);
    border-color: rgba(62, 175, 124, 0.9);
  }
</style>
