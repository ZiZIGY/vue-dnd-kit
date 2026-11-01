<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue';
import { makeDraggable, useDnD } from '@vue-dnd-kit/core';
import Edge from './Edge.vue';
import EventCard from './EventCard.vue';
import EventOverlay from './EventOverlay.vue';
import { colorOf, useCalendar, type CalendarEvent } from './calendar';
import { resizeTo, sizeOf, type DragData } from './placement';
import { DAY_MINUTES, STEP, clamp, longWeekday, span, toPx } from './time';

/** An event in the hours: `column` of `columns` side by side with the events it overlaps. */
const props = defineProps<{ event: CalendarEvent; column: number; columns: number }>();
const calendar = useCalendar();
const el = useTemplateRef<HTMLElement>('el');

// A plain draggable: the week's drag area snaps it to the days and the quarters of an hour,
// and its overlay says where it would land.
const { isDragging } = makeDraggable(el, {
  id: () => props.event.id,
  type: 'event',
  data: (): DragData => ({ kind: 'event', event: props.event }),
  overlay: EventOverlay,
});

// While one of its edges is dragged, the event takes its new length live: from where that edge
// is in the day (`position`), as the drop will read it.
const { active, position } = useDnD();
const resizing = computed(() => {
  const data = active.value?.data as DragData | undefined;
  return data?.kind === 'edge' && data.event.id === props.event.id ? data.edge : null;
});
const time = computed(() =>
  resizing.value && position.value
    ? resizeTo(props.event, resizing.value, position.value)
    : { start: props.event.start!, duration: props.event.duration },
);
const size = computed(() => sizeOf(time.value.duration));

// A new event is named in place. Enter or Escape keeps the name and gives the focus back to
// the event; clicking elsewhere keeps it too.
const input = useTemplateRef<HTMLInputElement>('input');
const editing = computed(() => calendar.editing.value === props.event.id);
// The title field takes the focus as soon as it shows.
watch(input, (field) => field?.focus(), { flush: 'post' });
const save = () => {
  if (editing.value) calendar.rename(props.event.id, input.value?.value ?? '');
};
const done = () => el.value?.focus();

// On the focused event, Delete removes it, and Shift + arrows change its end by a quarter of an hour.
const onKeydown = (press: KeyboardEvent) => {
  if (press.target !== el.value) return;
  const { start, duration } = props.event;
  if (press.key === 'Delete' || press.key === 'Backspace') {
    press.preventDefault();
    calendar.remove(props.event.id);
  } else if (press.shiftKey && (press.key === 'ArrowUp' || press.key === 'ArrowDown')) {
    press.preventDefault();
    const longer = duration + (press.key === 'ArrowDown' ? STEP : -STEP);
    calendar.resize(props.event.id, { start: start!, duration: clamp(longer, STEP, DAY_MINUTES - start!) });
  }
};
</script>

<template>
  <div
    ref="el"
    class="event"
    :class="[size, { dragging: isDragging, resizing }]"
    :style="{
      top: `${toPx(time.start)}px`,
      height: `${toPx(time.duration)}px`,
      left: `${(column / columns) * 100}%`,
      width: `${100 / columns}%`,
      '--color': colorOf(event.calendar),
    }"
    :aria-label="`${event.title || 'New event'}, ${longWeekday(event.day!)}, ${span(time.start, time.duration)}`"
    @keydown="onKeydown"
  >
    <EventCard :title="event.title" :color="colorOf(event.calendar)" :start="time.start" :duration="time.duration">
      <template v-if="editing" #title>
        <input
          ref="input"
          class="name"
          :value="event.title"
          placeholder="New event"
          aria-label="Event title"
          @keydown.enter.prevent="done"
          @keydown.esc.prevent="done"
          @blur="save"
        />
      </template>
    </EventCard>
    <!-- A quarter of an hour has room for one edge only. Read from the event, not the live
         length: an edge being dragged stays. -->
    <Edge v-if="sizeOf(event.duration) !== 'tiny'" :event="event" edge="start" />
    <Edge :event="event" edge="end" />
  </div>
</template>

<style scoped>
/* On the grid exactly, so its box snaps to the lines; the card inside keeps it off its neighbours. */
.event {
  position: absolute;
  z-index: 1;
  box-sizing: border-box;
  outline: none;
  cursor: grab;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.event:hover :deep(.face) {
  background: color-mix(in srgb, var(--color) 22%, Canvas);
}

.event:focus-visible,
.event:has(.name) {
  z-index: 2;
}

.event:focus-visible :deep(.face),
.event:has(.name) :deep(.face) {
  background: color-mix(in srgb, var(--color) 26%, Canvas);
  box-shadow:
    inset 3px 0 0 var(--color),
    0 0 0 2px var(--color),
    0 6px 16px -8px rgb(0 0 0 / 0.35);
}

/* Its old place while it moves. */
.event.dragging {
  opacity: 0.4;
}

.event.resizing {
  z-index: 2;
}

.event.resizing :deep(.face) {
  box-shadow:
    inset 3px 0 0 var(--color),
    0 0 0 1px color-mix(in srgb, var(--color) 40%, transparent),
    0 10px 24px -10px rgb(0 0 0 / 0.45);
}

/* A grip on the bottom edge says it stretches. */
.event::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  width: 16px;
  height: 3px;
  margin-left: -8px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--color) 70%, currentColor);
  opacity: 0;
  transition: opacity 0.15s;
  pointer-events: none;
}

.event:not(.short, .tiny):hover::after,
.event.resizing:not(.short, .tiny)::after {
  opacity: 0.6;
}

.name {
  width: 100%;
  min-width: 0;
  padding: 0;
  border: 0;
  outline: none;
  background: none;
  color: inherit;
  font: inherit;
  font-weight: 600;
}

.name::placeholder {
  color: inherit;
  opacity: 0.55;
}
</style>
