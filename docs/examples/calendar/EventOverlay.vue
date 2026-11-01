<script setup lang="ts">
import { computed, shallowRef, watchEffect } from 'vue';
import { useDnD, type Active, type DnDStatus, type Over } from '@vue-dnd-kit/core';
import EventCard from './EventCard.vue';
import { colorOf } from './calendar';
import { labelOf, placeOf, type DragData } from './placement';
import { formatDuration } from './time';

// The overlay's props this one reads (see `OverlayProps`).
const props = defineProps<{ active: Active; over: Over | null; status: DnDStatus }>();
const event = computed(() => (props.active.data as Extract<DragData, { kind: 'event' }>).event);

// Where a drop would put the event, live: `position` is where its box is in the target under
// it. Landing, the overlay keeps the last answer.
const { position } = useDnD();
const place = shallowRef(placeOf(event.value, props.over, position.value));
watchEffect(() => {
  if (props.status === 'dragging') place.value = placeOf(event.value, props.over, position.value);
});

// An event from the hours shows the time it would take. Once dropped, the event is where it
// landed: an event dropped all day lands as a chip, a task dropped in the hours as a block.
const start = computed(() => place.value?.start ?? event.value.start);
</script>

<template>
  <div class="lifted" :class="{ landing: status === 'dropping' }">
    <EventCard
      v-if="event.start === null"
      :title="event.title"
      :color="colorOf(event.calendar)"
      :meta="event.day === null ? formatDuration(event.duration) : undefined"
    />
    <EventCard v-else :title="event.title" :color="colorOf(event.calendar)" :start="start ?? undefined" :duration="event.duration" />
    <span v-if="place" class="where">{{ labelOf(place, event.duration) }}</span>
  </div>
</template>

<style scoped>
.lifted {
  position: relative;
  width: 100%;
  height: 100%;
}

.lifted :deep(.face) {
  box-shadow:
    inset 3px 0 0 var(--color),
    0 0 0 1px color-mix(in srgb, var(--color) 30%, transparent),
    0 12px 28px -10px rgb(0 0 0 / 0.45);
}

/* Where it would land, in a tag above it. */
.where {
  position: absolute;
  bottom: calc(100% + 4px);
  left: 1px;
  padding: 3px 7px;
  border-radius: 6px;
  background: color-mix(in srgb, CanvasText 88%, Canvas);
  box-shadow: 0 4px 12px -4px rgb(0 0 0 / 0.4);
  color: Canvas;
  font-size: 11px;
  font-weight: 600;
  line-height: 14px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  transition: opacity 0.15s;
}

/* Settling into its place: the lift and the tag go. */
.landing :deep(.face) {
  box-shadow:
    inset 3px 0 0 var(--color),
    0 0 0 1px color-mix(in srgb, var(--color) 12%, transparent);
}

.landing .where {
  opacity: 0;
}
</style>
