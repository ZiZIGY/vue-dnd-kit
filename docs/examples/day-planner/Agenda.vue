<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import AgendaRow from './AgendaRow.vue';

type Block = { title: string; minutes: number; color: string };
type Entry = Block & { id: string };

const agenda = ref<Entry[]>([
  { id: 'standup', title: 'Standup', minutes: 15, color: '#3b82f6' },
  { id: 'deep-work', title: 'Focus', minutes: 90, color: '#42b883' },
  { id: 'lunch', title: 'Lunch', minutes: 60, color: '#f59e0b' },
]);

let created = 0;
const list = useTemplateRef<HTMLElement>('list');
// A plain draggable comes in through `createItem`: the entry it returns sits in the draft
// while the block is over the agenda, and becomes real on drop.
const { items } = makeSortableList(list, {
  items: agenda,
  createItem: (active) => ({ ...(active.data as Block), id: `entry-${++created}` }),
});

// Times from 9:00, computed on the draft: they follow the drag.
const DAY_START = 9 * 60;
const clock = (minutes: number) => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
const times = computed(() => {
  let at = DAY_START;
  return items.value.map((entry) => {
    const start = at;
    at += entry.minutes;
    return { start: clock(start), end: clock(at) };
  });
});
const remove = (id: string) => (agenda.value = agenda.value.filter((entry) => entry.id !== id));
</script>

<template>
  <section class="agenda">
    <header>
      <span>Today</span>
      <span class="until">until {{ times.at(-1)?.end ?? clock(DAY_START) }}</span>
    </header>
    <ol ref="list" class="entries">
      <AgendaRow
        v-for="(entry, index) in items"
        :key="entry.id"
        :entry="entry"
        :start="times[index]!.start"
        :end="times[index]!.end"
        @remove="remove(entry.id)"
      />
    </ol>
  </section>
</template>

<style scoped>
.agenda {
  flex: 1;
  min-width: 0;
  max-width: 320px;
}

header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 0 0 12px 48px;
  font-size: 14px;
  font-weight: 700;
}

.until {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  font-weight: 400;
  opacity: 0.55;
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 220px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
