<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskRow from './TaskRow.vue';

const tasks = defineModel<{ id: string; title: string }[]>({ required: true });
defineProps<{ title: string; compact?: boolean }>();

const list = useTemplateRef<HTMLElement>('list');
// Two lists of one group, with rows of two sizes: what `overlay-fit` is about.
const { items, isOver } = makeSortableList(list, { items: tasks, group: 'density' });
</script>

<template>
  <section class="column" :class="{ compact, over: isOver }">
    <h3>{{ title }} <span>{{ items.length }}</span></h3>
    <ul ref="list">
      <TaskRow v-for="task in items" :key="task.id" :task="task" :compact="compact" />
    </ul>
  </section>
</template>

<style scoped>
.column {
  box-sizing: border-box;
  width: 230px;
  padding: 10px;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 4%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  transition: box-shadow 0.15s;
}

.column.compact {
  width: 160px;
}

/* The list the collision function picked. */
.column.over {
  box-shadow: inset 0 0 0 1.5px #42b883;
}

h3 {
  display: flex;
  justify-content: space-between;
  margin: 0 2px 8px;
  font-size: 12px;
  font-weight: 600;
}

h3 span {
  font-weight: 400;
  opacity: 0.5;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 60px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
