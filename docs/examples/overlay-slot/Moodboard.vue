<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import BoardTile from './BoardTile.vue';

type Tile = { id: number; kind: 'photo'; hue: number } | { id: number; kind: 'note'; text: string };

const tiles = ref<Tile[]>([
  { id: 1, kind: 'photo', hue: 200 },
  { id: 2, kind: 'note', text: 'Softer greens for the header' },
  { id: 3, kind: 'photo', hue: 25 },
  { id: 4, kind: 'photo', hue: 150 },
  { id: 5, kind: 'note', text: 'Ask Maya about the font' },
  { id: 6, kind: 'photo', hue: 290 },
  { id: 7, kind: 'note', text: 'Rounder corners?' },
  { id: 8, kind: 'photo', hue: 340 },
]);

const board = useTemplateRef<HTMLElement>('board');
// No `overlay` here: the provider's slot decides.
const { items } = makeSortableList(board, { items: tiles, strategy: 'grid' });
</script>

<template>
  <div ref="board" class="board">
    <BoardTile v-for="tile in items" :key="tile.id" :tile="tile" />
  </div>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
  gap: 10px;
  width: min(100%, 480px);
  margin: 0 auto;
}
</style>
