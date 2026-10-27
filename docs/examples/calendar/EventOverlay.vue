<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import { useDnD, type DnDStatus, type DragItem } from '@vue-dnd-kit/core';
import EventCard from './EventCard.vue';
import { startAt, type CalendarEvent } from './calendar';

// The overlay's props this one reads (see `OverlayProps`).
const props = defineProps<{ items: DragItem[]; status: DnDStatus }>();
const event = computed(() => props.items[0]!.data as CalendarEvent);

// The time it would land on, as it moves: `position` is the top-left corner of its box in
// the day under it. Landing, it keeps the last one.
const { position } = useDnD();
const start = shallowRef(event.value.start);
watch(position, (at) => {
  if (at) start.value = startAt(at.y);
});
</script>

<template>
  <EventCard
    class="lifted"
    :class="{ landing: status === 'dropping' }"
    :title="event.title"
    :color="event.color"
    :start="start"
    :duration="event.duration"
  />
</template>

<style scoped>
.lifted {
  box-shadow:
    0 0 0 1px Canvas,
    0 16px 28px -12px rgb(0 0 0 / 0.55);
  transition: box-shadow 0.2s;
}

.lifted.landing {
  box-shadow: 0 0 0 1px Canvas;
}
</style>
