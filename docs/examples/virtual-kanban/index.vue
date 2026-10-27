<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Column from './Column.vue';
import { makeColumns } from './cards';

// 3,000 cards; each column renders the dozen you can see.
const columns = makeColumns(1_000);
</script>

<template>
  <DnDProvider>
    <div class="board">
      <Column v-for="column in columns" :key="column.id" :column="column" />
    </div>
  </DnDProvider>
</template>

<style scoped>
/* Three columns; on a phone they keep their width and the board scrolls sideways. */
.board {
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  gap: 10px;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  overflow-x: auto;
}
</style>
