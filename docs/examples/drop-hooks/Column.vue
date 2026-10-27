<script setup lang="ts">
import { toRef, useTemplateRef, watch } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import Card from './Card.vue';

const props = defineProps<{
  column: { id: string; title: string; tasks: { id: string; title: string }[] };
  answer: 'accept' | 'reject';
  trace: (who: string, what: string) => void;
}>();

const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'tasks'),
  group: 'post',
  // Only the list the cards go into is asked, and told.
  onBeforeDrop: () => {
    props.trace(props.column.id, `onBeforeDrop → ${props.answer}`);
    return props.answer;
  },
  onDrop: () => props.trace(props.column.id, 'onDrop'),
});

// The library's write, the moment it happens.
watch(
  () => props.column.tasks,
  () => props.trace(props.column.id, 'written'),
  { flush: 'sync' },
);
</script>

<template>
  <section class="column" :class="{ over: isOver }">
    <h3>{{ column.title }}</h3>
    <ul ref="list" class="cards">
      <Card v-for="task in items" :key="task.id" :task="task" />
    </ul>
  </section>
</template>

<style scoped>
.column {
  padding: 8px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, transparent);
  transition: border-color 0.2s;
}

.column.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
}

h3 {
  margin: 2px 4px 8px;
  font-size: 12px;
  font-weight: 600;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 140px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
