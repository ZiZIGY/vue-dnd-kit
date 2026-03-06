<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{ label: string; color: string }>();

  const itemRef = useTemplateRef<HTMLElement>('itemRef');
  const { isDragging } = makeDraggable(itemRef);
</script>

<template>
  <div
    ref="itemRef"
    class="item"
    :class="{ 'item--dragging': isDragging }"
    :style="{ '--item-color': props.color }"
  >
    {{ label }}
  </div>
</template>

<style scoped>
  .item {
    padding: 0.6rem 1.1rem;
    border-radius: 8px;
    background: var(--item-color);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: grab;
    user-select: none;
    touch-action: none;
    transition: opacity 0.15s;
  }

  .item:active {
    cursor: grabbing;
  }

  .item--dragging {
    opacity: 0.25;
  }
</style>
