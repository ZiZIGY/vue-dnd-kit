<script setup lang="ts">
import { reactive } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Column from './Column.vue';

const columns = reactive([
  {
    id: 'review',
    title: 'In review',
    changes: [
      { id: 'cache', title: 'Cache the feed', approved: true },
      { id: 'retry', title: 'Retry on 503', approved: false },
      { id: 'icons', title: 'New icon set', approved: true },
      { id: 'locale', title: 'Polish locale', approved: false },
    ],
  },
  { id: 'release', title: 'Release 2.4', approvedOnly: true, changes: [] },
]);
</script>

<template>
  <DnDProvider>
    <div class="demo">
      <p class="tip">Tick a few changes, then drag one of them to the release</p>
      <div class="board">
        <Column v-for="column in columns" :key="column.id" :column="column" />
      </div>
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.tip {
  margin: 0;
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 240px));
  justify-content: center;
  gap: 14px;
  width: 100%;
}
</style>
