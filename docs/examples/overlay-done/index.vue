<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Column from './Column.vue';

const columns = ref([
  {
    id: 'todo',
    name: 'To do',
    tasks: [
      { id: 't1', title: 'Write the release notes', who: 'MC', hue: 160 },
      { id: 't2', title: 'Record the demo video', who: 'LM', hue: 25 },
    ],
  },
  {
    id: 'doing',
    name: 'In progress',
    tasks: [
      { id: 't3', title: 'Fix the flaky upload test', who: 'AR', hue: 330 },
      { id: 't4', title: 'Review the pricing page', who: 'MC', hue: 160 },
    ],
  },
  { id: 'done', name: 'Done', tasks: [{ id: 't5', title: 'Ship the new onboarding', who: 'LM', hue: 25 }] },
]);
</script>

<template>
  <DnDProvider>
    <div class="board">
      <Column v-for="column in columns" :key="column.id" :column="column" />
    </div>
  </DnDProvider>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
}
</style>
