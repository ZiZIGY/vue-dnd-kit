<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { motion } from 'motion-v';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{
    label: string;
    requireAlt?: boolean;
  }>();

  const cardRef = useTemplateRef<HTMLElement>('cardRef');

  const { isDragging } = makeDraggable(cardRef, {
    modifier: props.requireAlt
      ? { keys: ['AltLeft', 'AltRight'], method: 'some' }
      : undefined,
  });
</script>

<template>
  <motion.div
    ref="cardRef"
    class="modifier-card"
    :class="{ 'is-dragging': isDragging, 'has-modifier': requireAlt }"
    :initial="{ scale: 0.9, opacity: 0 }"
    :animate="{ scale: 1, opacity: 1 }"
  >
    <span class="card-label">{{ label }}</span>
    <span
      v-if="requireAlt"
      class="card-hint"
      >Hold Alt to drag</span
    >
  </motion.div>
</template>

<style scoped>
  .modifier-card {
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    background-color: var(--vp-c-brand-1);
    color: var(--vp-c-bg);
    font-weight: 500;
    font-size: 0.875rem;
    cursor: grab;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    text-align: center;

    /* See Mobile & Touch section */
    touch-action: none;
    user-select: none;
  }

  .modifier-card:active {
    cursor: grabbing;
  }

  .modifier-card.is-dragging {
    opacity: 0.3 !important;
  }

  .modifier-card.has-modifier {
    background-color: var(--vp-c-indigo-1, #6366f1);
  }

  .card-hint {
    font-size: 0.65rem;
    opacity: 0.75;
    font-weight: 400;
  }
</style>
