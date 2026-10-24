<script setup lang="ts">
  import { computed, inject, useTemplateRef } from 'vue';
  import { makeSelectionArea, makeSortableList } from '@vue-dnd-kit/core';
  import FolderButton from './FolderButton.vue';
  import FileTile from './FileTile.vue';
  import { FILE_MANAGER, HOME, findPath } from './fs';

  const fm = inject(FILE_MANAGER)!;

  // The grid sorts whatever folder is open: its `items` is a writable computed.
  const grid = useTemplateRef<HTMLElement>('grid');
  const { items: tiles } = makeSortableList(grid, {
    id: 'grid',
    items: fm.currentFiles,
    group: 'files',
    strategy: 'grid',
  });

  // Rubber band over the whole content area: it replaces the provider's selection
  // with the files it crosses, which is what a multi-drag takes.
  const area = useTemplateRef<HTMLElement>('area');
  const { isSelecting, style: bandStyle } = makeSelectionArea(area, { strategy: 'select', accept: 'file' });

  const subfolders = computed(() =>
    fm.current.value === HOME
      ? fm.folders.value
      : (findPath(fm.folders.value, fm.current.value).at(-1)?.children ?? []),
  );
</script>

<template>
  <div
    ref="area"
    class="fm-area"
    data-testid="file-area"
  >
    <div
      v-if="subfolders.length"
      class="fm-subfolders"
    >
      <FolderButton
        v-for="folder in subfolders"
        :key="folder.id"
        :folder-id="folder.id"
        :name="folder.name"
        variant="tile"
      />
    </div>
    <ul
      ref="grid"
      class="fm-grid"
      data-testid="file-grid"
    >
      <FileTile
        v-for="file in tiles"
        :key="file.id"
        :file="file"
      />
    </ul>
    <p
      v-if="!tiles.length"
      class="fm-empty"
    >
      This folder is empty. Drop files on it in the tree to move them here.
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

  .fm-subfolders {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
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
