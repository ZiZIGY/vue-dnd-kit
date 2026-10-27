<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import StickyNote from './StickyNote.vue';

const props = defineProps<{ slowSave: boolean }>();

const notes = ref([
  { id: 'n1', text: 'Call the venue about Friday', paper: '#fde68a' },
  { id: 'n2', text: 'Book the train', paper: '#fbcfe8' },
  { id: 'n3', text: 'Slides: cut to 10', paper: '#bbf7d0' },
  { id: 'n4', text: 'Ask Sam for the photos', paper: '#bfdbfe' },
  { id: 'n5', text: 'Renew the domain', paper: '#fde68a' },
  { id: 'n6', text: 'Water the plants', paper: '#bbf7d0' },
]);

const board = useTemplateRef<HTMLElement>('board');
const { items } = makeSortableList(board, {
  items: notes,
  strategy: 'grid',
  // An async `onBeforeDrop` keeps the overlay where it was let go, as `dropping`, until it resolves.
  onBeforeDrop: () => (props.slowSave ? new Promise<true>((resolve) => setTimeout(() => resolve(true), 1200)) : true),
});
</script>

<template>
  <ul ref="board" class="board">
    <StickyNote v-for="note in items" :key="note.id" :note="note" :saving="slowSave" />
  </ul>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(3, 120px);
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 460px) {
  .board {
    grid-template-columns: repeat(2, 120px);
  }
}
</style>
