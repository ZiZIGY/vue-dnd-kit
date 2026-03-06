<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{
    id: string;
    label: string;
    disabled?: boolean;
  }>();

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  const { isDragging } = makeDraggable(itemRef, {
    disabled: props.disabled,
    data: () => props.id,
  });
</script>

<template>
  <div
    ref="itemRef"
    class="item"
    :class="{
      'item--dragging': isDragging,
      'item--disabled': props.disabled,
    }"
  >
    <span
      v-if="props.disabled"
      class="badge badge--disabled"
    >disabled</span>
    <span
      v-else
      class="badge"
    >draggable</span>
    {{ props.label }}
  </div>
</template>

<style scoped>
  .item {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.875rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: grab;
    touch-action: none;
    user-select: none;
    background-color: rgba(62, 175, 124, 0.12);
    border: 1px solid rgba(62, 175, 124, 0.35);
    color: rgba(62, 175, 124, 0.9);
    width: 100%;
  }

  .item:active {
    cursor: grabbing;
  }

  .item--disabled {
    background-color: rgba(148, 163, 184, 0.08);
    border-color: rgba(148, 163, 184, 0.2);
    color: var(--vp-c-text-3);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .item--dragging {
    opacity: 0;
  }

  .badge {
    font-size: 0.6rem;
    font-weight: 600;
    padding: 0.1rem 0.35rem;
    border-radius: 3px;
    background: rgba(62, 175, 124, 0.2);
    color: rgba(62, 175, 124, 0.8);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .badge--disabled {
    background: rgba(148, 163, 184, 0.15);
    color: var(--vp-c-text-3);
  }
</style>
