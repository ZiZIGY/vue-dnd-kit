<script setup lang="ts">
import { reactive } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Column from './Column.vue';

const columns = reactive([
  {
    id: 'desktop',
    title: 'Desktop',
    files: [
      { id: 'notes', name: 'notes.pdf', size: 2 },
      { id: 'demo', name: 'demo.mov', size: 48 },
      { id: 'logo', name: 'logo.png', size: 1 },
      { id: 'backup', name: 'backup.zip', size: 120 },
    ],
  },
  // Both take files of 10 MB at most, and say so at different times.
  { id: 'email', title: 'Email', rule: 'put' as const, files: [] },
  { id: 'chat', title: 'Chat', rule: 'onBeforeDrop' as const, files: [] },
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
