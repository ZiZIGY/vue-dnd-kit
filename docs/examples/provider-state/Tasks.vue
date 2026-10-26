<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskRow from './TaskRow.vue';

const tasks = ref([
  { id: 'design', title: 'Design the board' },
  { id: 'build', title: 'Build the list' },
  { id: 'test', title: 'Test the drops' },
  { id: 'ship', title: 'Ship it' },
]);

const list = useTemplateRef<HTMLElement>('list');
// `id` names the list in the drag state: `over` reads `tasks` while a task is over it.
const { items } = makeSortableList(list, { id: 'tasks', items: tasks });
</script>

<template>
  <ul ref="list" class="tasks">
    <TaskRow v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>

<style scoped>
.tasks {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 240px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
