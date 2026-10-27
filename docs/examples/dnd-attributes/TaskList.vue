<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskRow from './TaskRow.vue';

const tasks = ref([
  { id: 'brief', title: 'Read the brief', done: true },
  { id: 'sketch', title: 'Sketch the layout', done: false },
  { id: 'tokens', title: 'Pick colour tokens', done: false },
  { id: 'review', title: 'Review with the team', done: false },
  { id: 'ship', title: 'Ship it', done: false },
]);

const list = useTemplateRef<HTMLElement>('list');
// 'gaps': the other selected rows stay in place, marked `data-dnd-dragging`, until the drop.
const { items } = makeSortableList(list, { items: tasks, multiple: 'gaps' });
</script>

<template>
  <section class="tasks">
    <ul ref="list" class="rows">
      <TaskRow v-for="task in items" :key="task.id" :task="task" />
    </ul>
    <p class="hint">Ctrl / ⌘-click selects several</p>
  </section>
</template>

<style scoped>
.tasks {
  flex: 1;
  min-width: 0;
  max-width: 270px;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.hint {
  margin: 12px 0 0;
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  text-align: center;
  opacity: 0.6;
}
</style>
