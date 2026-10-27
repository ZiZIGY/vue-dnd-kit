<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import Row from './Row.vue';

type Task = { id: string; title: string; points: number };
const props = defineProps<{
  column: { id: string; title: string; tasks: Task[] };
  other: { id: string; title: string };
}>();

const listRef = useTemplateRef<HTMLElement>('list');
// The id is what `moveItem(id, { list })` names.
const { items } = makeSortableList(listRef, {
  id: props.column.id,
  items: toRef(props.column, 'tasks'),
  group: 'sprint',
});
</script>

<template>
  <section class="column">
    <h3>
      {{ column.title }}
      <span class="sum">{{ column.tasks.reduce((sum, task) => sum + task.points, 0) }} pt</span>
    </h3>
    <ul ref="list" class="list">
      <Row v-for="(task, index) in items" :key="task.id" :task="task" :index="index" :other="other" />
    </ul>
  </section>
</template>

<style scoped>
.column {
  display: flex;
  flex: 1 1 240px;
  flex-direction: column;
  max-width: 300px;
  padding: 10px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

.sum {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-height: 170px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
