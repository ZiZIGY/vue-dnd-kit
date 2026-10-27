<script setup lang="ts">
import { inject, useTemplateRef } from 'vue';
import { makeSelectionArea, makeSortableList } from '@vue-dnd-kit/core';
import FileTile from './FileTile.vue';
import { FILES, copyEntry, describe } from './files';

const files = inject(FILES)!;
const area = useTemplateRef<HTMLElement>('area');
const grid = useTemplateRef<HTMLElement>('grid');

// The open folder's files and folders, sorted in two dimensions. With `clone`, Alt-drag
// leaves a file where it is and drops a copy; the whole area takes drops.
const { items } = makeSortableList(grid, {
  id: 'grid',
  items: files.entries,
  strategy: 'grid',
  clone: (entry) => copyEntry(entry, true),
  dropzone: area,
  onDrop: (event) => {
    if (event.mode === 'copy') files.lastAction.value = `Added ${describe(event.items)}`;
  },
});

// Press on the empty space and draw a box: it selects the tiles it crosses, and only those.
const { isSelecting, style } = makeSelectionArea(area, { strategy: 'select' });
</script>

<template>
  <div ref="area" class="area">
    <ul ref="grid" class="grid">
      <FileTile v-for="entry in items" :key="entry.id" :entry="entry" />
    </ul>
    <p v-if="!items.length" class="empty">This folder is empty</p>
    <div v-if="isSelecting" class="band" :style="style" />
  </div>
</template>

<style scoped>
/* The selection area: positioned, so the band can be placed in it. */
.area {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 12px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.empty {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  font-size: 13px;
  opacity: 0.45;
  pointer-events: none;
}

.band {
  border: 1px solid #42b883;
  border-radius: 3px;
  background: color-mix(in srgb, #42b883 15%, transparent);
}
</style>
