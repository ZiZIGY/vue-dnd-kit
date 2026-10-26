<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import Card from './Card.vue';

type Task = { id: string; title: string; tag: string };
const props = defineProps<{ column: { id: string; title: string; cards: Task[] } }>();

const list = useTemplateRef<HTMLElement>('list');
// Lists with the same `group` exchange items. The drop is written into `column.cards`.
const { items, isOver } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'cards'),
  group: 'board',
});
</script>

<template>
  <section class="column" :class="{ over: isOver }">
    <h3>
      {{ column.title }} <span>{{ column.cards.length }}</span>
    </h3>
    <ul ref="list" class="cards">
      <Card v-for="card in items" :key="card.id" :card="card" />
    </ul>
  </section>
</template>

<style scoped>
.column {
  padding: 12px;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 5%, transparent);
  transition: background 0.2s;
}

.column.over {
  background: color-mix(in srgb, currentColor 9%, transparent);
}

h3 {
  display: flex;
  justify-content: space-between;
  margin: 0 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

h3 span {
  opacity: 0.5;
  font-weight: 400;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 120px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
