<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import PhotoTile from './PhotoTile.vue';

const photos = ref([
  { id: 'fjord', place: 'Fjord', hue: 200, size: 'big' as const },
  { id: 'dunes', place: 'Dunes', hue: 30, size: 'small' as const },
  { id: 'moss', place: 'Moss', hue: 110, size: 'small' as const },
  { id: 'coast', place: 'Coast', hue: 185, size: 'wide' as const },
  { id: 'peak', place: 'Peak', hue: 250, size: 'tall' as const },
  { id: 'field', place: 'Field', hue: 70, size: 'small' as const },
  { id: 'canyon', place: 'Canyon', hue: 15, size: 'wide' as const },
  { id: 'lake', place: 'Lake', hue: 215, size: 'small' as const },
  { id: 'bloom', place: 'Bloom', hue: 320, size: 'small' as const },
]);

const grid = useTemplateRef<HTMLElement>('grid');
// `strategy: 'grid'` sorts in two dimensions: a CSS grid (or a wrapping flex row), with
// items of different sizes too.
const { items } = makeSortableList(grid, { items: photos, strategy: 'grid' });
</script>

<template>
  <div ref="grid" class="grid">
    <PhotoTile v-for="photo in items" :key="photo.id" :photo="photo" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 76px);
  grid-auto-rows: 76px;
  grid-auto-flow: dense;
  gap: 8px;
  justify-content: center;
}

@media (max-width: 400px) {
  .grid {
    grid-template-columns: repeat(4, 64px);
    grid-auto-rows: 64px;
  }
}
</style>
