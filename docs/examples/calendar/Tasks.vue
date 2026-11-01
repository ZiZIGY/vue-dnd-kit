<script setup lang="ts">
import { computed, useId, useTemplateRef } from 'vue';
import { makeDroppable, useDnD } from '@vue-dnd-kit/core';
import EventChip from './EventChip.vue';
import { useCalendar } from './calendar';
import type { DragData, Target } from './placement';

/** The tasks not planned yet: a list in the side panel, a scrolling row above a narrow week. */
defineProps<{ row?: boolean }>();
const calendar = useCalendar();
const { tasks } = calendar;
const el = useTemplateRef<HTMLElement>('el');
const titleId = useId();
const { active } = useDnD();

// It takes planned events back: dropped here, they lose their day and wait among the tasks.
const { isOver } = makeDroppable(el, {
  id: 'tasks',
  data: { kind: 'tasks' } satisfies Target,
  accept: 'event',
  onDrop: ({ active }) => calendar.place(active.id, { day: null, start: null }),
});

/** A planned event is on its way: the list says it takes it. */
const incoming = computed(() => {
  const data = active.value?.data as DragData | undefined;
  return data?.kind === 'event' && data.event.day !== null;
});
</script>

<template>
  <section ref="el" class="tasks" :class="{ row, incoming, over: isOver && incoming }" :aria-labelledby="titleId">
    <h3 :id="titleId" class="section-title">
      Unscheduled
      <span class="count">{{ tasks.length }}</span>
    </h3>
    <ul class="list">
      <li v-for="task in tasks" :key="task.id">
        <EventChip :event="task" />
      </li>
      <li v-if="!tasks.length || incoming" class="drop">Drop here to unschedule</li>
    </ul>
  </section>
</template>

<style scoped>
.tasks {
  --chip-height: 30px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  margin: 0 -6px;
  padding: 6px;
  border-radius: 10px;
  transition: background-color 0.15s;
}

.tasks.over {
  background: color-mix(in srgb, #42b883 9%, transparent);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.count {
  padding: 1px 6px;
  border-radius: 99px;
  background: var(--fill);
  font-size: 10px;
  letter-spacing: 0;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
  /* Room for the focus ring inside the scrolling list. */
  margin: -2px;
  padding: 2px;
  overflow-y: auto;
  list-style: none;
}

.drop {
  display: grid;
  place-items: center;
  height: var(--chip-height);
  padding: 0 10px;
  border: 1.5px dashed color-mix(in srgb, currentColor 18%, transparent);
  border-radius: 6px;
  color: var(--muted);
  font-size: 11.5px;
  white-space: nowrap;
}

.over .drop {
  border-color: #42b883;
  color: #42b883;
}

/* Above a narrow week: one row that scrolls sideways. */
.row {
  --chip-height: 28px;
  flex-direction: row;
  align-items: center;
  margin: 0;
  padding: 8px 12px;
  border-radius: 0;
  box-shadow: inset 0 -1px 0 var(--line);
}

.row .list {
  flex-direction: row;
  flex: 1;
  overflow: auto hidden;
  scrollbar-width: none;
  /* The row fades out at its end: there is more to scroll to. */
  mask-image: linear-gradient(to right, #000 calc(100% - 32px), transparent);
}

.row .list > li {
  flex-shrink: 0;
  max-width: 13rem;
}

/* First in the row, where it is in view. */
.row .drop {
  order: -1;
}
</style>
