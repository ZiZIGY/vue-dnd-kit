<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeDroppable, type Key } from '@vue-dnd-kit/core';
import EventBlock from './EventBlock.vue';
import { startAt, type CalendarEvent } from './calendar';

const props = defineProps<{ day: number; today?: boolean; events: CalendarEvent[] }>();
const emit = defineEmits<{ move: [id: Key, day: number, start: number] }>();

const el = useTemplateRef<HTMLElement>('el');
// The day takes the drop. `position` is where the event's box landed inside it: its top is
// the new start time.
const { isOver } = makeDroppable(el, {
  onDrop: ({ active, position }) => {
    if (position) emit('move', active.id, props.day, startAt(position.y));
  },
});

// Overlapping events cascade: each is indented past those still going on when it starts.
const placed = computed(() => {
  const sorted = [...props.events].sort((a, b) => a.start - b.start);
  return sorted.map((event, index) => ({
    event,
    indent: sorted.slice(0, index).filter((other) => other.start + other.duration > event.start).length,
  }));
});
</script>

<template>
  <div ref="el" class="day" :class="{ today, over: isOver }">
    <EventBlock v-for="{ event, indent } in placed" :key="event.id" :event="event" :indent="indent" />
  </div>
</template>

<style scoped>
/*
 * Lines for the hours and half hours (`--hour`, an hour's height, comes from the week),
 * drawn without borders: the events' offsets start at the very edge.
 */
.day {
  position: relative;
  background-image:
    linear-gradient(color-mix(in srgb, currentColor 12%, transparent) 1px, transparent 1px),
    linear-gradient(color-mix(in srgb, currentColor 5%, transparent) 1px, transparent 1px);
  background-position:
    0 0,
    0 calc(var(--hour) / 2);
  background-size: 100% var(--hour);
  box-shadow: inset 1px 0 0 color-mix(in srgb, currentColor 12%, transparent);
  transition: background-color 0.2s;
}

.day.today {
  background-color: color-mix(in srgb, #42b883 5%, transparent);
}

.day.over {
  background-color: color-mix(in srgb, currentColor 5%, transparent);
}
</style>
