<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const chipRef = useTemplateRef<HTMLElement>('chipRef');
  const { isDragging } = makeDraggable(chipRef);
</script>

<template>
  <div
    ref="chipRef"
    class="chip"
    :class="{ 'is-dragging': isDragging }"
  >
    <slot />
  </div>
</template>

<style scoped>
  .chip {
    padding: 0.5rem 1.25rem;
    border-radius: 20px;
    background-color: var(--vp-c-brand-1);
    color: var(--vp-c-bg);
    font-weight: 500;
    font-size: 0.875rem;
    cursor: grab;
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    width: fit-content;

    /* See Mobile & Touch section */
    touch-action: none;
    user-select: none;
  }

  .chip:active {
    cursor: grabbing;
  }

  .chip.is-dragging {
    opacity: 0.4;
  }
</style>
