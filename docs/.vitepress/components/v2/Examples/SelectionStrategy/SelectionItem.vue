<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{
    index: number;
    items: { id: number; label: string }[];
    item: { id: number; label: string };
  }>();

  const el = useTemplateRef<HTMLElement>('el');
  const { isDragging, isDragOver, selected } = makeDraggable(
    el,
    { dragHandle: '.handle' },
    () => [props.index, props.items]
  );
</script>

<template>
  <div
    ref="el"
    class="item"
    :class="{ 'item--dragging': isDragging, 'item--selected': selected }"
  >
    <div v-if="isDragOver?.top" class="ind ind--top" />
    <div v-if="isDragOver?.bottom" class="ind ind--bottom" />

    <input
      v-model="selected"
      type="checkbox"
      class="check"
    />
    <span class="label">{{ item.label }}</span>
    <span class="handle">⠿</span>
  </div>
</template>

<style scoped>
  .item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    transition: background 0.15s, border-color 0.15s, opacity 0.15s;
  }

  .item--selected {
    background: rgba(62, 175, 124, 0.1);
    border-color: rgba(62, 175, 124, 0.45);
  }

  .item--dragging {
    opacity: 0.3;
  }

  .check {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    accent-color: var(--vp-c-brand-1);
    cursor: pointer;
  }

  .label {
    flex: 1;
    font-size: 0.875rem;
    color: var(--vp-c-text-1);
  }

  .handle {
    color: var(--vp-c-text-3);
    cursor: grab;
    font-size: 1rem;
    line-height: 1;

    /* See Mobile & Touch section */
    touch-action: none;
    user-select: none;
  }

  .ind {
    position: absolute;
    left: 4px;
    right: 4px;
    height: 2px;
    background: var(--vp-c-brand-1);
    border-radius: 1px;
    pointer-events: none;
  }

  .ind--top { top: -1px; }
  .ind--bottom { bottom: -1px; }
</style>
