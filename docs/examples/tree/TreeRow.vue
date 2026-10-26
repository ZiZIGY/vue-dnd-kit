<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem, type FlatNode, type Key } from '@vue-dnd-kit/core';
import FileIcon from './FileIcon.vue';
import type { FileNode } from './types';

const props = defineProps<{ node: FlatNode<FileNode>; indent: number }>();
const emit = defineEmits<{ toggle: [key: Key] }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { id: () => props.node.key });
</script>

<template>
  <div ref="el" class="row" :style="{ '--pad': `${8 + node.depth * indent}px` }">
    <!-- One guide per level, like an editor's file explorer. -->
    <span v-for="level in node.depth" :key="level" class="guide" :style="{ left: `${15 + (level - 1) * indent}px` }" />
    <button
      v-if="node.item.folder"
      type="button"
      class="toggle"
      :class="{ open: !node.collapsed }"
      :aria-label="node.collapsed ? 'Expand' : 'Collapse'"
      @click="emit('toggle', node.key)"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" /></svg>
    </button>
    <span v-else class="toggle" />
    <FileIcon :name="node.item.name" :folder="node.item.folder" :open="!node.collapsed" />
    <span class="name">{{ node.item.name }}</span>
  </div>
</template>

<style scoped>
.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px 0 var(--pad);
  border-radius: 6px;
  /* Its own background, the explorer's: the overlay, a copy of the row, isn't see-through. */
  background: color-mix(in srgb, currentColor 3%, Canvas);
  font: 13px/1 ui-monospace, Menlo, Consolas, monospace;
  cursor: grab;
  user-select: none;
}

.row:hover {
  background: color-mix(in srgb, currentColor 7%, Canvas);
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

/* The slot the dragged row will land in, at the depth it will land at. */
.row[data-dnd-placeholder] {
  opacity: 1;
}

.row[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: 2px 4px 2px calc(var(--pad) - 2px);
  border: 1.5px dashed #42b883;
  border-radius: 6px;
  background: color-mix(in srgb, #42b883 8%, Canvas);
}

.guide {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: color-mix(in srgb, currentColor 12%, transparent);
}

.toggle {
  display: grid;
  flex: none;
  place-items: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}

.toggle svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.55;
  transition: rotate 0.15s;
}

.toggle.open svg {
  rotate: 90deg;
}

.name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
