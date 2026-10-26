<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Playlist from './Playlist.vue';
import AppGrid from './AppGrid.vue';
</script>

<template>
  <DnDProvider>
    <div class="demo">
      <Playlist />
      <AppGrid />
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 32px 40px;
}
</style>
