<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch, type Ref } from 'vue';
import { makeSortableTree, type Key } from '@vue-dnd-kit/core';
import LayerRow from './LayerRow.vue';
import { LAYERS, reveal, useBuilder } from './builder';
import { isColumn, isSection, levelOf, type Block, type Column, type LayerNode } from './page';

const builder = useBuilder();
const { sections, selected } = builder;

/** Rows have keys of their own: the canvas's lists already drag these ids, and keys are the provider's. */
const keyOf = (node: LayerNode) => `layer-${node.id}`;

/** Sections whose rows are closed: all but the selected one to start with. */
const collapsed = ref(new Set<Key>(sections.value.filter((section) => section.id !== selected.value).map(keyOf)));
const toggle = (key: Key) => (collapsed.value.has(key) ? collapsed.value.delete(key) : collapsed.value.add(key));

const root = useTemplateRef<HTMLElement>('root');
const tree = useTemplateRef<HTMLElement>('tree');
// The page itself, as a tree: the same sections, columns and blocks the canvas shows, so a
// row moved here moves on the page too. It stays still while you drag: a line shows where
// the row goes, and how deep.
const { items } = makeSortableTree(tree, {
  id: LAYERS,
  items: sections as Ref<LayerNode[]>,
  getKey: keyOf,
  getChildren: (node) => (isSection(node) ? node.columns : isColumn(node) ? node.blocks : undefined),
  setChildren: (node, children) => {
    if (isSection(node)) node.columns = children as Column[];
    else if (isColumn(node)) node.blocks = children as Block[];
  },
  // Blocks go into columns, nothing goes into blocks, sections stay at the top.
  canNest: (node, parent) => levelOf(node) === levelOf(parent) + 1,
  maxDepth: 2,
  collapsed,
  placeholder: 'indicator',
  indentation: 14,
  animateChanges: true,
  // A tree takes any row at its top level: a block let go there would become a section. It flies back.
  onBeforeDrop: (event) => (event.to.parentKey !== null || event.items.every(isSection) ? 'accept' : 'reject'),
});

// Selected on the canvas: its section and column open here, and its row comes into view.
watch(selected, async (id) => {
  const at = builder.find(id);
  if (!at) return;
  collapsed.value.delete(keyOf(at.section));
  if (at.column) collapsed.value.delete(keyOf(at.column));
  await nextTick();
  reveal(root.value, root.value?.querySelector(`[data-layer="${id}"]`));
});
</script>

<template>
  <div ref="root" class="layers">
    <h3>Outline</h3>
    <p class="hint">Drag rows to rearrange the page</p>
    <div ref="tree" class="tree">
      <LayerRow v-for="node in items" :key="node.key" :node="node" @toggle="toggle(node.key)" />
    </div>
    <p v-if="!items.length" class="empty">No sections yet.</p>
  </div>
</template>

<style scoped>
.layers {
  height: 100%;
  padding: 8px 8px 16px;
  overflow: auto;
  box-sizing: border-box;
}

h3 {
  margin: 10px 6px 2px;
  font: 600 10.5px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

.hint {
  margin: 4px 6px 10px;
  font-size: 11.5px;
  opacity: 0.5;
}

.tree {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.empty {
  margin: 24px 0;
  font-size: 12px;
  text-align: center;
  opacity: 0.5;
}
</style>
