<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ todo: { id: string; text: string; done: boolean } }>();
defineEmits<{ toggle: [] }>();
const el = useTemplateRef<HTMLElement>('el');
const grip = useTemplateRef<HTMLElement>('grip');

// Only the grip drags, so the checkbox and the text stay usable. `index` is the row's place
// in the draft: it changes while you drag.
const { index, isPlaceholder } = makeSortableItem(el, { item: () => props.todo, handle: grip });
</script>

<template>
  <li ref="el" class="row" :class="{ done: todo.done, slot: isPlaceholder }">
    <button ref="grip" type="button" class="grip" :aria-label="`Move “${todo.text}”`">⋮⋮</button>
    <input type="checkbox" :checked="todo.done" :aria-label="todo.text" @change="$emit('toggle')" />
    <span class="text">{{ todo.text }}</span>
    <span class="index">{{ index + 1 }}</span>
  </li>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px 9px 6px;
  border-radius: 10px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 9%, transparent);
  font-size: 14px;
}

/* The slot: same size, drawn as a dashed hole. */
.row.slot {
  opacity: 1;
  box-shadow: none;
  outline: 1.5px dashed color-mix(in srgb, currentColor 28%, transparent);
  outline-offset: -1.5px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.row.slot > * {
  visibility: hidden;
}

.grip {
  padding: 4px 3px;
  border: 0;
  border-radius: 5px;
  background: none;
  color: inherit;
  font-size: 13px;
  letter-spacing: -2px;
  opacity: 0.4;
  cursor: grab;
  touch-action: none;
}

.grip:hover,
.grip:focus-visible {
  background: color-mix(in srgb, currentColor 8%, transparent);
  opacity: 1;
}

.grip:focus-visible {
  outline: 2px solid #42b883;
}

input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #42b883;
}

.text {
  flex: 1;
}

.done .text {
  text-decoration: line-through;
  opacity: 0.5;
}

.index {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.4;
}
</style>
