<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ item: { id: string; title: string; minutes: number }; number: number }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.item });
</script>

<template>
  <li ref="el" class="item">
    <span class="number" aria-hidden="true">{{ number }}</span>
    <span class="title">{{ item.title }}</span>
    <span class="minutes">{{ item.minutes }} min</span>
  </li>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.item:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* The slot the item will land in: an empty outline. */
.item[data-dnd-placeholder] {
  opacity: 1;
  background: transparent;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 70%, transparent);
}

.item[data-dnd-placeholder] > * {
  visibility: hidden;
}

/* The copy that follows the drag was taken at pickup: its number would be stale. */
[data-dnd-overlay] .number {
  visibility: hidden;
}

.number {
  width: 18px;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

.title {
  flex: 1;
  font-weight: 500;
}

.minutes {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}
</style>
