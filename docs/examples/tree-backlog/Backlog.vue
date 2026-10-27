<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import WorkRow from './WorkRow.vue';

interface Work {
  id: string;
  title: string;
  kind: 'epic' | 'story' | 'task';
  children?: Work[];
}

// A flat list: a story that comes in keeps its tasks in `children`, out of sight.
const backlog = ref<Work[]>([
  {
    id: 'dark-mode',
    title: 'Dark mode',
    kind: 'story',
    children: [
      { id: 'tokens', title: 'Color tokens', kind: 'task' },
      { id: 'switch', title: 'Theme switch', kind: 'task' },
    ],
  },
  { id: 'csv', title: 'CSV export', kind: 'story' },
  { id: 'flaky', title: 'Fix the flaky test', kind: 'task' },
]);

const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, { id: 'backlog', items: backlog, group: 'work' });
</script>

<template>
  <section class="panel" :class="{ over: isOver }">
    <h3>Backlog</h3>
    <ul ref="list" class="rows">
      <WorkRow v-for="work in items" :key="work.id" :work="work" :depth="0" />
    </ul>
  </section>
</template>

<style scoped>
.panel {
  padding: 10px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, transparent);
  transition: border-color 0.2s;
}

.panel.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
}

h3 {
  margin: 2px 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 250px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
