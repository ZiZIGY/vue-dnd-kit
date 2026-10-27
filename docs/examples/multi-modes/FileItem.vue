<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ file: { id: string; name: string; kind: string; size: string }; tile: boolean }>();
const emit = defineEmits<{ pick: [event: MouseEvent] }>();
const el = useTemplateRef<HTMLElement>('el');
// `selected` reads the provider's selection: a selected file is drawn as such.
const { selected } = makeSortableItem(el, { item: () => props.file });

const COLORS: Record<string, string> = { pdf: '#ef4444', img: '#3b82f6', xls: '#42b883', doc: '#a855f7' };
</script>

<template>
  <!-- The click that ends a drag doesn't reach @click: a drop never changes the selection. -->
  <li ref="el" class="file" :class="{ selected, tile }" :style="{ '--kind': COLORS[file.kind] }" @click="emit('pick', $event)">
    <span class="icon">{{ file.kind }}</span>
    <span class="name">{{ file.name }}</span>
    <span class="size">{{ file.size }}</span>
  </li>
</template>

<style scoped>
.file {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 5px 10px;
  border-radius: 9px;
  background: Canvas;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 8%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.file.tile {
  flex-direction: column;
  gap: 6px;
  padding: 12px 6px 8px;
}

.file:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.file.selected {
  background: color-mix(in srgb, #42b883 14%, Canvas);
  box-shadow: inset 0 0 0 1.5px #42b883;
}

/* Where a dragged file lands. */
.file[data-dnd-placeholder] {
  opacity: 1;
  background: none;
  box-shadow: none;
  outline: 1.5px dashed color-mix(in srgb, currentColor 30%, transparent);
  outline-offset: -1.5px;
}

.file[data-dnd-placeholder] > * {
  visibility: hidden;
}

/* `multiple: 'gaps'`: the other dragged files wait in their places. */
.file[data-dnd-dragging] {
  opacity: 0.35;
}

.icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 22px;
  height: 26px;
  border-radius: 3px 8px 3px 3px;
  background: color-mix(in srgb, var(--kind) 18%, Canvas);
  color: var(--kind);
  font: 700 7px/1 ui-monospace, Menlo, Consolas, monospace;
  text-transform: uppercase;
}

.tile .icon {
  width: 36px;
  height: 42px;
  font-size: 9px;
}

.name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tile .name {
  max-width: 100%;
  font-size: 12px;
}

.size {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

.tile .size {
  display: none;
}
</style>
