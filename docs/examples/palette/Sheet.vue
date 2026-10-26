<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import BlockRow from './BlockRow.vue';
import { copyBlock, type PageBlock } from './blocks';

const blocks = ref<PageBlock[]>([
  { id: 'hero-title', kind: 'title', name: 'Title' },
  { id: 'hero-text', kind: 'text', name: 'Text' },
]);

const sheet = useTemplateRef<HTMLElement>('sheet');
const list = useTemplateRef<HTMLElement>('list');
// The same group as the palette, so it takes the palette's copies. With `clone`, an
// Alt-drag duplicates a block; `dropOutside: 'remove'` deletes one dropped off the page.
const { items, isAccepting } = makeSortableList(list, {
  id: 'page',
  items: blocks,
  group: 'blocks',
  clone: copyBlock,
  dropOutside: 'remove',
  dropzone: sheet,
});
</script>

<template>
  <section ref="sheet" class="sheet" :class="{ accepting: isAccepting }">
    <h4>Page</h4>
    <ul ref="list" class="rows">
      <BlockRow v-for="block in items" :key="block.id" :block="block" wide />
    </ul>
    <p v-if="!items.length" class="empty">Drop blocks here</p>
  </section>
</template>

<style scoped>
.sheet {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 280px;
  min-height: 260px;
  padding: 14px;
  border: 1.5px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition: border-color 0.2s;
}

.sheet.accepting {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
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

.empty {
  margin: auto 0;
  font-size: 13px;
  text-align: center;
  opacity: 0.5;
}
</style>
