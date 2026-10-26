<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem, type FlatNode, type Key } from '@vue-dnd-kit/core';
import type { FileNode } from './types';

const props = defineProps<{ node: FlatNode<FileNode>; indent: number }>();
const emit = defineEmits<{ toggle: [key: Key] }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { id: () => props.node.key });
</script>

<template>
  <div ref="el" class="row" :style="{ paddingLeft: `${10 + node.depth * indent}px` }">
    <button
      v-if="node.item.folder"
      type="button"
      class="toggle"
      :aria-label="node.collapsed ? 'Expand' : 'Collapse'"
      @click="emit('toggle', node.key)"
    >
      {{ node.collapsed ? '▸' : '▾' }}
    </button>
    <span v-else class="toggle" />
    <span class="icon" :class="{ folder: node.item.folder }" />
    {{ node.item.name }}
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding-right: 10px;
  border-radius: 6px;
  font: 13px/1 ui-monospace, monospace;
  cursor: grab;
  user-select: none;
}

.row:hover {
  background: color-mix(in srgb, currentColor 6%, transparent);
}

.toggle {
  width: 14px;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
}

.icon {
  width: 12px;
  height: 14px;
  border: 1.5px solid currentColor;
  border-radius: 2px;
  opacity: 0.5;
}

.icon.folder {
  height: 11px;
  border: 0;
  background: #42b883;
  opacity: 1;
}
</style>
