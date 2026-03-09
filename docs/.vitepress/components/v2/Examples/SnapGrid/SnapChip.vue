<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const el = useTemplateRef<HTMLElement>('el');
  const { isDragging } = makeDraggable(el);
</script>

<template>
  <div
    ref="el"
    class="chip"
    :class="{ ghost: isDragging }"
  >
    <slot />
  </div>
</template>

<style scoped>
  .chip {
    padding: 0.625rem 1.375rem;
    border-radius: 10px;
    background: var(--vp-c-brand-1);
    color: var(--vp-c-bg);
    font-weight: 600;
    font-size: 0.875rem;
    user-select: none;
    touch-action: none;
    cursor: grab;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
    transition: box-shadow 0.15s;
  }

  .chip:active {
    cursor: grabbing;
  }

  .chip.ghost {
    opacity: 0.25;
    box-shadow: none;
  }
</style>
