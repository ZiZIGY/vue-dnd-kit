<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import LiftCard from './LiftCard.vue';

const cards = ref([
  { id: 1, title: 'Hero illustration', color: '#f59e0b', people: ['MC', 'LP'], due: 'Mon' },
  { id: 2, title: 'Pricing page copy', color: '#3b82f6', people: ['NK'], due: 'Tue' },
  { id: 3, title: 'Icon set, round two', color: '#ec4899', people: ['SR', 'MC'], due: 'Thu' },
]);

const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: cards });
</script>

<template>
  <ul ref="list" class="cards">
    <LiftCard v-for="card in items" :key="card.id" :card="card" />
  </ul>
</template>

<style scoped>
.cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(100%, 300px);
  margin: 0 auto;
  padding: 0;
  list-style: none;
}
</style>
