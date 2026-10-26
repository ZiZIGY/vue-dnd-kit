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
      { id: 'app', name: 'App.vue' },
      { id: 'components', name: 'components', folder: true, children: [{ id: 'list', name: 'List.vue' }] },
    ],
  },
  { id: 'public', name: 'public', folder: true, children: [] },
  { id: 'readme', name: 'README.md' },
  { id: 'package', name: 'package.json' },
]);
const collapsed = ref(new Set<Key>());

const INDENT = 20;
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
  <div ref="root" class="tree">
    <TreeRow v-for="node in items" :key="node.key" :node="node" :indent="INDENT" @toggle="toggle" />
  </div>
</template>

<style scoped>
.tree {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 280px;
  margin: 0 auto;
}
</style>
