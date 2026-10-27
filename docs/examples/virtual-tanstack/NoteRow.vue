<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import type { Note } from './notes';

const props = defineProps<{ note: Note }>();
const el = useTemplateRef<HTMLElement>('el');
// A getter: the virtualizer may hand this component another note.
makeSortableItem(el, { id: () => props.note.id });

const COLORS: Record<Note['tag'], string> = { Idea: '#a855f7', Bug: '#f43f5e', Todo: '#42b883', Read: '#f59e0b' };
</script>

<template>
  <article ref="el" class="note">
    <header>
      <span class="tag" :style="{ '--tag': COLORS[note.tag] }">{{ note.tag }}</span>
      <strong>{{ note.title }}</strong>
      <span class="number">#{{ note.id.slice(1) }}</span>
    </header>
    <p>{{ note.body }}</p>
  </article>
</template>

<style scoped>
/* No margins: the virtualizer measures the slot around the row. */
.note {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 7%, transparent);
  background: Canvas;
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.note:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

/* The slot keeps the row's height: hide the content, tint the box. */
.note[data-dnd-placeholder] > * {
  visibility: hidden;
}

.note[data-dnd-placeholder] {
  background: color-mix(in srgb, #42b883 8%, Canvas);
}

/* The copy in hand. */
[data-dnd-overlay] .note {
  border: 0;
  border-radius: 10px;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 12%, transparent),
    0 18px 32px -16px rgb(0 0 0 / 0.5);
}

header {
  display: flex;
  align-items: center;
  gap: 8px;
}

strong {
  flex: 1;
  overflow: hidden;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tag {
  padding: 3px 6px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--tag) 16%, transparent);
  color: var(--tag);
  font-size: 10px;
  font-weight: 600;
}

.number {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.4;
}

p {
  margin: 0;
  line-height: 1.45;
  opacity: 0.7;
}
</style>
