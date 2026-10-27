<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import type { Task } from './rows';

const props = defineProps<{ task: Task; height: number }>();
const el = useTemplateRef<HTMLElement>('el');
// A getter: the virtual list may hand this component another task.
makeSortableItem(el, { id: () => props.task.id });
</script>

<template>
  <div ref="el" class="row" :style="{ height: `${height}px` }">
    <span class="number">#{{ task.id.slice(1) }}</span>
    <span class="title">{{ task.title }}</span>
    <span class="owner">{{ task.owner }}</span>
  </div>
</template>

<style scoped>
/* The height is the virtual list's row height: borders inside it, no margins. */
.row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 7%, transparent);
  background: Canvas;
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

/* The slot the dragged row will land in: same height, no content. */
.row[data-dnd-placeholder] > * {
  visibility: hidden;
}

.row[data-dnd-placeholder] {
  background: color-mix(in srgb, #42b883 8%, Canvas);
}

.number {
  width: 52px;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.45;
}

.title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.owner {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font-size: 10px;
  font-weight: 600;
}
</style>
