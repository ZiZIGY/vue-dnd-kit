<script setup lang="ts" generic="T extends Record<string, unknown>">
  import { useDraggable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const {
    items,
    itemIndex,
    groups = ['kanban-column-body'],
    backendId,
    columnId,
  } = defineProps<{
    item: T;
    items: T[];
    itemIndex: number;
    groups?: string[];
    backendId: number;
    columnId: number;
  }>();

  const { elementRef, handleDragStart, isDragging } = useDraggable({
    groups,
    data: computed(() => ({
      source: items,
      index: itemIndex,
      backendId,
      columnId,
    })),
  });
</script>

<template>
  <li
    class="vue-dnd-kanban-item"
    :class="{ 'vue-dnd-kanban-item-dragging': isDragging }"
    ref="elementRef"
    @pointerdown.self="handleDragStart"
  >
    <slot :item="item" />
  </li>
</template>
