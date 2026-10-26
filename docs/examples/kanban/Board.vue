<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  {
    id: 'todo',
    title: 'To do',
    cards: [
      { id: 'c1', title: 'Pick a colour palette', tag: '#f59e0b' },
      { id: 'c2', title: 'Write release notes', tag: '#3b82f6' },
      { id: 'c3', title: 'Record the demo', tag: '#a855f7' },
    ],
  },
  {
    id: 'doing',
    title: 'In progress',
    cards: [{ id: 'c4', title: 'Sortable trees', tag: '#42b883' }],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [{ id: 'c5', title: 'Kanban boards', tag: '#42b883' }],
  },
]);
</script>

<template>
  <div class="board">
    <Column v-for="column in columns" :key="column.id" :column="column" />
  </div>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 220px));
  gap: 12px;
  justify-content: center;
}
</style>
