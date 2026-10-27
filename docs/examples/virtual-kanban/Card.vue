<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import type { Card } from './cards';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');
// A getter: the virtualizer recycles components, and the card may come from another column.
makeSortableItem(el, { id: () => props.card.id });
</script>

<template>
  <article ref="el" class="card">
    <strong>{{ card.title }}</strong>
    <p v-if="card.note">{{ card.note }}</p>
    <footer>
      <span class="id">{{ card.id }}</span>
      <span class="points">{{ card.points }} pt</span>
    </footer>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 11px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 9%, transparent),
    0 2px 4px -2px rgb(0 0 0 / 0.25);
  font-size: 12.5px;
  cursor: grab;
  user-select: none;
}

.card:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

[data-dnd-overlay='dragging'] .card {
  rotate: 2deg;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 14%, transparent),
    0 18px 30px -14px rgb(0 0 0 / 0.55);
}

/* The slot keeps the card's height: an empty, dashed box. */
.card[data-dnd-placeholder] {
  box-shadow: none;
}

.card[data-dnd-placeholder] > * {
  visibility: hidden;
}

.card[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1.5px dashed color-mix(in srgb, currentColor 28%, transparent);
  border-radius: inherit;
}

strong {
  font-weight: 500;
  line-height: 1.35;
}

p {
  margin: 0;
  padding: 4px 7px;
  border-radius: 6px;
  background: color-mix(in srgb, currentColor 6%, transparent);
  font-size: 11.5px;
  opacity: 0.8;
}

footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
}

.id {
  opacity: 0.45;
}

.points {
  padding: 3px 6px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
}
</style>
