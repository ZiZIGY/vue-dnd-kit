<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { motion } from 'motion-v';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  const { isDragging } = makeDraggable(itemRef, {
    dragHandle: '.drag-handle',
  });
</script>

<template>
  <motion.div
    ref="itemRef"
    class="item"
    :initial="{ scale: 0.9, opacity: 0 }"
    :animate="{ scale: 1, opacity: 1 }"
    :class="{ 'is-dragging': isDragging }"
  >
    <button
      class="drag-handle"
      aria-label="Drag handle"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle
          cx="5"
          cy="4"
          r="1.25"
        />
        <circle
          cx="5"
          cy="8"
          r="1.25"
        />
        <circle
          cx="5"
          cy="12"
          r="1.25"
        />
        <circle
          cx="10"
          cy="4"
          r="1.25"
        />
        <circle
          cx="10"
          cy="8"
          r="1.25"
        />
        <circle
          cx="10"
          cy="12"
          r="1.25"
        />
      </svg>
    </button>
    <span class="label"><slot /></span>
  </motion.div>
</template>

<style scoped>
  .item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
    border-radius: 8px;
    background-color: var(--vp-c-brand-1);
    color: var(--vp-c-bg);
    font-weight: 500;
    width: fit-content;
  }

  .drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.125rem;
    border-radius: 4px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: grab;
    flex-shrink: 0;
    transition: color 0.15s;

    /* See Mobile & Touch section */
    touch-action: none;
    user-select: none;
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  .drag-handle:hover {
    color: #fff;
  }

  .label {
    font-size: 0.875rem;
  }

  .item.is-dragging {
    opacity: 0.4 !important;
  }
</style>
