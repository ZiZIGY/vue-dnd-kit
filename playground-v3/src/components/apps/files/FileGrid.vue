<script setup lang="ts">
  import { inject, useTemplateRef } from 'vue';
  import { makeSelectionArea, makeSortableList } from '@vue-dnd-kit/core';
  import FileTile from './FileTile.vue';
  import { FILE_MANAGER } from './fs';

  const fm = inject(FILE_MANAGER)!;

  // The grid sorts whatever folder is open, folders and files together: its `items`
  // is a writable computed.
  const grid = useTemplateRef<HTMLElement>('grid');
  const { items: tiles } = makeSortableList(grid, {
    id: 'grid',
    items: fm.currentEntries,
    group: 'files',
    strategy: 'grid',
  });

  // Rubber band over the whole content area: it replaces the provider's selection
  // with the tiles it crosses, which is what a multi-drag takes.
  const area = useTemplateRef<HTMLElement>('area');
  const { isSelecting, style: bandStyle } = makeSelectionArea(area, { strategy: 'select', accept: ['file', 'folder'] });
</script>

<template>
  <div
    ref="area"
    class="fm-area"
    data-testid="file-area"
  >
    <ul
      ref="grid"
      class="fm-grid"
      data-testid="file-grid"
    >
      <FileTile
        v-for="entry in tiles"
        :key="entry.id"
        :entry="entry"
      />
    </ul>
    <p
      v-if="!tiles.length"
      class="fm-empty"
    >
      This folder is empty. Drop files or folders on it in the tree to move them here.
    </p>
    <div
      v-if="isSelecting"
      class="fm-band"
      data-testid="band"
      :style="bandStyle"
    />
  </div>
</template>

<style scoped>
  /* The selection area: relative, so the band can be positioned inside it. */
  .fm-area {
    position: relative;
    flex: 1;
    padding: 16px;
    overflow: auto;
    background: #f8fafc;
  }

  .fm-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 96px);
    gap: 12px;
    min-height: 104px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .fm-empty {
    color: #94a3b8;
  }

  .fm-band {
    background: rgb(37 99 235 / 0.12);
    border: 1px solid #2563eb;
  }
</style>
