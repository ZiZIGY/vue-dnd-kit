<script setup lang="ts">
import { computed, onMounted, useTemplateRef, watch } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { makeDragArea, useDnD, useDnDMonitor, type Modifier } from '@vue-dnd-kit/core';
import AllDayCell from './AllDayCell.vue';
import DayColumn from './DayColumn.vue';
import { placeOf, spokenOf, type DragData, type Target } from './placement';
import { HOUR_PX, STEP_PX, clock, dateNumber, shortWeekday, toPx, type Day } from './time';

/** The days in view, today, and the time now (minutes) for the line across the hours. */
const props = defineProps<{ days: Day[]; today: Day; minutes: number }>();
const scroller = useTemplateRef<HTMLElement>('scroller');
const grid = useTemplateRef<HTMLElement>('grid');
const heads = useTemplateRef<HTMLElement>('heads');
const { active, over, position } = useDnD();

/**
 * The hours' own modifier. Over the days, the dragged box moves by whole days, as many as the
 * pointer crossed (an event beside another keeps its place in the day), and its top snaps to
 * the quarters of an hour of the day it started in (`containerRect`, which follows the scroll).
 * It runs first, so `origin + transform` is the pointer.
 */
const snapToWeek: Modifier = ({ transform, overlayRect, containerRect, origin }) => {
  const days = grid.value?.getBoundingClientRect();
  if (!days || !containerRect) return transform;
  const width = days.width / props.days.length;
  const column = (x: number) => Math.floor((x - days.left) / width);
  const pointer = origin.x + transform.x;
  const x = pointer < days.left || pointer >= days.right ? transform.x : (column(pointer) - column(origin.x)) * width;
  const top = overlayRect.top - containerRect.top;
  return { x, y: transform.y + Math.round(top / STEP_PX) * STEP_PX - top };
};

// Rules for every drag that starts in the hours: an event, one of its edges, or empty time.
// The hours auto-scroll near their ends for any drag, from a narrower edge than the default:
// the all-day row right above them stays easy to reach.
makeDragArea(grid, { modifiers: [snapToWeek], autoScroll: { threshold: 0.12 } });

// Keyboard drags over the hours: up and down by a quarter of an hour (with Shift, an hour),
// left and right by a day. Elsewhere (the task list, the all-day row) the library's own
// moves apply.
useDnDMonitor({
  getKeyboardCoordinates: (key, { pointer, direction }) => {
    const hours = scroller.value;
    if ((over.value?.data as Target | undefined)?.kind !== 'hours' || !hours || !grid.value) return undefined;
    const dy = direction.y * STEP_PX * (key.shiftKey ? 4 : 1);
    const next = { x: pointer.x + direction.x * (grid.value.offsetWidth / props.days.length), y: pointer.y + dy };
    // Keyboard drags don't auto-scroll: near an end of the hours in view, the arrow scrolls
    // them instead, and the event goes on in time where it is on the screen.
    const view = hours.getBoundingClientRect();
    const canScroll = dy < 0 ? hours.scrollTop > 0 : hours.scrollTop + hours.clientHeight < hours.scrollHeight;
    if (canScroll && (next.y < view.top + HOUR_PX || next.y > view.bottom - HOUR_PX)) {
      hours.scrollTop += dy;
      return { x: next.x, y: pointer.y };
    }
    return next;
  },
});

/** For screen readers: where a keyboard drag would land, as the arrows move it. */
const spoken = computed(() => {
  const data = active.value?.data as DragData | undefined;
  if (active.value?.sensor !== 'keyboard' || data?.kind !== 'event') return '';
  const place = placeOf(data.event, over.value, position.value);
  return place ? spokenOf(place, data.event.duration) : '';
});

const todayAt = computed(() => props.days.indexOf(props.today));
/** "GMT+2", in the corner above the hours. */
const zone = new Intl.DateTimeFormat('en-US', { timeZoneName: 'shortOffset' })
  .formatToParts(new Date())
  .find((part) => part.type === 'timeZoneName')?.value;

// Open on the working day, or on now when today is in view and it is daytime.
let scrolled = 0;
onMounted(() => {
  const hours = scroller.value!;
  const day = props.minutes >= 7 * 60 && props.minutes <= 21 * 60;
  hours.scrollTop = toPx(todayAt.value >= 0 && day ? props.minutes : 8 * 60) - hours.clientHeight / 3;
  scrolled = hours.scrollTop;
});
// Moved elsewhere in the page (a full-screen view takes it to <body>), an element loses its
// scroll: the hours keep theirs.
const keepScroll = () => (scrolled = scroller.value!.scrollTop);
useResizeObserver(scroller, () => {
  if (scroller.value) scroller.value.scrollTop = scrolled;
});

// Turning the week, its days slide in from the side it went to.
watch(
  () => props.days[0]!,
  (first, before) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const from = `translateX(${first > before ? 32 : -32}px)`;
    for (const element of [heads.value, grid.value]) {
      element?.animate([{ opacity: 0, transform: from }, { opacity: 1, transform: 'none' }], {
        duration: 280,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      });
    }
  },
);
</script>

<template>
  <div class="week" :style="{ '--days': days.length }">
    <div class="head">
      <div class="labels" aria-hidden="true">
        <span class="zone">{{ zone }}</span>
        <span class="all-day">All day</span>
      </div>
      <div ref="heads" class="heads">
        <div v-for="day in days" :key="day" class="day-name" :class="{ today: day === today }">
          <span class="weekday">{{ shortWeekday(day) }}</span>
          <span class="number">{{ dateNumber(day) }}</span>
        </div>
        <AllDayCell v-for="day in days" :key="day" :day="day" :today="day === today" />
      </div>
    </div>

    <div ref="scroller" class="scroller" @scroll.passive="keepScroll">
      <div class="hours">
        <div class="gutter" aria-hidden="true">
          <span
            v-for="hour in 23"
            :key="hour"
            class="hour"
            :class="{ near: todayAt >= 0 && Math.abs(minutes - hour * 60) < 20 }"
            :style="{ top: `${toPx(hour * 60)}px` }"
          >
            {{ clock(hour * 60) }}
          </span>
          <span v-if="todayAt >= 0" class="now-time" :style="{ top: `${toPx(minutes)}px` }">{{ clock(minutes) }}</span>
        </div>
        <div ref="grid" class="days">
          <DayColumn v-for="day in days" :key="day" :day="day" :today="day === today" />
          <div v-if="todayAt >= 0" class="now" :style="{ top: `${toPx(minutes)}px`, '--today': todayAt }" aria-hidden="true" />
        </div>
      </div>
    </div>

    <p class="spoken" aria-live="polite">{{ spoken }}</p>
  </div>
</template>

<style scoped>
.week {
  --gutter: 56px;
  --hour: 48px; /* HOUR_PX */
  --step: 12px; /* STEP_PX */
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  user-select: none;
}

/* The days' names and the all-day row. It keeps the room of the hours' scrollbar, so the
   columns line up with theirs. */
.head {
  position: relative;
  z-index: 4;
  display: grid;
  grid-template-columns: var(--gutter) 1fr;
  overflow: hidden;
  scrollbar-gutter: stable;
  box-shadow:
    0 1px 0 var(--line),
    0 6px 12px -10px rgb(0 0 0 / 0.25);
}

.labels {
  display: grid;
  grid-template-rows: 44px auto;
  color: var(--muted);
  font-size: 10px;
  text-align: right;
}

.zone {
  align-self: end;
  padding: 0 8px 6px 0;
  font-variant-numeric: tabular-nums;
}

.all-day {
  padding: 8px 8px 0 0;
}

.heads {
  display: grid;
  grid-template-columns: repeat(var(--days), minmax(0, 1fr));
  grid-template-rows: 44px auto;
}

.day-name {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  padding: 0 10px;
  box-shadow: inset 1px 0 0 var(--line);
  white-space: nowrap;
}

.weekday {
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.number {
  min-width: 28px;
  font-size: 19px;
  font-weight: 600;
  line-height: 28px;
  font-variant-numeric: tabular-nums;
}

.today .weekday {
  color: #42b883;
}

.today .number {
  border-radius: 14px;
  background: #42b883;
  color: #fff;
  text-align: center;
}

.scroller {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
}

.hours {
  display: grid;
  grid-template-columns: var(--gutter) 1fr;
  height: calc(24 * var(--hour));
  padding-bottom: 1px;
}

.gutter {
  position: relative;
}

/* Each hour's label sits on its line. */
.hour,
.now-time {
  position: absolute;
  right: 8px;
  translate: 0 -50%;
  font-size: 10.5px;
  line-height: 14px;
  font-variant-numeric: tabular-nums;
}

.hour {
  color: var(--muted);
  transition: opacity 0.2s;
}

.hour.near {
  opacity: 0;
}

.now-time {
  right: 4px;
  z-index: 1;
  padding: 1px 5px;
  border-radius: 5px;
  background: var(--now);
  color: #fff;
  font-weight: 600;
}

.days {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--days), minmax(0, 1fr));
  box-shadow: inset -1px 0 0 var(--line);
}

/* Now: a faint line across the week, a strong one across today. */
.now {
  position: absolute;
  right: 0;
  left: 0;
  z-index: 3;
  border-top: 1px solid color-mix(in srgb, var(--now) 45%, transparent);
  pointer-events: none;
}

.now::before,
.now::after {
  content: '';
  position: absolute;
  left: calc(var(--today) * 100% / var(--days));
  background: var(--now);
}

.now::before {
  top: -1.5px;
  width: calc(100% / var(--days));
  height: 2px;
}

.now::after {
  top: -5.5px;
  width: 10px;
  height: 10px;
  margin-left: -5px;
  border-radius: 50%;
}

/* On a phone, a narrower column of hours. */
@container (max-width: 560px) {
  .week {
    --gutter: 44px;
  }

  .day-name {
    padding: 0 6px;
  }
}

.spoken {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
