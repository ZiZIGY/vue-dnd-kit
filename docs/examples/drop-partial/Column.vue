<script setup lang="ts">
import { ref, toRef, useTemplateRef } from 'vue';
import { makeSortableList, useDnD } from '@vue-dnd-kit/core';
import PersonRow from './PersonRow.vue';
import { CAPACITY, seatsLeft, type Person } from './server';

const props = defineProps<{ column: { id: string; title: string; seats?: boolean; people: Person[] } }>();

const notice = ref('');
// Seats booked by others, as the server last said.
const others = ref(0);
const why = ref('');
const { selection } = useDnD();
const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'people'),
  group: 'workshop',
  // Only the server knows how many seats are left. The drop waits for it, the overlay
  // where it was let go, then takes as many people as fit: the others fly back.
  onBeforeDrop: async (event) => {
    if (!props.column.seats || event.sameList) return 'accept';
    notice.value = 'Checking seats…';
    const { free, takenElsewhere } = await seatsLeft(props.column.people.length + others.value);
    others.value += takenElsewhere;
    why.value = takenElsewhere ? 'a seat just went to someone else' : 'the workshop is full';
    if (!free) notice.value = `None booked: ${why.value}`;
    // No keys at all: nothing lands, and `onDrop` isn't called.
    return event.keys.slice(0, free);
  },
  onDrop: (event) => {
    if (!props.column.seats || event.sameList) return;
    // The people sent back stay selected.
    selection.delete(...event.accepted);
    notice.value = event.rejected.length
      ? `${event.accepted.length} booked, ${event.rejected.length} back: ${why.value}`
      : `${event.accepted.length} booked`;
  },
});
</script>

<template>
  <section class="column" :class="{ over: isOver }">
    <h3>
      {{ column.title }}
      <span v-if="column.seats" class="seats">{{ column.people.length + others }} / {{ CAPACITY }} seats</span>
    </h3>
    <ul ref="list" class="people">
      <PersonRow v-for="person in items" :key="person.id" :person="person" />
    </ul>
    <p v-if="column.seats" class="notice" role="status">{{ notice }}</p>
  </section>
</template>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, transparent);
  transition: border-color 0.2s;
}

.column.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
}

h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

.seats {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  font-weight: 400;
  opacity: 0.6;
}

.people {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 210px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.notice {
  min-height: 15px;
  margin: 10px 4px 0;
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  color: #42b883;
}
</style>
