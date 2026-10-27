<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: { id: string; title: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" class="card"><span>{{ task.title }}</span></li>
</template>

<style scoped>
.card {
  padding: 9px 10px;
  border-radius: 8px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 11%, transparent);
  font-size: 12px;
  font-weight: 500;
  cursor: grab;
  user-select: none;
}

.card:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.card[data-dnd-placeholder] {
  opacity: 1;
  background: transparent;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 25%, transparent);
}

.card[data-dnd-placeholder] > * {
  visibility: hidden;
}
</style>
