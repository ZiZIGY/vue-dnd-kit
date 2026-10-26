<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableTree, type Key } from '@vue-dnd-kit/core';
import TreeRow from './TreeRow.vue';
import type { FileNode } from './types';

const files = ref<FileNode[]>([
  {
    id: 'src',
    name: 'src',
    folder: true,
    children: [
      {
        id: 'components',
        name: 'components',
        folder: true,
        children: [
          { id: 'board', name: 'Board.vue' },
          { id: 'card', name: 'Card.vue' },
        ],
      },
      { id: 'composables', name: 'composables', folder: true, children: [{ id: 'use-board', name: 'useBoard.ts' }] },
      { id: 'app', name: 'App.vue' },
      { id: 'main', name: 'main.ts' },
    ],
  },
  { id: 'public', name: 'public', folder: true, children: [{ id: 'logo', name: 'logo.svg' }] },
  { id: 'readme', name: 'README.md' },
  { id: 'package', name: 'package.json' },
]);
const collapsed = ref(new Set<Key>());

const INDENT = 18;
const root = useTemplateRef<HTMLElement>('root');
// Drag sideways to change the depth, or hover the middle of a folder to drop into it.
const { items } = makeSortableTree(root, {
  items: files,
  indentation: INDENT,
  collapsed,
  canNest: (_node, parent) => !!parent.folder,
});

const toggle = (key: Key) => (collapsed.value.has(key) ? collapsed.value.delete(key) : collapsed.value.add(key));
</script>

<template>
  <section class="explorer">
    <header>Explorer</header>
    <div ref="root" class="tree">
      <TreeRow v-for="node in items" :key="node.key" :node="node" :indent="INDENT" @toggle="toggle" />
    </div>
  </section>
</template>

<style scoped>
.explorer {
  width: 300px;
  max-width: 100%;
  margin: 0 auto;
  padding: 6px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

header {
  padding: 10px 10px 8px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

.tree {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
</style>
