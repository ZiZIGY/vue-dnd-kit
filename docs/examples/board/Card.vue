<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import type { Task } from './types';

const props = defineProps<{ card: Task }>();
const el = useTemplateRef<HTMLElement>('el');
// `type`: what the trash takes. `selected` is bound to the provider's selection: drag a
// selected card and every selected card comes along.
const { selected } = makeSortableItem(el, { item: () => props.card, type: 'card' });

const onClick = (event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
};

const TAGS: Record<string, string> = {
  Feature: '#3b82f6',
  Bug: '#f43f5e',
  Design: '#a855f7',
  Docs: '#f59e0b',
};
</script>

<template>
  <li ref="el" class="card" :class="{ selected }" @click="onClick">
    <span class="title">{{ card.title }}</span>
    <span class="meta">
      <span class="tag" :style="{ '--tag': TAGS[card.tag] }">{{ card.tag }}</span>
      <span class="id">{{ card.id.toUpperCase() }}</span>
    </span>
  </li>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 11px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 9%, transparent),
    0 2px 4px -2px rgb(0 0 0 / 0.25);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.card:hover {
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 18%, transparent),
    0 2px 4px -2px rgb(0 0 0 / 0.25);
}

.card:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.card.selected {
  box-shadow:
    0 0 0 2px #42b883,
    0 2px 4px -2px rgb(0 0 0 / 0.25);
}

/* The slot the dragged card will land in: an empty, dashed box. */
.card[data-dnd-placeholder] {
  opacity: 1;
  box-shadow: none;
}

.card[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1.5px dashed color-mix(in srgb, currentColor 30%, transparent);
  border-radius: inherit;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.title {
  font-weight: 500;
  line-height: 1.35;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.tag {
  padding: 3px 7px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--tag) 16%, transparent);
  color: var(--tag);
  font-size: 11px;
  font-weight: 600;
}

.id {
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.45;
}
</style>
