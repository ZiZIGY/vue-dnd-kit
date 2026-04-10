<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{
    id: string;
    label: string;
  }>();

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  const { isDragging } = makeDraggable(itemRef, {
    data: () => props.id,
  });
</script>

<template>
  <button
    ref="itemRef"
    class="item"
    :class="{ 'item--dragging': isDragging }"
    :aria-grabbed="isDragging"
    :aria-label="`Drag ${props.label}`"
    type="button"
  >
    <span class="kbd-hint">⎵ / ↵</span>
    {{ props.label }}
  </button>
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
    background-color: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.4);
    color: rgb(165, 180, 252);
    transition: box-shadow 0.15s, background-color 0.15s;
    width: 100%;
    text-align: left;

    /* See Mobile & Touch section */
    touch-action: none;
    user-select: none;
  }

  .item:focus-visible {
    outline: 2px solid rgba(99, 102, 241, 0.8);
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
  }

  .item:active {
    cursor: grabbing;
  }

  .item--dragging {
    opacity: 0;
  }

  .kbd-hint {
    font-size: 0.6rem;
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(165, 180, 252, 0.6);
    letter-spacing: 0.02em;
    font-family: monospace;
    flex-shrink: 0;
  }
</style>
