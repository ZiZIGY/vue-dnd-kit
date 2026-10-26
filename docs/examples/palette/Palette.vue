<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import BlockRow from './BlockRow.vue';
import { copyBlock, type PageBlock } from './blocks';

const templates = ref<PageBlock[]>([
  { id: 'title', kind: 'title', name: 'Title' },
  { id: 'text', kind: 'text', name: 'Text' },
  { id: 'image', kind: 'image', name: 'Image' },
  { id: 'button', kind: 'button', name: 'Button' },
]);

const list = useTemplateRef<HTMLElement>('list');
// A palette: copies go out (`pull: 'clone'` with `clone`), nothing comes in, and its own
// order stays as it is.
const { items } = makeSortableList(list, {
  id: 'palette',
  items: templates,
  group: { name: 'blocks', pull: 'clone', put: false },
  sort: false,
  clone: copyBlock,
});
</script>

<template>
  <section class="side">
    <h4>Blocks</h4>
    <ul ref="list" class="rows">
      <BlockRow v-for="block in items" :key="block.id" :block="block" />
    </ul>
  </section>
</template>

<style scoped>
.side {
  width: 160px;
}

h4 {
  margin: 0 0 10px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
