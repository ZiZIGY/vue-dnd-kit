<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { motion } from 'motion-v';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{
    id: string;
    group?: string;
    label: string;
    color: 'blue' | 'purple' | 'neutral';
  }>();

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  const { isDragging } = makeDraggable(itemRef, {
    groups: props.group ? [props.group] : [],
    data: () => props.id,
  });
</script>

<template>
  <motion.div
    ref="itemRef"
    class="item"
    :class="[`item--${props.color}`]"
    :initial="{ scale: 0.9, opacity: 0 }"
    :animate="{ scale: 1, opacity: 1 }"
    :style="{ opacity: isDragging ? 0 : 1 }"
  >
    <span class="badge">{{ props.group ?? 'global' }}</span>
    <span class="label">{{ props.label }}</span>
  </motion.div>
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
  }

  .item:active {
    cursor: grabbing;
  }

  .item--blue {
    background-color: rgba(59, 130, 246, 0.15);
    border: 1px solid rgba(59, 130, 246, 0.4);
    color: rgb(147, 197, 253);
  }

  .item--purple {
    background-color: rgba(168, 85, 247, 0.15);
    border: 1px solid rgba(168, 85, 247, 0.4);
    color: rgb(196, 154, 250);
  }

  .item--neutral {
    background-color: rgba(148, 163, 184, 0.12);
    border: 1px solid rgba(148, 163, 184, 0.3);
    color: var(--vp-c-text-1);
  }

  .badge {
    font-size: 0.65rem;
    font-weight: 600;
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.8;
  }
</style>
