<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import AppTile from './AppTile.vue';

const apps = ref([
  { id: 'mail', name: 'Mail', color: '#3b82f6' },
  { id: 'notes', name: 'Notes', color: '#eab308' },
  { id: 'music', name: 'Music', color: '#f43f5e' },
  { id: 'maps', name: 'Maps', color: '#22c55e' },
  { id: 'photos', name: 'Photos', color: '#a855f7' },
  { id: 'clock', name: 'Clock', color: '#64748b' },
  { id: 'files', name: 'Files', color: '#0ea5e9' },
  { id: 'chat', name: 'Chat', color: '#42b883' },
]);

const grid = useTemplateRef<HTMLElement>('grid');
// `strategy: 'grid'` sorts in two dimensions: the tiles flow around the dragged one.
const { items } = makeSortableList(grid, { items: apps, strategy: 'grid' });
</script>

<template>
  <div ref="grid" class="grid">
    <AppTile v-for="app in items" :key="app.id" :app="app" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 84px);
  gap: 20px 24px;
  justify-content: center;
}
</style>
