<script setup lang="ts">
import { provide } from 'vue';
import { DnDProvider, type Announcements } from '@vue-dnd-kit/core';
import Calendar from './Calendar.vue';
import { CALENDAR, createCalendar } from './calendar';
import { spokenOf, type DragData } from './placement';
import { toDay } from './time';

// The calendar's state, shared by every component under it.
provide(CALENDAR, createCalendar(toDay(new Date())));

/** The event a drag carries; edges and empty time carry none. */
const eventOf = (data: unknown) => ((data as DragData).kind === 'event' ? (data as Extract<DragData, { kind: 'event' }>).event : null);

// Screen readers hear titles and times, not ids. Where a keyboard drag would land is spoken by
// the week as the arrows move it, and what a drop changed by the toast: the live region
// stays quiet for both.
const announcements: Partial<Announcements> = {
  onDragStart: ({ active }) => {
    const event = eventOf(active.data);
    if (!event) return '';
    const keys =
      active.sensor === 'keyboard'
        ? ' Arrow keys move it by a quarter of an hour and by a day, with Shift by an hour. Space drops it, Escape cancels.'
        : '';
    return `Picked up ${event.title}, ${spokenOf(event, event.duration)}.${keys}`;
  },
  onDragOver: () => '',
  onDragEnd: () => '',
  onDragCancel: ({ active }) => {
    const event = eventOf(active.data);
    return event ? `${event.title} stays where it was.` : '';
  },
};
</script>

<template>
  <DnDProvider :announcements="announcements">
    <Calendar />
  </DnDProvider>
</template>
