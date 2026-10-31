<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';
  import FileManager from '../../components/apps/files/FileManager.vue';
</script>

<template>
  <section>
    <h2 class="fm-title">Files</h2>
    <p class="fm-hint">
      Drag across empty space to select, Ctrl/Cmd+click to add a file or folder, double-click a folder to open it.
      Drop files and folders on the middle of a folder to move them inside (near its edges the grid reorders), or on a
      folder in the tree or a breadcrumb; drag folders in the tree to reorganize them.
    </p>
    <!-- Own provider: its selection is what the rubber band fills and multi-drag takes. -->
    <DnDProvider>
      <FileManager />
    </DnDProvider>
  </section>
</template>

<style scoped>
  .fm-title {
    margin: 0 0 4px;
  }

  .fm-hint {
    max-width: 760px;
    margin: 0 0 12px;
    color: var(--ui-text-muted);
  }
</style>
