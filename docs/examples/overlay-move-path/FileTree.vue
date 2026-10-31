<script setup lang="ts">
import { inject, ref, useTemplateRef } from 'vue';
import { makeSortableTree, type Key } from '@vue-dnd-kit/core';
import TreeRow from './TreeRow.vue';
import MoveOverlay from './MoveOverlay.vue';
import { FILES } from './files';

const files = inject(FILES)!;
const collapsed = ref(new Set<Key>());

const INDENT = 18;
const root = useTemplateRef<HTMLElement>('root');
const { items } = makeSortableTree(root, {
  items: files,
  indentation: INDENT,
  collapsed,
  canNest: (_node, parent) => !!parent.folder,
  // The overlay says where the file would go: its `to` prop, live.
  overlay: MoveOverlay,
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
