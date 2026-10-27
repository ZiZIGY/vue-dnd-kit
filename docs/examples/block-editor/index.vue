<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Page from './Page.vue';
import Palette from './Palette.vue';
</script>

<template>
  <!-- The page and the palette share a group: blocks dragged from the palette are copies. -->
  <DnDProvider>
    <div class="editor">
      <Page />
      <Palette />
    </div>
  </DnDProvider>
</template>

<style scoped>
/* A container: when the example is narrow, the palette wraps below the page and spreads out. */
.editor {
  container-type: inline-size;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
}
</style>
