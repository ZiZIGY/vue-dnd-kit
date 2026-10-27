<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TicketCard from './TicketCard.vue';
import TicketOverlay from './TicketOverlay.vue';

type Ticket = { id: string; title: string; tag: string; approved: boolean };
const props = defineProps<{ column: { id: string; tickets: Ticket[] } }>();
const strict = props.column.id === 'Done';

const list = useTemplateRef<HTMLElement>('list');
const { items, isOver, isAccepting } = makeSortableList(list, {
  // The id is the column's name: the overlay shows it as `over.id`.
  id: props.column.id,
  items: toRef(props.column, 'tickets'),
  // One group, so tickets move between the columns. Done takes approved tickets only:
  // over Done, an unapproved ticket's overlay gets `accepted: false`.
  group: { name: 'release', put: strict ? ({ items }) => (items as Ticket[]).every((t) => t.approved) : true },
  // Alt-drag copies (`mode: 'copy'`); a copy needs an id of its own.
  clone: (ticket) => ({ ...ticket, id: crypto.randomUUID() }),
  overlay: TicketOverlay,
});
</script>

<template>
  <section class="column" :class="{ over: isOver, refused: isOver && !isAccepting }">
    <h3>
      {{ column.id }}
      <small v-if="strict">approved only</small>
      <span class="count">{{ column.tickets.length }}</span>
    </h3>
    <ul ref="list" class="tickets">
      <TicketCard v-for="ticket in items" :key="ticket.id" :ticket="ticket" />
    </ul>
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
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

.column.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
  background: color-mix(in srgb, #42b883 6%, transparent);
}

.column.refused {
  border-color: color-mix(in srgb, #ef4444 60%, transparent);
  background: color-mix(in srgb, #ef4444 6%, transparent);
}

h3 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 2px 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

small {
  font-size: 11px;
  font-weight: 500;
  opacity: 0.5;
}

.count {
  margin-left: auto;
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.tickets {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 64px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
