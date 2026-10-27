<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskRow from './TaskRow.vue';

type Task = { id: string; title: string; project: string; time: string };
const props = defineProps<{ id: string; title: string; wide?: boolean }>();
const tasks = defineModel<Task[]>('tasks', { required: true });

const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { id: props.id, items: tasks, group: 'tasks' });
</script>

<template>
  <section class="panel" :class="{ wide }">
    <h3>{{ title }} <span>{{ tasks.length }}</span></h3>
    <ul ref="list" class="tasks">
      <TaskRow v-for="task in items" :key="task.id" :task="task" />
    </ul>
  </section>
</template>

<style scoped>
.panel {
  width: 190px;
  padding: 10px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, transparent);
}

.panel.wide {
  width: 320px;
  max-width: 100%;
  box-sizing: border-box;
}

h3 {
  display: flex;
  justify-content: space-between;
  margin: 2px 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

h3 span {
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

.tasks {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 100px;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Roomier rows in the wide list: the overlay takes their size over it. */
.wide .tasks :deep(.task) {
  height: 54px;
  font-size: 14px;
}
</style>
