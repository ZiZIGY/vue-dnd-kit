<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Column from './Column.vue';

const columns = ref([
  {
    id: 'Backlog',
    tickets: [
      { id: 't1', title: 'Dark mode toggle', tag: 'UI', approved: false },
      { id: 't2', title: 'Retry failed uploads', tag: 'API', approved: true },
      { id: 't3', title: 'Keyboard shortcuts', tag: 'UI', approved: false },
    ],
  },
  { id: 'Doing', tickets: [{ id: 't4', title: 'Faster search', tag: 'API', approved: true }] },
  { id: 'Done', tickets: [{ id: 't5', title: 'Onboarding tour', tag: 'UI', approved: true }] },
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
  max-width: 600px;
  margin: 0 auto;
}
</style>
