<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: { id: string; title: string; done: boolean } }>();
const el = useTemplateRef<HTMLElement>('el');
const { selected } = makeSortableItem(el, { item: () => props.task });

// Ctrl/Cmd+click selects several; dragging a selected row drags them all.
const onClick = (event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
};
</script>

<template>
  <!-- No state classes: every drag state below is styled from attributes alone. -->
  <li ref="el" class="row" :aria-selected="selected" @click="onClick">
    <span class="title" :class="{ done: task.done }">{{ task.title }}</span>
    <!-- Left out of the overlay's copy of the row. -->
    <button type="button" data-dnd-no-clone :aria-label="`Mark ${task.title} done`" @click.stop="task.done = !task.done">✓</button>
  </li>
</template>

<style scoped>
.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 6px 0 12px;
  border-radius: 9px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 11%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.row[aria-selected='true'] {
  background: color-mix(in srgb, #42b883 14%, Canvas);
  box-shadow: 0 0 0 1.5px #42b883;
}

/* The slot a dragged row will land in: a striped gap. */
.row[data-dnd-placeholder] {
  opacity: 1;
  background: repeating-linear-gradient(-45deg, color-mix(in srgb, #42b883 16%, transparent) 0 6px, transparent 6px 12px);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 50%, transparent);
}

.row[data-dnd-placeholder] > * {
  visibility: hidden;
}

/* Selected rows left in place by a multi-drag (`multiple: 'gaps'`). */
.row[data-dnd-dragging] {
  opacity: 0.4;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 30%, transparent);
  background: transparent;
}

/* The copy in the overlay: an accent ring and a shadow while it travels, none as it lands. */
[data-dnd-overlay='dragging'] .row {
  box-shadow:
    0 0 0 1.5px #42b883,
    0 14px 24px -10px rgb(0 0 0 / 0.55);
}

.title {
  flex: 1;
}

.title.done {
  text-decoration: line-through;
  opacity: 0.5;
}

button {
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: none;
  color: inherit;
  opacity: 0.4;
  cursor: pointer;
}

button:hover {
  background: color-mix(in srgb, currentColor 10%, transparent);
  opacity: 1;
}
</style>
