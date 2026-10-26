<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import AppTile from './AppTile.vue';
import AppOverlay from './AppOverlay.vue';

const apps = ref([
  { id: 'mail', name: 'Mail' },
  { id: 'notes', name: 'Notes' },
  { id: 'music', name: 'Music' },
  { id: 'maps', name: 'Maps' },
  { id: 'photos', name: 'Photos' },
  { id: 'clock', name: 'Clock' },
  { id: 'files', name: 'Files' },
  { id: 'chat', name: 'Chat' },
  { id: 'camera', name: 'Camera' },
  { id: 'calendar', name: 'Calendar' },
  { id: 'weather', name: 'Weather' },
  { id: 'settings', name: 'Settings' },
]);

const grid = useTemplateRef<HTMLElement>('grid');
// `strategy: 'grid'` sorts in two dimensions: the tiles flow around the dragged one.
// `overlay`: what follows the pointer, here the icon alone.
const { items } = makeSortableList(grid, { items: apps, strategy: 'grid', overlay: AppOverlay });
</script>

<template>
  <div class="screen">
    <div ref="grid" class="grid">
      <AppTile v-for="app in items" :key="app.id" :app="app" />
    </div>
  </div>
</template>

<style scoped>
.screen {
  padding: 24px 20px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 28px;
  background:
    radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, #42b883 16%, transparent), transparent 60%),
    color-mix(in srgb, currentColor 3%, Canvas);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 64px);
  gap: 20px 14px;
}
</style>
