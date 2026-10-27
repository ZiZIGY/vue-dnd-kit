<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList, useDnD } from '@vue-dnd-kit/core';
import Book from './Book.vue';
import FanOverlay from './FanOverlay.vue';

const books = ref([
  { id: 'dune', title: 'Dune', author: 'Frank Herbert', hue: 28 },
  { id: 'emma', title: 'Emma', author: 'Jane Austen', hue: 330 },
  { id: 'ulysses', title: 'Ulysses', author: 'James Joyce', hue: 205 },
  { id: 'beloved', title: 'Beloved', author: 'Toni Morrison', hue: 275 },
  { id: 'walden', title: 'Walden', author: 'H. D. Thoreau', hue: 140 },
  { id: 'solaris', title: 'Solaris', author: 'Stanisław Lem', hue: 175 },
]);

const shelf = useTemplateRef<HTMLElement>('shelf');
const { items } = makeSortableList(shelf, { items: books, strategy: 'grid', overlay: FanOverlay });

// Three books picked to start with: drag one of them and all three come along.
const { selection } = useDnD();
selection.set(['emma', 'ulysses', 'walden']);
</script>

<template>
  <div class="library">
    <div ref="shelf" class="shelf">
      <Book v-for="book in items" :key="book.id" :book="book" />
    </div>
    <p>
      {{ selection.ids.size }} selected
      <button type="button" :disabled="!selection.ids.size" @click="selection.clear()">Clear</button>
    </p>
  </div>
</template>

<style scoped>
.library {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.shelf {
  display: grid;
  grid-template-columns: repeat(auto-fill, 78px);
  justify-content: center;
  gap: 14px;
  width: min(100%, 560px);
}

p {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
}

button {
  padding: 4px 10px;
  border: 0;
  border-radius: 7px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  color: inherit;
  font: 600 12px/1.2 system-ui, sans-serif;
  cursor: pointer;
}

button:disabled {
  cursor: default;
  opacity: 0.4;
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}
</style>
