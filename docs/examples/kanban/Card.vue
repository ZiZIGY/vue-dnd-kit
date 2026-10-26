<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ card: { id: string; title: string; tag: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.card });

const TAGS: Record<string, string> = {
  Design: '#f59e0b',
  Docs: '#3b82f6',
  Video: '#a855f7',
  Core: '#42b883',
  A11y: '#ec4899',
};
</script>

<template>
  <li ref="el" class="card">
    <span class="tag" :style="{ '--tag': TAGS[card.tag] }">{{ card.tag }}</span>
    <span class="title">{{ card.title }}</span>
    <span class="id">{{ card.id.toUpperCase() }}</span>
  </li>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 9%, transparent),
    0 2px 4px -2px rgb(0 0 0 / 0.25);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.card:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* The slot the dragged card will land in. */
.card[data-dnd-placeholder] {
  opacity: 1;
}

.card[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1.5px dashed color-mix(in srgb, currentColor 30%, transparent);
  border-radius: inherit;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.tag {
  padding: 3px 7px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--tag) 16%, transparent);
  color: var(--tag);
  font-size: 11px;
  font-weight: 600;
}

.title {
  font-weight: 500;
  line-height: 1.35;
}

.id {
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.45;
}
</style>
