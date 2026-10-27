<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import AgendaItem from './AgendaItem.vue';

const agenda = defineModel<{ id: string; title: string; minutes: number }[]>({ required: true });

const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { id: 'agenda', items: agenda });
</script>

<template>
  <ol ref="list" class="agenda">
    <AgendaItem v-for="(item, index) in items" :key="item.id" :item="item" :number="index + 1" />
  </ol>
</template>

<style scoped>
.agenda {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: min(100%, 250px);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
