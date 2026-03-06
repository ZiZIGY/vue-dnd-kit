<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { motion } from 'motion-v';
  import { makeDraggable } from '@vue-dnd-kit/core';

  export interface Block {
    id: number;
    type: string;
    label: string;
    icon: string;
    isPalette?: boolean;
  }

  const props = defineProps<{
    index: number;
    items: Block[];
    block: Block;
    compact?: boolean;
    /** When true, item is copy-only (e.g. from catalog): no drop indicators, not a sort target */
    copyOnly?: boolean;
  }>();

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  const { isDragging, isDragOver } = makeDraggable(itemRef, {}, () => [
    props.index,
    props.items,
  ]);

  const placement = computed(() =>
    props.copyOnly ? undefined : isDragOver.value
  );
</script>

<template>
  <motion.div
    ref="itemRef"
    class="block-item"
    :class="{
      'is-dragging': isDragging,
      'is-compact': compact,
    }"
    :initial="{ scale: 0.9, opacity: 0 }"
    :animate="{ scale: 1, opacity: 1 }"
    :transition="{ type: 'spring', stiffness: 300, damping: 26 }"
  >
    <div
      v-if="placement?.top"
      class="indicator indicator--top"
    />
    <div
      v-if="placement?.bottom"
      class="indicator indicator--bottom"
    />
    <span class="block-icon">{{ block.icon }}</span>
    <span class="block-label">{{ block.label }}</span>
    <span
      v-if="block.isPalette"
      class="copy-hint"
    >drag to copy</span>
  </motion.div>
</template>

<style scoped>
  .block-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 8px;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    cursor: grab;
    user-select: none;
    touch-action: none;
    transition:
      background 0.15s,
      border-color 0.15s,
      box-shadow 0.15s;
  }

  .block-item:active {
    cursor: grabbing;
  }

  .block-item:hover {
    border-color: var(--vp-c-brand-1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .is-compact {
    padding: 7px 10px;
  }

  .is-dragging {
    opacity: 0 !important;
  }

  .block-icon {
    font-size: 18px;
    line-height: 1;
    flex-shrink: 0;
  }

  .is-compact .block-icon {
    font-size: 16px;
  }

  .block-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--vp-c-text-1);
    flex: 1;
  }

  .copy-hint {
    font-size: 10px;
    color: var(--vp-c-text-3);
    white-space: nowrap;
  }

  .indicator {
    position: absolute;
    left: 6px;
    right: 6px;
    height: 2px;
    background: var(--vp-c-brand-1);
    border-radius: 2px;
    pointer-events: none;
    z-index: 1;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent);
  }

  .indicator--top {
    top: -5px;
  }

  .indicator--bottom {
    bottom: -5px;
  }
</style>
