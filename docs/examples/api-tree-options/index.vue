<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import FileTree from './FileTree.vue';
</script>

<template>
  <DnDProvider>
    <FileTree />
  </DnDProvider>
</template>
