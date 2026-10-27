<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import Song from './Song.vue';
import SongOverlay from './SongOverlay.vue';

const songs = ref([
  { id: 1, title: 'Night Drive', artist: 'Lumen', length: '3:42', hue: 260 },
  { id: 2, title: 'Paper Planes', artist: 'Odd Season', length: '2:58', hue: 20 },
  { id: 3, title: 'Low Tide', artist: 'Marin', length: '4:05', hue: 190 },
  { id: 4, title: 'Glasshouse', artist: 'Vera Moss', length: '3:17', hue: 120 },
]);

const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: songs, overlay: SongOverlay });
</script>

<template>
  <ol ref="list" class="playlist">
    <Song v-for="song in items" :key="song.id" :song="song" />
  </ol>
</template>

<style scoped>
.playlist {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: min(100%, 320px);
  margin: 0 auto;
  padding: 0;
  list-style: none;
}
</style>
