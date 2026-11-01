<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeDraggable, makeDroppable, useDnD } from '@vue-dnd-kit/core';
import EventBlock from './EventBlock.vue';
import EventCard from './EventCard.vue';
import { colorOf, useCalendar } from './calendar';
import { layoutDay, placeOf, rangeOf, resizeTo, type DragData, type Target } from './placement';
import { STEP, STEP_PX, clock, isWeekend, toPx, type Day } from './time';

const props = defineProps<{ day: Day; today: boolean }>();
const calendar = useCalendar();
const el = useTemplateRef<HTMLElement>('el');
const lane = useTemplateRef<HTMLElement>('lane');
const { active, over, position } = useDnD();

const slots = computed(() => layoutDay(calendar.on(props.day).filter((event) => event.start !== null)));

// The day's hours take any event: from the hours, all day or the task list. Of edges and
// empty time, only this day's. `position` is where the dragged box landed in the day.
const { isOver } = makeDroppable(el, {
  id: () => `hours-${props.day}`,
  data: (): Target => ({ kind: 'hours', day: props.day }),
  accept: ({ active }) => {
    const data = active.data as DragData;
    return data.kind === 'event' || (data.kind === 'edge' ? data.event.day : data.day) === props.day;
  },
  onDrop: ({ active, over, position }) => {
    const data = active.data as DragData;
    if (!position) return;
    if (data.kind === 'event') {
      const place = placeOf(data.event, over, position);
      if (place) calendar.place(data.event.id, place);
    } else if (data.kind === 'edge') {
      calendar.resize(data.event.id, resizeTo(data.event, data.edge, position));
    } else {
      const { start, duration } = rangeOf(data.from, data.from + position.y);
      calendar.create(props.day, start, duration);
    }
  },
});

// Empty time is a draggable too, under the events: press and drag to draw a new one. It has no
// overlay and stays put: how far its box went (`position`) is how far the pointer went from
// the press, snapped to quarters of an hour by the week's drag area.
const from = ref(0);
makeDraggable(lane, {
  id: () => `new-${props.day}`,
  type: 'new',
  data: (): DragData => ({ kind: 'new', day: props.day, from: from.value }),
  overlay: false,
  axis: 'y',
  // The New event button is the keyboard's way: no tab stop for every day.
  attributes: false,
});
const offsetIn = (event: MouseEvent) => event.clientY - lane.value!.getBoundingClientRect().top;
const press = (event: PointerEvent) => (from.value = offsetIn(event));

/** A double click creates an hour from the quarter under the pointer. */
const createAt = (event: MouseEvent) => {
  const start = Math.min(Math.floor(offsetIn(event) / STEP_PX) * STEP, 23 * 60);
  calendar.create(props.day, start, 60);
};

/** The quarter of an hour under the mouse, marked so empty time looks like something to drag. */
const hover = ref<number | null>(null);
const track = (event: PointerEvent) => {
  hover.value = event.pointerType === 'mouse' ? Math.floor(offsetIn(event) / STEP_PX) * STEP : null;
};

/**
 * What the day shows while something is dragged over it: the event being drawn, or where a
 * task or an all-day event would land. Events from the hours need none: their overlay snaps.
 */
const preview = computed(() => {
  const data = active.value?.data as DragData | undefined;
  if (!data || !isOver.value || !position.value) return null;
  if (data.kind === 'new') {
    const color = colorOf(calendar.fresh.value);
    return { title: 'New event', color, drawing: true, ...rangeOf(data.from, data.from + position.value.y) };
  }
  if (data.kind !== 'event' || data.event.start !== null) return null;
  const place = placeOf(data.event, over.value, position.value);
  if (place?.start == null) return null;
  const { title, calendar: id, duration } = data.event;
  return { title, color: colorOf(id), drawing: false, start: place.start, duration };
});
</script>

<template>
  <div ref="el" class="day" :class="{ today, weekend: isWeekend(day) }">
    <div ref="lane" class="lane" @pointerdown="press" @pointermove="track" @pointerleave="hover = null" @dblclick="createAt" />
    <div v-if="hover !== null && !active" class="hint" :style="{ top: `${toPx(hover)}px` }" aria-hidden="true">
      {{ clock(hover) }}
    </div>
    <EventBlock v-for="slot in slots" :key="slot.event.id" :event="slot.event" :column="slot.column" :columns="slot.columns" />
    <div
      v-if="preview"
      class="preview"
      :class="{ drawing: preview.drawing }"
      :style="{ top: `${toPx(preview.start)}px`, height: `${toPx(preview.duration)}px` }"
      aria-hidden="true"
    >
      <EventCard :title="preview.title" :color="preview.color" :start="preview.start" :duration="preview.duration" />
    </div>
  </div>
</template>

<style scoped>
/* Lines for the hours, and fainter ones for the half hours, drawn without borders: the
   events' offsets start at the very top. */
.day {
  position: relative;
  min-width: 0;
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(var(--line-soft) 1px, transparent 1px);
  background-position:
    0 0,
    0 calc(var(--hour) / 2);
  background-size: 100% var(--hour);
  box-shadow: inset 1px 0 0 var(--line);
}

.day.weekend {
  background-color: color-mix(in srgb, currentColor 2.5%, transparent);
}

.day.today {
  background-color: color-mix(in srgb, #42b883 5%, transparent);
}

.lane {
  position: absolute;
  inset: 0;
  cursor: cell;
}

.hint {
  position: absolute;
  right: 3px;
  left: 1px;
  height: var(--step);
  padding-left: 6px;
  border-radius: 4px;
  background: color-mix(in srgb, #42b883 12%, transparent);
  color: color-mix(in srgb, #42b883 70%, currentColor);
  font-size: 10px;
  line-height: var(--step);
  font-variant-numeric: tabular-nums;
  pointer-events: none;
}

.preview {
  position: absolute;
  right: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
  animation: appear 0.12s ease-out;
}

/* Where a task lands: a ghost of it. */
.preview:not(.drawing) {
  opacity: 0.6;
}

.preview :deep(.face) {
  outline: 1.5px dashed var(--color);
  outline-offset: -1.5px;
}

.preview.drawing :deep(.face) {
  outline: 0;
  box-shadow:
    inset 3px 0 0 var(--color),
    0 0 0 1px var(--color),
    0 8px 20px -10px rgb(0 0 0 / 0.4);
}

@keyframes appear {
  from {
    opacity: 0;
  }
}
</style>
