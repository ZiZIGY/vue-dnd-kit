<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  {
    id: 'todo',
    title: 'To do',
    color: '#a1a1aa',
    cards: [
      { id: 'vdk-12', title: 'Pick a colour palette', tag: 'Design' },
      { id: 'vdk-15', title: 'Write release notes', tag: 'Docs' },
      { id: 'vdk-16', title: 'Record the demo', tag: 'Video' },
    ],
  },
  {
    id: 'doing',
    title: 'In progress',
    color: '#f59e0b',
    cards: [
      { id: 'vdk-9', title: 'Sortable trees', tag: 'Core' },
      { id: 'vdk-11', title: 'Keyboard drags', tag: 'A11y' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    color: '#42b883',
    cards: [{ id: 'vdk-4', title: 'Kanban boards', tag: 'Core' }],
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
  grid-template-columns: repeat(3, minmax(0, 240px));
  gap: 14px;
  justify-content: center;
}
</style>
