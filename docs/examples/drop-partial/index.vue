<script setup lang="ts">
import { reactive } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Column from './Column.vue';

const columns = reactive([
  {
    id: 'waiting',
    title: 'Waiting list',
    people: [
      { id: 'ada', name: 'Ada', hue: 200 },
      { id: 'bo', name: 'Bo', hue: 30 },
      { id: 'cy', name: 'Cyrus', hue: 280 },
      { id: 'dee', name: 'Dee', hue: 140 },
    ],
  },
  {
    id: 'workshop',
    title: 'Workshop',
    seats: true,
    people: [
      { id: 'eli', name: 'Eli', hue: 340 },
      { id: 'fay', name: 'Fay', hue: 90 },
    ],
  },
]);
</script>

<template>
  <DnDProvider>
    <div class="demo">
      <p class="tip">Tick a few people, then drag one of them into the workshop</p>
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 230px));
  justify-content: center;
  gap: 14px;
  width: 100%;
}
</style>
