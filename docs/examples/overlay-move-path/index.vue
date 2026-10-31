<script setup lang="ts">
import { provide, ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import FileTree from './FileTree.vue';
import { FILES, project } from './files';

// Provided above the provider: its overlay renders under it, so the overlay sees them too.
provide(FILES, ref(project()));
</script>

<template>
  <DnDProvider>
    <FileTree />
  </DnDProvider>
</template>
