<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { motion } from 'motion-v';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{
    id: string;
    index: number;
    items: unknown[];
    group: string;
    label: string;
    color: 'blue' | 'purple';
  }>();

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  const { isDragging, selected } = makeDraggable(
    itemRef,
    {
      groups: [props.group],
      data: () => props.id,
      dragHandle: '.handle',
    },
    () => [props.index, props.items]
  );
</script>

<template>
  <motion.div
    ref="itemRef"
    class="item"
    :class="[`item--${props.color}`, { 'item--dragging': isDragging, 'item--selected': selected }]"
    :initial="{ scale: 0.9, opacity: 0 }"
    :animate="{ scale: 1, opacity: isDragging ? 0 : 1 }"
    :transition="{ duration: 0.18 }"
  >
    <input
      v-model="selected"
      type="checkbox"
      class="checkbox"
      @pointerdown.stop
    />
    <span class="badge">{{ props.group }}</span>
    <span class="label">{{ props.label }}</span>
    <button
      class="handle"
      aria-label="Drag"
    >⠿</button>
  </motion.div>
</template>

<style scoped>
  .item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.6rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 500;
    user-select: none;
    border: 1px solid transparent;
    transition: border-color 0.15s, background 0.15s;
  }

  .item--selected {
    outline: 2px solid rgba(62, 175, 124, 0.5);
    outline-offset: 1px;
  }

  .item--blue {
    background-color: rgba(59, 130, 246, 0.12);
    border-color: rgba(59, 130, 246, 0.35);
    color: rgb(147, 197, 253);
  }

  .item--purple {
    background-color: rgba(168, 85, 247, 0.12);
    border-color: rgba(168, 85, 247, 0.35);
    color: rgb(196, 154, 250);
  }

  .checkbox {
    flex-shrink: 0;
    width: 0.85rem;
    height: 0.85rem;
    accent-color: rgba(62, 175, 124, 0.9);
    cursor: pointer;
  }

  .badge {
    font-size: 0.6rem;
    font-weight: 700;
    padding: 0.08rem 0.3rem;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.1);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.8;
    flex-shrink: 0;
  }

  .label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .handle {
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: grab;
    color: inherit;
    opacity: 0.45;
    font-size: 0.95rem;
    line-height: 1;
    padding: 0 2px;
    touch-action: none;
    transition: opacity 0.12s;
  }

  .handle:hover { opacity: 0.8; }
  .handle:active { cursor: grabbing; }
</style>
