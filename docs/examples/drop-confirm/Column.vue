<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList, type SortableDropEvent } from '@vue-dnd-kit/core';
import Card from './Card.vue';
import type { Answer, Column, Task } from './types';

const props = defineProps<{
  column: Column;
  ask: (event: SortableDropEvent<Task>) => Promise<Answer>;
}>();

const zone = useTemplateRef<HTMLElement>('zone');
const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'tasks'),
  group: 'release',
  dropzone: zone,
  // Decides the drop before anything changes. A card coming from another column waits
  // for the answer here: 'accept', 'reject', or 'continue' to keep dragging it.
  onBeforeDrop: (event) => (props.column.confirm && !event.sameList ? props.ask(event) : 'accept'),
});
</script>

<template>
  <section ref="zone" class="column" :class="{ over: isOver }">
    <h3>
      <span class="dot" :style="{ background: column.color }" />
      <span class="title">{{ column.title }}</span>
      <span class="count">{{ column.tasks.length }}</span>
    </h3>
    <ul ref="list" class="cards">
      <Card v-for="task in items" :key="task.id" :task="task" />
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
    background 0.2s,
    border-color 0.2s;
}

.column.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
  background: color-mix(in srgb, #42b883 6%, transparent);
}

h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 4px 12px;
  font-size: 13px;
  font-weight: 600;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.count {
  margin-left: auto;
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 150px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
