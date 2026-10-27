<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskRow from './TaskRow.vue';

const props = defineProps<{ id: string; record: (name: string, type: string, payload: unknown) => void }>();
const tasks = defineModel<{ id: string; title: string }[]>({ required: true });

const list = useTemplateRef<HTMLElement>('list');
// The list's own hooks get a SortableDropEvent: the drop as the list sees it, with `result`.
const { items, isOver } = makeSortableList(list, {
  id: props.id,
  items: tasks,
  group: 'events',
  onBeforeDrop: (event) => props.record(`${props.id}.onBeforeDrop`, 'SortableDropEvent', event),
  onDrop: (event) => props.record(`${props.id}.onDrop`, 'SortableDropEvent', event),
});
</script>

<template>
  <section class="column" :class="{ over: isOver }">
    <h3>{{ id }}</h3>
    <ul ref="list">
      <TaskRow v-for="task in items" :key="task.id" :task="task" />
    </ul>
  </section>
</template>

<style scoped>
.column {
  padding: 8px;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 4%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  transition: box-shadow 0.15s;
}

.column.over {
  box-shadow: inset 0 0 0 1.5px #42b883;
}

h3 {
  margin: 0 4px 6px;
  font: 600 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 34px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
