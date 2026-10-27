<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import PlayingCard from './PlayingCard.vue';

const cards = ref([
  { id: 'A♠', rank: 'A', suit: '♠' },
  { id: 'K♥', rank: 'K', suit: '♥' },
  { id: 'Q♣', rank: 'Q', suit: '♣' },
  { id: 'J♦', rank: 'J', suit: '♦' },
  { id: '10♥', rank: '10', suit: '♥' },
]);

const table = useTemplateRef<HTMLElement>('table');
// Let go off the table and the card flies back: a long flight to watch.
const { items } = makeSortableList(table, { items: cards, strategy: 'horizontal', dropOutside: 'cancel' });
</script>

<template>
  <div ref="table" class="table">
    <PlayingCard v-for="card in items" :key="card.id" :card="card" />
  </div>
</template>

<style scoped>
.table {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding: 18px;
  border-radius: 18px;
  background: color-mix(in srgb, #42b883 12%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, #42b883 30%, transparent);
}
</style>
