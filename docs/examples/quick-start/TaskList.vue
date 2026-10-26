<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskRow from './TaskRow.vue';

const tasks = ref([
  { id: 1, title: 'Sketch the board' },
  { id: 2, title: 'Write the docs' },
  { id: 3, title: 'Ship v3' },
  { id: 4, title: 'Celebrate' },
]);

const listRef = useTemplateRef<HTMLElement>('list');
// `items` is the draft: it reorders while you drag. On drop, `tasks` gets the new order.
const { items } = makeSortableList(listRef, { items: tasks });
</script>

<template>
  <ul ref="list" class="list">
    <TaskRow v-for="task in items" :key="task.id" :task="task" />
  </ul>
  <p class="order">{{ tasks.map((task) => task.id).join(' · ') }}</p>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 320px;
  margin: 0 auto;
  padding: 0;
  list-style: none;
}

.order {
  margin: 16px 0 0;
  font: 12px/1 ui-monospace, monospace;
  text-align: center;
  opacity: 0.6;
}
</style>
