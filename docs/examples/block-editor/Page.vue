<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableTree, type Key } from '@vue-dnd-kit/core';
import BlockRow from './BlockRow.vue';
import Editable from './Editable.vue';
import { createPage } from './blocks';

const title = ref('Release plan');
const blocks = ref(createPage());
const collapsed = ref(new Set<Key>());

const INDENT = 24;
const page = useTemplateRef<HTMLElement>('page');
const root = useTemplateRef<HTMLElement>('root');
// The blocks are a tree: a toggle's blocks are its children, shown below it one level in.
// `placeholder: 'indicator'`: nothing moves while you drag, a line shows where the block
// goes. Hover a toggle's middle, or drag sideways, to drop inside it. The whole page
// takes drops, below the last block too.
const { items } = makeSortableTree(root, {
  id: 'page',
  items: blocks,
  group: 'blocks',
  placeholder: 'indicator',
  indentation: INDENT,
  maxDepth: 2,
  canNest: (_block, parent) => parent.kind === 'toggle',
  collapsed,
  dropzone: page,
});

const toggle = (key: Key) => (collapsed.value.has(key) ? collapsed.value.delete(key) : collapsed.value.add(key));
</script>

<template>
  <article ref="page" class="page">
    <Editable v-model="title" tag="h2" placeholder="Untitled" />
    <div ref="root" class="blocks">
      <BlockRow v-for="node in items" :key="node.key" :node="node" :indent="INDENT" @toggle="toggle" />
    </div>
  </article>
</template>

<style scoped>
.page {
  box-sizing: border-box;
  flex: 1 1 324px;
  min-width: 0;
  max-width: 560px;
  height: 420px;
  padding: 22px 24px 32px 12px;
  overflow: auto;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 14px;
  background: Canvas;
  box-shadow: 0 24px 48px -28px rgb(0 0 0 / 0.5);
}

h2 {
  margin: 0 0 10px 28px;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.blocks {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
