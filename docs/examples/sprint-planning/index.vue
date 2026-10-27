<script setup lang="ts">
import { reactive, ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Column from './Column.vue';

const columns = reactive([
  {
    id: 'backlog',
    title: 'Backlog',
    stories: [
      { id: 's1', title: 'Saved searches', points: 5 },
      { id: 's2', title: 'Crash on empty board', points: 2, bug: true },
      { id: 's3', title: 'CSV export', points: 3 },
      { id: 's4', title: 'Dark mode email', points: 2 },
    ],
  },
  {
    id: 'sprint',
    title: 'Sprint 14',
    stories: [{ id: 's5', title: 'Onboarding tour', points: 8 }],
  },
]);

const wholeColumn = ref(true);
</script>

<template>
  <DnDProvider>
    <div class="planning">
      <label class="switch">
        <input v-model="wholeColumn" type="checkbox" />
        <code>dropzone</code>: the whole column takes drops
      </label>
      <div class="columns">
        <Column v-for="column in columns" :key="column.id" :column="column" :whole-column="wholeColumn" />
      </div>
    </div>
  </DnDProvider>
</template>

<style scoped>
.planning {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.switch {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
}

.switch input {
  accent-color: #42b883;
}

.switch code {
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  color: #42b883;
}

.columns {
  display: flex;
  justify-content: center;
  gap: 14px;
  width: 100%;
}
</style>
