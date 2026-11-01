<script setup lang="ts">
import { inject, ref, useTemplateRef } from 'vue';
import { makeSortableTree, type Key } from '@vue-dnd-kit/core';
import MoveOverlay from './MoveOverlay.vue';
import TreeRow from './TreeRow.vue';
import { MENU } from './menu';

const menu = inject(MENU)!;
const collapsed = ref(new Set<Key>());

const INDENT = 18;
const root = useTemplateRef<HTMLElement>('root');
const { items } = makeSortableTree(root, {
  items: menu,
  indentation: INDENT,
  collapsed,
  canNest: (_node, parent) => !!parent.section,
  // The overlay says where the page would go: its `to` prop, live.
  overlay: MoveOverlay,
});

const toggle = (key: Key) => (collapsed.value.has(key) ? collapsed.value.delete(key) : collapsed.value.add(key));
</script>

<template>
  <section class="editor">
    <header>Site menu</header>
    <div ref="root" class="tree">
      <TreeRow v-for="node in items" :key="node.key" :node="node" :indent="INDENT" @toggle="toggle" />
    </div>
  </section>
</template>

<style scoped>
.editor {
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
  font-size: 12px;
  font-weight: 600;
  opacity: 0.6;
}

.tree {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
</style>
