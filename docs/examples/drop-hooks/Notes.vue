<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';
import { makeDroppable, makeSortableList } from '@vue-dnd-kit/core';
import Card from './Card.vue';
import type { Answer, Trace } from './types';

const props = defineProps<{ answer: Answer; trace: Trace }>();

const notes = ref([
  { id: 'milk', title: 'Buy oat milk' },
  { id: 'call', title: 'Call the plumber' },
  { id: 'book', title: 'Return the book' },
  { id: 'plants', title: 'Water the plants' },
]);

const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, {
  id: 'notes',
  items: notes,
  // Asked when the notes are reordered: the list is the target.
  onBeforeDrop: () => {
    props.trace('list', `onBeforeDrop → ${props.answer}`);
    return props.answer;
  },
  // Told when it is the target, and when notes leave it for the trash (`to.index` -1).
  onDrop: (event) => props.trace('list', event.to.index < 0 ? 'onDrop, removed' : 'onDrop'),
});

const trash = useTemplateRef<HTMLElement>('trash');
const { isOver } = makeDroppable(trash, {
  id: 'trash',
  // Asked when a note is dropped in the trash: the trash is the target.
  onBeforeDrop: () => {
    props.trace('trash', `onBeforeDrop → ${props.answer}`);
    return props.answer;
  },
  onDrop: (event) => {
    props.trace('trash', 'onDrop');
    event.source?.remove();
  },
});

// The library's write, the moment it happens.
watch(notes, () => props.trace('list', 'written'), { flush: 'sync' });
</script>

<template>
  <div class="notes">
    <ul ref="list" class="cards">
      <Card v-for="note in items" :key="note.id" :task="note" />
    </ul>
    <div ref="trash" class="trash" :class="{ over: isOver }">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" /></svg>
      Trash
    </div>
  </div>
</template>

<style scoped>
.notes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 190px;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 8px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, transparent);
  list-style: none;
}

.trash {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  border: 1.5px dashed color-mix(in srgb, currentColor 22%, transparent);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

.trash.over {
  border-color: #e5484d;
  background: color-mix(in srgb, #e5484d 8%, transparent);
  color: #e5484d;
}

.trash svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
