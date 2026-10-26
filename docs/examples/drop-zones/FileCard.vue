<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';
import type { DeskFile } from './types';

const props = defineProps<{ file: DeskFile }>();
const el = useTemplateRef<HTMLElement>('el');
// A plain draggable: its `type` says which drop targets take it.
const { isDragging } = makeDraggable(el, { id: () => props.file.id, type: () => props.file.kind });
</script>

<template>
  <div ref="el" class="file" :class="[file.kind, { dragging: isDragging }]">
    <span class="thumb" aria-hidden="true">
      <svg v-if="file.kind === 'image'" viewBox="0 0 40 30">
        <circle cx="29" cy="9" r="4" fill="rgb(255 255 255 / 0.75)" />
        <path d="M0 30V21l11-8 9 6 9-7 11 9v9z" fill="rgb(0 0 0 / 0.22)" />
      </svg>
      <svg v-else viewBox="0 0 40 30">
        <path d="M13 4h10l5 5v17H13z" fill="#fff" />
        <path d="M16 13h9M16 17h9M16 21h6" stroke="#3b82f6" stroke-width="1.6" stroke-linecap="round" />
      </svg>
    </span>
    <span class="text">
      <span class="name">{{ file.name }}</span>
      <span class="size">{{ file.size }}</span>
    </span>
  </div>
</template>

<style scoped>
/* The same size in every folder: a drop only moves it, it never has to resize. */
.file {
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  width: 172px;
  height: 48px;
  padding: 6px 10px 6px 6px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 10%, transparent),
    0 2px 4px -2px rgb(0 0 0 / 0.25);
  cursor: grab;
  user-select: none;
}

.file:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* Where the file was picked up from, while it travels. */
.file.dragging {
  opacity: 0.3;
}

.thumb {
  flex: none;
  overflow: hidden;
  width: 36px;
  height: 36px;
  border-radius: 7px;
}

.image .thumb {
  background: linear-gradient(160deg, #6ee7b7, #0e7490);
}

.doc .thumb {
  background: linear-gradient(160deg, #bfdbfe, #3b82f6);
}

.thumb svg {
  display: block;
  width: 100%;
  height: 100%;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.name {
  overflow: hidden;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.size {
  font: 10px/1.2 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}
</style>
