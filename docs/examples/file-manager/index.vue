<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import FileManager from './FileManager.vue';
</script>

<template>
  <!-- One provider: its selection is what the rubber band fills and a multi-drag takes. -->
  <DnDProvider>
    <FileManager />
  </DnDProvider>
</template>
