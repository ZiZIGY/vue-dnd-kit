<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ book: { id: string; title: string; hue: number } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.book });
</script>

<template>
  <li ref="el" class="book">
    <span class="spine" :style="{ background: `hsl(${book.hue} 55% 50%)` }" />
    <span>{{ book.title }}</span>
  </li>
</template>

<style scoped>
.book {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px 9px 9px;
  border-radius: 9px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
  font-size: 13px;
  font-weight: 500;
  cursor: grab;
  user-select: none;
}

.book:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* The slot the dragged book will land in: an empty outline. */
.book[data-dnd-placeholder] {
  opacity: 1;
  background: transparent;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 25%, transparent);
}

.book[data-dnd-placeholder] > * {
  visibility: hidden;
}

.spine {
  width: 6px;
  height: 18px;
  border-radius: 2px;
}
</style>
