<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import Book from './Book.vue';

const props = defineProps<{ id: string; title: string }>();
const books = defineModel<{ id: string; title: string; hue: number }[]>({ required: true });

const list = useTemplateRef<HTMLElement>('list');
// Same group: the two shelves exchange books, as long as one provider owns both.
const { items, isOver } = makeSortableList(list, { id: props.id, items: books, group: 'books' });
</script>

<template>
  <section class="shelf" :class="{ over: isOver }">
    <h3>{{ title }}</h3>
    <ul ref="list" class="books">
      <Book v-for="book in items" :key="book.id" :book="book" />
    </ul>
  </section>
</template>

<style scoped>
.shelf {
  padding: 10px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition: border-color 0.2s;
}

.shelf.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
}

h3 {
  margin: 2px 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

.books {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 148px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
