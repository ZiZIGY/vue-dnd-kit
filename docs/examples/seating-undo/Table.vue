<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import GuestRow from './GuestRow.vue';
import type { Seating } from './store';

const props = defineProps<{ id: string; title: string; seating: Seating }>();

const list = useTemplateRef<HTMLElement>('list');
// `items` is a getter: read-only, so the library never writes it. Each drop goes to the
// store instead: `preventDefault()` skips the write, and `e.result` holds the new arrays
// of every table the drop changes.
const { items, isOver } = makeSortableList(list, {
  id: props.id,
  items: () => props.seating.state.tables[props.id]!,
  group: 'seating',
  strategy: 'grid',
  onDrop: (e) => {
    e.preventDefault();
    const who = e.items.map((guest) => guest.name).join(', ');
    props.seating.apply(e.result, e.sameList ? `${who}: new seat at ${props.title}` : `${who} → ${props.title}`);
  },
});
</script>

<template>
  <section class="seat-table" :class="{ over: isOver }">
    <h4>{{ title }}</h4>
    <ul ref="list" class="guests">
      <GuestRow v-for="guest in items" :key="guest.id" :guest="guest" />
    </ul>
  </section>
</template>

<style scoped>
.seat-table {
  flex: 1;
  min-width: 0;
  padding: 12px;
  border: 1.5px solid color-mix(in srgb, currentColor 11%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition:
    border-color 0.2s,
    background 0.2s;
}

.seat-table.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
  background: color-mix(in srgb, #42b883 6%, Canvas);
}

h4 {
  margin: 0 0 10px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

.guests {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 6px;
  min-height: 78px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
