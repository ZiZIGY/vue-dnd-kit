<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import BookRow from './BookRow.vue';

const books = ref([
  { id: 'dune', title: 'Dune', author: 'Frank Herbert' },
  { id: 'emma', title: 'Emma', author: 'Jane Austen' },
  { id: 'beloved', title: 'Beloved', author: 'Toni Morrison' },
  { id: 'solaris', title: 'Solaris', author: 'Stanisław Lem' },
]);

const list = useTemplateRef<HTMLElement>('list');
// `animate`: moves made by the buttons (no drag) slide too, and stay still for users
// who ask for reduced motion.
const { items } = makeSortableList(list, { id: 'reading', items: books, animate: true });

// Buttons change the data, not a drag: the provider says nothing, so this region does.
const message = ref('');

const move = (from: number, to: number) => {
  const next = [...books.value];
  const [book] = next.splice(from, 1);
  next.splice(to, 0, book!);
  books.value = next;
  message.value = `${book!.title} moved to position ${to + 1} of ${next.length}.`;
};

// The row of the book marked as read goes away, and its focus with it: the next row
// (or the last one) takes it.
const focused = ref<string | null>(null);
const finish = (index: number) => {
  const [book] = books.value.splice(index, 1);
  message.value = `${book!.title} marked as read. ${books.value.length} left.`;
  focused.value = books.value[Math.min(index, books.value.length - 1)]?.id ?? null;
};
</script>

<template>
  <section class="reading">
    <h3>Up next</h3>
    <ol ref="list" class="books">
      <BookRow
        v-for="(book, index) in items"
        :key="book.id"
        :book="book"
        :index="index"
        :count="items.length"
        :focused="focused === book.id"
        @move="(to) => move(index, to)"
        @finish="finish(index)"
      />
    </ol>
    <p v-if="!items.length" class="empty">All read.</p>
    <p class="status" role="status">{{ message }}</p>
  </section>
</template>

<style scoped>
.reading {
  width: min(100%, 420px);
  margin: 0 auto;
}

h3 {
  margin: 0 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

.books {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.empty {
  margin: 0;
  padding: 18px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 5%, transparent);
  font-size: 13px;
  text-align: center;
  opacity: 0.6;
}

.status {
  min-height: 17px;
  margin: 12px 4px 0;
  font: 11px/1.5 ui-monospace, Menlo, Consolas, monospace;
  color: #42b883;
}
</style>
