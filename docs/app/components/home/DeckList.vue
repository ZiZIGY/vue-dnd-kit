<script setup lang="ts">
  import { makeSortableList } from '@vue-dnd-kit/core';
  import { DECK } from '~/data/deck';
  import DeckOverlay from './DeckOverlay.vue';

  const cards = ref([...DECK]);
  const row = useTemplateRef<HTMLElement>('row');
  // A horizontal list locked to its axis; the card in hand is drawn by DeckOverlay.
  const { items } = makeSortableList(row, {
    id: 'deck',
    items: cards,
    strategy: 'horizontal',
    axis: 'x',
    overlay: DeckOverlay,
  });
</script>

<template>
  <div
    ref="row"
    class="flex items-center justify-center [perspective:1400px]"
  >
    <HomeDeckItem
      v-for="card in items"
      :key="card.id"
      :card="card"
      :count="items.length"
    />
  </div>
</template>
