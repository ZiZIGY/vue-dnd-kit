<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';

  const emit = defineEmits<{
    (e: 'dropped', event: IDragEvent): void;
  }>();

  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');

  const { isDragOver } = makeDroppable(zoneRef, {
    events: {
      onDrop(e) {
        emit('dropped', e);
      },
    },
  });

</script>

<template>
  <div
    ref="zoneRef"
    class="droppable droppable--instant"
    :class="{ 'droppable--over': !!isDragOver }"
  >
    <slot>
      Instant drop zone (no confirmation)
    </slot>
  </div>
</template>

<style scoped>
  .droppable {
    position: relative;
    min-height: 80px;
    padding: 1rem;
    border-radius: 8px;
    border: 2px dashed rgba(148, 163, 184, 0.5);
    background-color: rgba(148, 163, 184, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: background-color 0.15s, border-color 0.15s;
  }

  .droppable--over {
    background-color: rgba(148, 163, 184, 0.16);
    border-color: rgba(148, 163, 184, 0.9);
  }
</style>

