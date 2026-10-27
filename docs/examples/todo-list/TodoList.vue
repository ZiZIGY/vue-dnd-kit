<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TodoRow from './TodoRow.vue';

const todos = ref([
  { id: 'milk', text: 'Buy oat milk', done: true },
  { id: 'call', text: 'Call the dentist', done: false },
  { id: 'plants', text: 'Water the plants', done: false },
  { id: 'book', text: 'Return the library book', done: false },
  { id: 'run', text: 'Go for a run', done: false },
]);
const listRef = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(listRef, { items: todos });
const left = computed(() => todos.value.filter((todo) => !todo.done).length);
const toggle = (id: string) => {
  const todo = todos.value.find((entry) => entry.id === id);
  if (todo) todo.done = !todo.done;
};
</script>

<template>
  <div class="card">
    <header>
      <strong>Today</strong>
      <span>{{ left }} left</span>
    </header>
    <ul ref="list" class="list">
      <TodoRow v-for="todo in items" :key="todo.id" :todo="todo" @toggle="toggle(todo.id)" />
    </ul>
  </div>
</template>

<style scoped>
.card {
  width: min(380px, 100%);
  padding: 16px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, currentColor 2%, Canvas);
}

header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 0 4px 12px;
  font-size: 15px;
}

header span {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
