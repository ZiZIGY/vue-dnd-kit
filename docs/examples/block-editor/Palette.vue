<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import PaletteItem from './PaletteItem.vue';
import { KINDS, createBlock, type Block, type BlockKind } from './blocks';

// One template per kind: blocks themselves, so the palette and the page are lists of one group.
const templates = ref<Block[]>((Object.keys(KINDS) as BlockKind[]).map((kind) => ({ id: `new-${kind}`, kind, text: '' })));

const list = useTemplateRef<HTMLElement>('list');
// Copies go out (`pull: 'clone'`, a new block each), nothing comes in, the order stays.
const { items } = makeSortableList(list, {
  id: 'palette',
  items: templates,
  group: { name: 'blocks', pull: 'clone', put: false },
  sort: false,
  clone: (template) => createBlock(template.kind),
});
</script>

<template>
  <aside class="palette">
    <h4>Blocks</h4>
    <ul ref="list">
      <PaletteItem v-for="template in items" :key="template.id" :template="template" />
    </ul>
  </aside>
</template>

<style scoped>
.palette {
  flex: none;
  width: 176px;
}

/* Below the page when the editor is narrow, in columns. */
@container (max-width: 520px) {
  .palette {
    width: 100%;
  }
}

h4 {
  margin: 4px 0 10px 8px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
