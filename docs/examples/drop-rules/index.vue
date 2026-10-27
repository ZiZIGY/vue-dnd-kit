<script setup lang="ts">
import { reactive } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Column from './Column.vue';

const columns = reactive([
  {
    id: 'open',
    title: 'Open',
    pulls: [
      { id: 'pr-12', title: '#12 Faster search', approved: true },
      { id: 'pr-15', title: '#15 New logo', approved: false },
      { id: 'pr-18', title: '#18 Fix typo', approved: true },
      { id: 'pr-21', title: '#21 Drop IE', approved: false },
    ],
  },
  { id: 'main', title: 'Merge to main', rule: 'put' as const, pulls: [] },
  { id: 'release', title: 'Merge to release', rule: 'onBeforeDrop' as const, pulls: [] },
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.board > * {
  flex: 0 1 170px;
  min-width: 150px;
}
</style>
