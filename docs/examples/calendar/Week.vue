<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeDragArea, snapToGrid, useDnDMonitor, type Key } from '@vue-dnd-kit/core';
import DayColumn from './DayColumn.vue';
import { DAY_WIDTH, FIRST_HOUR, HOUR_HEIGHT, LAST_HOUR, formatTime, type CalendarEvent } from './calendar';

const DAYS = [
  { name: 'Mon', date: 26 },
  { name: 'Tue', date: 27, today: true },
  { name: 'Wed', date: 28 },
  { name: 'Thu', date: 29 },
  { name: 'Fri', date: 30 },
];
const HOURS = Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }, (_, index) => FIRST_HOUR + index);

const events = ref<CalendarEvent[]>([
  { id: 'standup', title: 'Standup', day: 0, start: 9.5, duration: 0.5, color: '#3b82f6' },
  { id: 'roadmap', title: 'Roadmap sync', day: 0, start: 13, duration: 1.5, color: '#a855f7' },
  { id: 'review', title: 'Design review', day: 1, start: 10, duration: 1, color: '#ec4899' },
  { id: 'check-in', title: 'Check-in', day: 1, start: 14.5, duration: 0.5, color: '#f59e0b' },
  { id: 'focus', title: 'Focus time', day: 2, start: 9, duration: 2, color: '#42b883' },
  { id: 'lunch', title: 'Lunch with Sam', day: 2, start: 12.5, duration: 1, color: '#f97316' },
  { id: 'demo', title: 'Client demo', day: 3, start: 11, duration: 1, color: '#3b82f6' },
  { id: 'retro', title: 'Sprint retro', day: 4, start: 15, duration: 1.5, color: '#a855f7' },
]);

const eventsOn = (day: number) => events.value.filter((event) => event.day === day);
const move = (id: Key, day: number, start: number) => {
  const event = events.value.find((item) => item.id === id);
  if (event) Object.assign(event, { day, start });
};

const days = useTemplateRef<HTMLElement>('days');
// Rules for the drags that start in the week: they snap to its cells, a day wide and half
// an hour high (gliding from one to the next), and stay inside it.
makeDragArea(days, {
  modifiers: [snapToGrid({ x: DAY_WIDTH, y: HOUR_HEIGHT / 2, smooth: true })],
  restrictToArea: true,
});

// Keyboard drags: an arrow moves the event by one cell, a day or half an hour.
useDnDMonitor({
  getKeyboardCoordinates: (_event, { pointer, direction }) => ({
    x: pointer.x + direction.x * DAY_WIDTH,
    y: pointer.y + (direction.y * HOUR_HEIGHT) / 2,
  }),
});
</script>

<template>
  <div class="calendar">
    <div class="week" :style="{ '--day': `${DAY_WIDTH}px`, '--hour': `${HOUR_HEIGHT}px` }">
      <span class="corner">W44</span>
      <div v-for="day in DAYS" :key="day.name" class="day-name" :class="{ today: day.today }">
        <span>{{ day.name }}</span>
        <strong>{{ day.date }}</strong>
      </div>
      <div class="hours">
        <span v-for="hour in HOURS" :key="hour" :style="{ top: `${(hour - FIRST_HOUR) * HOUR_HEIGHT}px` }">
          {{ formatTime(hour) }}
        </span>
      </div>
      <div ref="days" class="days" :style="{ height: `${(LAST_HOUR - FIRST_HOUR) * HOUR_HEIGHT}px` }">
        <DayColumn
          v-for="(day, index) in DAYS"
          :key="day.name"
          :day="index"
          :today="day.today"
          :events="eventsOn(index)"
          @move="move"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* On a narrow screen the week scrolls sideways. */
.calendar {
  overflow-x: auto;
}

.week {
  display: grid;
  grid-template-columns: 48px repeat(5, var(--day));
  width: max-content;
  margin: 0 auto;
  padding: 0 4px 8px;
}

.corner {
  align-self: end;
  padding-bottom: 12px;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.45;
}

.day-name {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px 12px;
}

.day-name span {
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.55;
}

.day-name strong {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 15px;
  font-weight: 600;
}

.day-name.today span {
  color: #42b883;
  opacity: 1;
}

.day-name.today strong {
  background: #42b883;
  color: #fff;
}

/* The hour labels sit on the lines. */
.hours {
  position: relative;
}

.hours span {
  position: absolute;
  right: 10px;
  translate: 0 -50%;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.45;
}

/* The drag area: exactly five days wide and the hours high, the grid starting at its corner. */
.days {
  display: grid;
  grid-column: 2 / -1;
  grid-template-columns: repeat(5, var(--day));
  box-shadow:
    inset 0 -1px 0 color-mix(in srgb, currentColor 12%, transparent),
    inset -1px 0 0 color-mix(in srgb, currentColor 12%, transparent);
}
</style>
