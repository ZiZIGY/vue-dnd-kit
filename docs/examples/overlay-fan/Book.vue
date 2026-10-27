<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ book: { id: string; title: string; author: string; hue: number } }>();
const el = useTemplateRef<HTMLElement>('el');
const { selected } = makeSortableItem(el, { item: () => props.book });
</script>

<template>
  <div
    ref="el"
    class="book"
    :class="{ selected }"
    :style="{ '--hue': book.hue }"
    :aria-label="`${book.title}, ${selected ? 'selected' : 'not selected'}`"
    @click="selected = !selected"
  >
    <strong>{{ book.title }}</strong>
    <small>{{ book.author }}</small>
    <!-- The selection mark stays on the shelf: the clones in the overlay leave it out. -->
    <span v-if="selected" class="check" aria-hidden="true" data-dnd-no-clone>
      <svg viewBox="0 0 16 16"><path d="m4 8.5 2.5 2.5L12 5.5" /></svg>
    </span>
  </div>
</template>

<style scoped>
.book {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  aspect-ratio: 2 / 3;
  padding: 10px 8px 8px 12px;
  border-radius: 4px 8px 8px 4px;
  background:
    linear-gradient(to right, rgb(0 0 0 / 0.28), transparent 7px),
    linear-gradient(160deg, hsl(var(--hue) 70% 58%), hsl(var(--hue) 60% 32%));
  box-shadow: 0 6px 14px -8px rgb(0 0 0 / 0.6);
  color: #fff;
  cursor: grab;
  user-select: none;
}

.book:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 3px;
}

.book.selected {
  outline: 2.5px solid #42b883;
  outline-offset: 3px;
}

[data-dnd-overlay] .book {
  outline: none;
}

/* Where the books land: a pale cover. */
.book[data-dnd-placeholder] {
  opacity: 0.25;
  outline: none;
}

strong {
  font: 700 13px/1.15 Georgia, 'Times New Roman', serif;
}

small {
  font-size: 9px;
  line-height: 1.2;
  opacity: 0.85;
}

.check {
  position: absolute;
  top: -7px;
  right: -7px;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #42b883;
}

.check svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: #04130c;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
