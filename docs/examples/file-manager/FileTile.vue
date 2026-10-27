<script setup lang="ts">
import { inject, useTemplateRef } from 'vue';
import { makeSortableItem, useDnD } from '@vue-dnd-kit/core';
import FileIcon from './FileIcon.vue';
import { FILES, formatSize, isFolder, items, type Entry } from './files';
import { useFolderDrop } from './useFolderDrop';

const props = defineProps<{ entry: Entry }>();
const files = inject(FILES)!;
const { selection } = useDnD();

const el = useTemplateRef<HTMLElement>('el');
// `selected` is bound to the provider's selection: drag a selected tile and the others come along.
const { selected } = makeSortableItem(el, { item: () => props.entry });
// A folder's tile takes drops too: dropped on its middle, files go inside.
const isTarget = useFolderDrop(el, () => (isFolder(props.entry) ? props.entry : null));

// Click selects this tile alone, Ctrl/Cmd+click adds or removes it, a double click opens a folder.
const onClick = (event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
  else selection.set([props.entry.id]);
};
const onOpen = () => {
  if (isFolder(props.entry)) files.open(props.entry);
};
</script>

<template>
  <li ref="el" class="tile" :class="{ selected, target: isTarget }" @click="onClick" @dblclick="onOpen">
    <FileIcon :entry="entry" :open="isTarget" />
    <span class="name">{{ entry.name }}</span>
    <span class="meta">{{ isFolder(entry) ? items(entry.children.length) : formatSize(entry.size) }}</span>
  </li>
</template>

<style scoped>
.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  height: 120px;
  padding: 10px 6px 8px;
  border: 1px solid transparent;
  border-radius: 12px;
  /* Its own background: the overlay, a copy of the tile, isn't see-through. */
  background: Canvas;
  cursor: grab;
  user-select: none;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.tile:hover {
  background: color-mix(in srgb, currentColor 5%, Canvas);
}

.tile:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.tile.selected {
  border-color: color-mix(in srgb, #42b883 45%, transparent);
  background: color-mix(in srgb, #42b883 13%, Canvas);
}

/* A folder that takes what is held over it; the ring shows around the overlay on top. */
.tile.target {
  border-color: #42b883;
  background: color-mix(in srgb, #42b883 24%, Canvas);
  outline: 2px solid #42b883;
  outline-offset: 3px;
}

/* The slot the dragged tile lands in. */
.tile[data-dnd-placeholder] {
  opacity: 1;
}

.tile[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: -1px;
  border: 1.5px dashed color-mix(in srgb, currentColor 30%, transparent);
  border-radius: inherit;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

/* Lifted while it travels. */
[data-dnd-overlay] .tile {
  border-color: color-mix(in srgb, currentColor 12%, transparent);
  box-shadow: 0 12px 24px -10px rgb(0 0 0 / 0.45);
}

.name {
  display: -webkit-box;
  overflow: hidden;
  max-width: 100%;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  text-align: center;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.meta {
  margin-top: auto;
  font: 10px/1.2 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}
</style>
