<script setup lang="ts">
import MiniMonth from './MiniMonth.vue';
import Tasks from './Tasks.vue';
import { CALENDARS, useCalendar, type CalendarId } from './calendar';
import type { Day } from './time';

/** The side panel of a wide calendar: the month, the calendars to show, the tasks to plan. */
defineProps<{ days: Day[]; today: Day; focus: Day }>();
const emit = defineEmits<{ pick: [day: Day] }>();
const { hidden } = useCalendar();

const toggle = (id: CalendarId) => {
  if (hidden.has(id)) hidden.delete(id);
  else hidden.add(id);
};
</script>

<template>
  <aside class="side">
    <MiniMonth :days="days" :today="today" :focus="focus" @pick="emit('pick', $event)" />

    <section class="calendars" aria-label="Calendars">
      <h3 class="section-title">Calendars</h3>
      <label v-for="calendar in CALENDARS" :key="calendar.id" class="toggle" :style="{ '--color': calendar.color }">
        <input type="checkbox" :checked="!hidden.has(calendar.id)" @change="toggle(calendar.id)" />
        <span class="box" aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="m4 8.5 2.5 2.5L12 5.5" /></svg>
        </span>
        {{ calendar.name }}
      </label>
    </section>

    <Tasks class="rest" />
  </aside>
</template>

<style scoped>
.side {
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 15rem;
  flex-shrink: 0;
  box-sizing: border-box;
  min-height: 0;
  padding: 14px 14px 12px;
  overflow: hidden;
  box-shadow: inset -1px 0 0 var(--line);
}

.section-title {
  margin: 0 0 6px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.toggle {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 -6px;
  padding: 5px 6px;
  border-radius: 7px;
  font-size: 13px;
  cursor: pointer;
}

.toggle:hover {
  background: var(--fill);
}

/* The real checkbox is kept for keyboards and screen readers, under a square in the calendar's colour. */
.toggle input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.box {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  border-radius: 5px;
  background: var(--color);
  box-shadow: inset 0 0 0 1.5px var(--color);
  transition: background-color 0.15s;
}

.box svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: #fff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.toggle input:not(:checked) + .box {
  background: transparent;
}

.toggle input:not(:checked) + .box svg {
  opacity: 0;
}

.toggle input:focus-visible + .box {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* The task list takes the rest of the panel, and scrolls. */
.rest {
  flex: 1;
}
</style>
