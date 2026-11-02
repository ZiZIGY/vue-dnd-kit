<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';
import EventCard from './EventCard.vue';
import EventOverlay from './EventOverlay.vue';
import { colorOf, type CalendarEvent } from './calendar';
import type { DragData } from './placement';
import { formatDuration } from './time';

/** An all-day event, or a task not planned yet (it shows its length). */
const props = defineProps<{ event: CalendarEvent }>();
const el = useTemplateRef<HTMLElement>('el');

// The same id, data and overlay as in the hours: wherever it lands, the overlay lands on it.
// Arrow keys jump between the days, their all-day cells and the task list ('droppables');
// once in the hours, the week moves it by quarters of an hour.
const { isDragging } = makeDraggable(el, {
  id: () => props.event.id,
  type: 'event',
  data: (): DragData => ({ kind: 'event', event: props.event }),
  overlay: EventOverlay,
  keyboardMode: 'droppables',
});
</script>

<template>
  <div ref="el" class="entry" :class="{ dragging: isDragging }">
    <EventCard
      :title="event.title"
      :color="colorOf(event.calendar)"
      :meta="event.day === null ? formatDuration(event.duration) : undefined"
    />
  </div>
</template>

<style scoped>
.entry {
  height: var(--chip-height, 24px);
  outline: none;
  cursor: grab;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.entry:hover :deep(.face) {
  background: color-mix(in srgb, var(--color) 22%, Canvas);
}

.entry:focus-visible :deep(.face) {
  box-shadow:
    inset 3px 0 0 var(--color),
    0 0 0 2px var(--color);
}

.entry.dragging {
  opacity: 0.4;
}
</style>
