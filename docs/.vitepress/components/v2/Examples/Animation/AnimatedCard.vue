<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { motion } from 'motion-v';
  import { makeDraggable } from '@vue-dnd-kit/core';
  import type { IPlacement } from '@vue-dnd-kit/core';

  interface Card {
    id: number;
    label: string;
    emoji: string;
    color: string;
  }

  const props = defineProps<{
    card: Card;
    index: number;
    items: Card[];
  }>();

  const cardRef = useTemplateRef<HTMLElement>('cardRef');

  const { isDragging, isDragOver } = makeDraggable(
    cardRef,
    {
      dragHandle: '.handle',
    },
    () => [props.index, props.items]
  );

  const placement = computed<IPlacement | undefined>(() => isDragOver.value);
</script>

<template>
  <motion.div
    ref="cardRef"
    class="card"
    :class="{ 'is-dragging': isDragging }"
    :style="{ '--card-color': card.color }"
    :initial="{ opacity: 0, x: -16 }"
    :animate="{ opacity: 1, x: 0 }"
    :transition="{ type: 'spring', stiffness: 380, damping: 28 }"
  >
    <div
      v-if="placement?.top"
      class="indicator indicator--top"
      aria-hidden
    />
    <div
      v-if="placement?.bottom"
      class="indicator indicator--bottom"
      aria-hidden
    />

    <span class="handle">⠿</span>
    <span class="emoji">{{ card.emoji }}</span>
    <span class="label">{{ card.label }}</span>
  </motion.div>
</template>

<style scoped>
  .card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-radius: 0.75rem;
    background: color-mix(in srgb, var(--card-color) 10%, var(--vp-c-bg));
    border: 1px solid color-mix(in srgb, var(--card-color) 25%, transparent);
    transition: opacity 0.15s ease;
  }

  .card.is-dragging {
    opacity: 0 !important;
  }

  .handle {
    color: color-mix(in srgb, var(--card-color) 60%, transparent);
    font-size: 1.1rem;
    flex-shrink: 0;
    cursor: grab;

    /* See Mobile & Touch section */
    touch-action: none;
    user-select: none;
  }

  .card:active .handle {
    cursor: grabbing;
  }

  .emoji {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--vp-c-text-1);
  }

  .indicator {
    position: absolute;
    left: 8px;
    right: 8px;
    height: 2px;
    border-radius: 2px;
    background: var(--card-color);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--card-color) 35%, transparent);
    pointer-events: none;
    z-index: 1;
  }

  .indicator--top {
    top: -5px;
  }

  .indicator--bottom {
    bottom: -5px;
  }
</style>
