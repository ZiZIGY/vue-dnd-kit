<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskCard from './TaskCard.vue';
import TaskOverlay from './TaskOverlay.vue';
import DoneOverlay from './DoneOverlay.vue';

const props = defineProps<{
  column: { id: string; name: string; tasks: Array<{ id: string; title: string; who: string; hue: number }> };
}>();
const done = props.column.id === 'done';

const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'tasks'),
  group: 'tasks',
  // The tasks' own overlay, in every column…
  overlay: TaskOverlay,
  // …and what Done does with it while a task is over Done: it wraps it.
  overOverlay: done ? DoneOverlay : undefined,
});
</script>

<template>
  <section class="column" :class="{ over: isOver, done }">
    <h3>
      {{ column.name }}
      <span class="count">{{ column.tasks.length }}</span>
    </h3>
    <ul ref="list" class="tasks">
      <TaskCard v-for="task in items" :key="task.id" :task="task" :column="column.id" />
    </ul>
  </section>
</template>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, transparent);
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

.column.over {
  border-color: color-mix(in srgb, currentColor 25%, transparent);
}

.column.done.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
  background: color-mix(in srgb, #42b883 7%, transparent);
}

h3 {
  display: flex;
  align-items: center;
  margin: 2px 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

.count {
  margin-left: auto;
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.tasks {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 120px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
