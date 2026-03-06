<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';

  const props = defineProps<{
    id: 'lab' | 'storage';
    label: string;
    description: string;
    isActive: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'hover', zone: 'lab' | 'storage' | null): void;
    (e: 'dropped'): void;
  }>();

  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');

  makeDroppable(zoneRef, {
    events: {
      onEnter(event) {
        emit('hover', props.id);
      },
      onLeave(event) {
        emit('hover', event);
      },
      onDrop() {
        emit('hover', null);
        emit('dropped');
      },
    },
  });
</script>

<template>
  <div
    ref="zoneRef"
    class="alchemy-zone"
    :class="{ 'alchemy-zone--active': isActive }"
  >
    <h4 class="alchemy-zone__title">
      {{ label }}
    </h4>
    <p class="alchemy-zone__desc">
      {{ description }}
    </p>
    <div class="alchemy-zone__slot">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .alchemy-zone {
    min-height: 150px;
    padding: 1rem;
    border-radius: 0.9rem;
    border: 1px dashed rgba(148, 163, 184, 0.65);
    background: rgba(15, 23, 42, 0.02);
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    transition: background-color 0.15s, border-color 0.15s, box-shadow 0.15s;
  }

  .alchemy-zone--active {
    background: rgba(56, 189, 248, 0.08);
    border-color: rgba(56, 189, 248, 0.9);
    box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.5);
  }

  .alchemy-zone__title {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0;
  }

  .alchemy-zone__desc {
    font-size: 0.8rem;
    margin: 0;
    color: var(--vp-c-text-2);
  }

  .alchemy-zone__slot {
    margin-top: 0.4rem;
  }
</style>
