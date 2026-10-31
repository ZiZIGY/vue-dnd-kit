<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import type { Task } from '../types';

  const props = defineProps<{ card: Task }>();
  const el = useTemplateRef<HTMLElement>('el');
  const { selected, isDragging } = makeSortableItem(el, { id: () => props.card.id });

  // Ctrl/Cmd+click toggles the card; a plain click leaves the selection alone.
  const onClick = (event: MouseEvent) => {
    if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
  };
</script>

<template>
  <li
    ref="el"
    class="card"
    :class="{ selected, dragging: isDragging }"
    :data-id="card.id"
    @click="onClick"
  >
    {{ card.title }}
  </li>
</template>
