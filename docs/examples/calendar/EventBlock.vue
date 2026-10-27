<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';
import EventCard from './EventCard.vue';
import EventOverlay from './EventOverlay.vue';
import { FIRST_HOUR, HOUR_HEIGHT, type CalendarEvent } from './calendar';

const props = defineProps<{ event: CalendarEvent; indent: number }>();
const el = useTemplateRef<HTMLElement>('el');
// A plain draggable: the week's drag area snaps it to the grid, and its overlay shows the
// time it would land on.
const { isDragging } = makeDraggable(el, {
  id: () => props.event.id,
  data: () => props.event,
  overlay: EventOverlay,
});
</script>

<template>
  <!-- It covers whole cells: its top-left corner is on the grid the overlay snaps to. -->
  <div
    ref="el"
    class="slot"
    :class="{ dragging: isDragging }"
    :style="{
      top: `${(event.start - FIRST_HOUR) * HOUR_HEIGHT}px`,
      height: `${event.duration * HOUR_HEIGHT}px`,
      left: `${indent * 12}px`,
    }"
  >
    <EventCard :title="event.title" :color="event.color" :start="event.start" :duration="event.duration" />
  </div>
</template>

<style scoped>
.slot {
  position: absolute;
  right: 0;
  cursor: grab;
  user-select: none;
}

.slot:focus-visible {
  outline: none;
}

.slot:focus-visible > * {
  outline: 2px solid #42b883;
  outline-offset: 1px;
}

/* Where the event was picked up from. */
.slot.dragging {
  opacity: 0.35;
}
</style>
