<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useCalendar } from './calendar';
import { dateNumber, firstOfMonth, fullDate, monthYear, mondayOf, weekdayOf, type Day } from './time';

/** A month to jump around in: the days in view are marked, a dot says a day has events. */
const props = defineProps<{ days: Day[]; today: Day; focus: Day }>();
const emit = defineEmits<{ pick: [day: Day] }>();
const calendar = useCalendar();

/** The month shown: the one in view, until its own arrows turn it. */
const month = ref(firstOfMonth(props.focus));
watch(
  () => props.focus,
  (focus) => (month.value = firstOfMonth(focus)),
);

const weeks = computed(() => {
  const first = mondayOf(month.value);
  return Array.from({ length: 6 }, (_, week) => Array.from({ length: 7 }, (_, day) => first + week * 7 + day));
});
const inMonth = (day: Day) => firstOfMonth(day) === month.value;
const band = (day: Day) => {
  if (!props.days.includes(day)) return null;
  return {
    shown: true,
    'band-start': day === props.days[0] || weekdayOf(day) === 0,
    'band-end': day === props.days.at(-1) || weekdayOf(day) === 6,
  };
};
</script>

<template>
  <section class="month" aria-label="Month">
    <header class="month-head">
      <strong>{{ monthYear(month) }}</strong>
      <button type="button" class="turn" aria-label="Previous month" @click="month = firstOfMonth(month, -1)">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
      </button>
      <button type="button" class="turn" aria-label="Next month" @click="month = firstOfMonth(month, 1)">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
      </button>
    </header>
    <div class="dates">
      <span v-for="(name, index) in 'MTWTFSS'" :key="index" class="weekday" aria-hidden="true">{{ name }}</span>
      <template v-for="week in weeks" :key="week[0]">
        <button
          v-for="day in week"
          :key="day"
          type="button"
          class="date"
          :class="[{ outside: !inMonth(day), today: day === today }, band(day)]"
          :aria-label="fullDate(day)"
          :aria-current="day === today ? 'date' : undefined"
          @click="emit('pick', day)"
        >
          {{ dateNumber(day) }}
          <span v-if="calendar.on(day).length" class="dot" aria-hidden="true" />
        </button>
      </template>
    </div>
  </section>
</template>

<style scoped>
.month-head {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 6px;
  padding-left: 4px;
}

.month-head strong {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
}

.turn {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: none;
  color: inherit;
  cursor: pointer;
}

.turn:hover {
  background: var(--fill);
}

.turn svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dates {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 2px;
}

.weekday {
  padding: 4px 0;
  color: var(--muted);
  font-size: 10px;
  font-weight: 600;
  text-align: center;
}

.date {
  position: relative;
  /* Today's disc goes behind the number, not behind the panel. */
  isolation: isolate;
  height: 28px;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
}

/* The days in view: a band across them, rounded where it starts and ends on each row. */
.date.shown {
  background: color-mix(in srgb, #42b883 12%, transparent);
}

.date.band-start {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.date.band-end {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.date:hover {
  background: var(--fill);
  border-radius: 8px;
}

.date.outside {
  color: var(--muted);
}

.date.today {
  color: #fff;
  font-weight: 600;
}

/* Today: a green disc behind the number. */
.date.today::before {
  content: '';
  position: absolute;
  inset: 2px;
  z-index: -1;
  margin: auto;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #42b883;
}

.dot {
  position: absolute;
  bottom: 3px;
  left: 50%;
  width: 3px;
  height: 3px;
  margin-left: -1.5px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.45;
}
</style>
