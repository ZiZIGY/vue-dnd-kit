<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeDroppable, useDnD } from '@vue-dnd-kit/core';
import EventCard from './EventCard.vue';
import EventChip from './EventChip.vue';
import { colorOf, useCalendar } from './calendar';
import type { DragData, Target } from './placement';
import type { Day } from './time';

const props = defineProps<{ day: Day; today: boolean }>();
const calendar = useCalendar();
const el = useTemplateRef<HTMLElement>('el');
const { active } = useDnD();

const events = computed(() => calendar.on(props.day).filter((event) => event.start === null));

// An event dropped here keeps its day and loses its time: it is all day. Its length stays,
// for when it goes back to the hours. Edges and empty time have other types: refused.
const { isOver } = makeDroppable(el, {
  id: () => `all-day-${props.day}`,
  data: (): Target => ({ kind: 'all-day', day: props.day }),
  accept: 'event',
  onDrop: ({ active }) => calendar.place(active.id, { day: props.day, start: null }),
});

/** A ghost of the event over the cell, unless it is already all day here. */
const ghost = computed(() => {
  const data = active.value?.data as DragData | undefined;
  if (!isOver.value || data?.kind !== 'event') return null;
  const { event } = data;
  return event.day === props.day && event.start === null ? null : event;
});
</script>

<template>
  <div ref="el" class="cell" :class="{ today, over: !!ghost }">
    <EventChip v-for="event in events" :key="event.id" :event="event" />
    <div v-if="ghost" class="ghost" aria-hidden="true">
      <EventCard :title="ghost.title" :color="colorOf(ghost.calendar)" />
    </div>
  </div>
</template>

<style scoped>
.cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding: 3px 0 4px;
  box-shadow: inset 1px 0 0 var(--line);
  transition: background-color 0.15s;
}

.cell.today {
  background: color-mix(in srgb, #42b883 5%, transparent);
}

.cell.over {
  background: color-mix(in srgb, #42b883 9%, transparent);
}

.ghost {
  height: var(--chip-height, 24px);
  opacity: 0.6;
  animation: appear 0.12s ease-out;
}

.ghost :deep(.face) {
  outline: 1.5px dashed var(--color);
  outline-offset: -1.5px;
}

@keyframes appear {
  from {
    opacity: 0;
  }
}
</style>
