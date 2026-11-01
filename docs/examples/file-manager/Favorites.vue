<script setup lang="ts">
import { inject, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import FavoriteRow from './FavoriteRow.vue';
import { DRIVE } from './drive';

/**
 * Favorites: a sortable list of their own (group `favorites`), so the grid's files never
 * land in it. Each row also takes files into its folder: see FavoriteRow.vue.
 */
const drive = inject(DRIVE)!;
const list = useTemplateRef<HTMLElement>('list');

const { items } = makeSortableList(list, {
  items: drive.favoriteFolders,
  // Keys of their own: the folder's tile in the grid is a draggable with the folder's id.
  getKey: (folder) => `favorite-${folder.id}`,
  group: 'favorites',
  axis: 'y',
  onDrop: () => drive.record('Arranged Favorites', false),
});
</script>

<template>
  <div ref="list" class="favorites">
    <FavoriteRow v-for="folder in items" :key="`favorite-${folder.id}`" :folder="folder" />
  </div>
  <p v-if="!items.length" class="hint">Add a folder from its menu.</p>
</template>

<style scoped>
.favorites {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.hint {
  margin: 2px 10px;
  font-size: 12px;
  opacity: 0.45;
}
</style>
