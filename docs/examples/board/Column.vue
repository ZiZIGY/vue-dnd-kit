<script setup lang="ts">
import { computed, toRef, useTemplateRef } from 'vue';
import { makeSortableItem, makeSortableList, type SortableDropEvent } from '@vue-dnd-kit/core';
import Card from './Card.vue';
import CardOverlay from './CardOverlay.vue';
import type { Answer, Column, Task } from './types';

const props = defineProps<{
  column: Column;
  ask: (event: SortableDropEvent<Task>) => Promise<Answer>;
}>();

const el = useTemplateRef<HTMLElement>('el');
const header = useTemplateRef<HTMLElement>('header');
const list = useTemplateRef<HTMLElement>('list');

// The column is an item of the board's list, dragged by its header...
makeSortableItem(el, { item: () => props.column, handle: header, type: 'column' });

// ...and holds a list of cards. `put` sees every card of a multi-drag at once: the column
// takes them only if they all fit under its WIP limit.
const fits = (count: number) => !props.column.limit || props.column.cards.length + count <= props.column.limit;
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'cards'),
  group: { name: 'cards', put: ({ keys }) => fits(keys.length) },
  overlay: CardOverlay,
  // Cards coming into Done wait for an answer: 'accept', 'reject', or 'continue' to keep dragging.
  onBeforeDrop: (event) => (props.column.confirm && !event.sameList ? props.ask(event) : 'accept'),
});

const full = computed(() => !!props.column.limit && props.column.cards.length >= props.column.limit);
const refusing = computed(() => isOver.value && !isAccepting.value);
</script>

<template>
  <section ref="el" class="column" :class="{ over: isOver && isAccepting, refusing }">
    <header ref="header" class="head">
      <span class="dot" :style="{ background: column.color }" />
      <h3>{{ column.title }}</h3>
      <span class="count" :class="{ full }">
        {{ column.cards.length }}<template v-if="column.limit">/{{ column.limit }}</template>
      </span>
    </header>
    <ul ref="list" class="cards">
      <Card v-for="card in items" :key="card.id" :card="card" />
    </ul>
    <p v-if="refusing" class="limit">WIP limit: {{ column.limit }}</p>
  </section>
</template>

<style scoped>
.column {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 6px 8px 8px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  /* Its own background: the copy that follows the pointer isn't see-through. */
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition:
    background 0.2s,
    border-color 0.2s;
}

.column.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
  background: color-mix(in srgb, #42b883 6%, Canvas);
}

.column.refusing {
  border-color: color-mix(in srgb, #f43f5e 60%, transparent);
  background: color-mix(in srgb, #f43f5e 6%, Canvas);
}

/* A column in hand. */
[data-dnd-overlay='dragging'] .column {
  box-shadow: 0 24px 40px -18px rgb(0 0 0 / 0.55);
}

/* The slot the dragged column will land in. */
.column[data-dnd-placeholder] {
  opacity: 1;
  border-style: dashed;
  border-color: color-mix(in srgb, currentColor 30%, transparent);
  background: none;
}

.column[data-dnd-placeholder] > * {
  visibility: hidden;
}

.head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px 10px;
  border-radius: 8px;
  cursor: grab;
}

.head:focus-visible {
  outline: 2px solid #42b883;
}

.dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

h3 {
  margin: 0;
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.count {
  margin-left: auto;
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.count.full {
  background: color-mix(in srgb, #f43f5e 16%, transparent);
  color: #f43f5e;
}

/*
 * Fills the column: the space below the last card takes drops too. Tall enough for three
 * cards, so the board keeps its height while cards come and go.
 */
.cards {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 288px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.limit {
  position: absolute;
  right: 8px;
  bottom: 8px;
  left: 8px;
  margin: 0;
  padding: 6px;
  border-radius: 8px;
  background: #f43f5e;
  color: #fff;
  font: 600 11px/1.2 ui-monospace, Menlo, Consolas, monospace;
  text-align: center;
}
</style>
