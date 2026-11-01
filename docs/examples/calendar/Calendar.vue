<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useElementSize, useEventListener, useIntervalFn, useNow, useTimeoutFn } from '@vueuse/core';
import Sidebar from './Sidebar.vue';
import Tasks from './Tasks.vue';
import Week from './Week.vue';
import { useCalendar } from './calendar';
import { DAY_MINUTES, mondayOf, monthYear, shortMonth, toDay, weekNumber, year } from './time';

const calendar = useCalendar();
const { canUndo, notice, undo } = calendar;
const root = useTemplateRef<HTMLElement>('root');

// The room decides the layout: the side panel next to the week when both fit, seven days down
// to a phone's width, three on a phone.
const { width } = useElementSize(root);
const wide = computed(() => width.value >= 1000);
const count = computed(() => (width.value && width.value < 520 ? 3 : 7));

// The time line moves twice a minute.
const now = useNow({ scheduler: (tick) => useIntervalFn(tick, 30_000) });
const today = computed(() => toDay(now.value));
const minutes = computed(() => now.value.getHours() * 60 + now.value.getMinutes());

/** The day the view is built around: its week, or on a phone the three days from it. */
const focus = ref(today.value);
const days = computed(() => {
  const first = count.value === 7 ? mondayOf(focus.value) : focus.value;
  return Array.from({ length: count.value }, (_, index) => first + index);
});

/** November 2026 (Nov 2026 on a phone), Oct – Nov 2026, Dec 2026 – Jan 2027 */
const period = computed(() => {
  const first = days.value[0]!;
  const last = days.value.at(-1)!;
  if (monthYear(first) === monthYear(last)) return count.value === 7 ? monthYear(first) : `${shortMonth(first)} ${year(first)}`;
  if (year(first) === year(last)) return `${shortMonth(first)} – ${shortMonth(last)} ${year(last)}`;
  return `${shortMonth(first)} ${year(first)} – ${shortMonth(last)} ${year(last)}`;
});

/** A new hour: the next half hour today, or 9:00 on the first day in view. It is named in place. */
const createNow = () => {
  const isToday = days.value.includes(today.value);
  const start = isToday ? Math.min(Math.ceil((minutes.value + 1) / 30) * 30, DAY_MINUTES - 60) : 9 * 60;
  calendar.create(isToday ? today.value : days.value[0]!, start, 60);
};

// Ctrl+Z (⌘Z) undoes while the calendar has the focus, or nothing has: a deleted event takes
// the focus with it.
useEventListener(document, 'keydown', (event: KeyboardEvent) => {
  const focused = document.activeElement;
  const ours = !focused || focused === document.body || !!root.value?.contains(focused);
  const isUndo = event.key.toLowerCase() === 'z' && (event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey;
  // In the title of a new event, the key undoes the typing.
  if (!ours || !isUndo || focused instanceof HTMLInputElement) return;
  event.preventDefault();
  undo();
});

// The toast says what the last change did, for a few seconds; the pointer or the focus on it
// keeps it.
const toast = ref(false);
const { start: hideLater, stop: keep } = useTimeoutFn(() => (toast.value = false), 6000, { immediate: false });
watch(notice, () => {
  toast.value = true;
  hideLater();
});
</script>

<template>
  <div ref="root" class="calendar">
    <header class="toolbar">
      <button type="button" class="tool" @click="focus = today">Today</button>
      <div class="arrows">
        <button type="button" class="tool square" :aria-label="count === 7 ? 'Previous week' : 'Previous days'" @click="focus -= count">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
        </button>
        <button type="button" class="tool square" :aria-label="count === 7 ? 'Next week' : 'Next days'" @click="focus += count">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
        </button>
      </div>
      <h2 class="period" aria-live="polite">{{ period }}</h2>
      <span v-if="count === 7" class="week-number">W{{ weekNumber(days[0]!) }}</span>
      <div class="actions">
        <button type="button" class="tool square" :disabled="!canUndo" aria-label="Undo" title="Undo (Ctrl+Z)" @click="undo">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 3 2.5 6l3 3M2.5 6h7a4 4 0 0 1 0 8H7" /></svg>
        </button>
        <button type="button" class="tool primary" @click="createNow">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" /></svg>
          <span class="new-label">New event</span>
        </button>
      </div>
    </header>

    <div class="body">
      <Sidebar v-if="wide" :days="days" :today="today" :focus="focus" @pick="focus = $event" />
      <div class="main">
        <Tasks v-if="!wide" row />
        <Week :days="days" :today="today" :minutes="minutes" />
      </div>
    </div>

    <!-- A live region from the start, so screen readers hear every change it shows. -->
    <div class="toast-region" role="status">
      <Transition name="toast">
        <div
          v-if="toast && notice"
          :key="notice.id"
          class="toast"
          @pointerenter="keep"
          @pointerleave="hideLater"
          @focusin="keep"
          @focusout="hideLater"
        >
          <span class="toast-text">{{ notice.text }}</span>
          <button v-if="notice.undoable && canUndo" type="button" class="toast-undo" @click="undo">Undo</button>
          <button type="button" class="toast-close" aria-label="Dismiss" @click="toast = false">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" /></svg>
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* Colours from the text colour and the page's background (`Canvas`): right in light and dark. */
.calendar {
  --line: color-mix(in srgb, currentColor 9%, transparent);
  --line-soft: color-mix(in srgb, currentColor 4.5%, transparent);
  --fill: color-mix(in srgb, currentColor 7%, transparent);
  --muted: color-mix(in srgb, currentColor 55%, transparent);
  --now: #f43f5e;
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 34rem;
  /* In a frame that has a height (full screen), it takes all of it. */
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-radius: 14px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 12%, transparent),
    0 32px 64px -32px rgb(0 0 0 / 0.35);
  font-size: 13px;
  line-height: 1.4;
  container-type: inline-size;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px 10px 14px;
  box-shadow: inset 0 -1px 0 var(--line);
}

.arrows,
.actions {
  display: flex;
  gap: 2px;
}

.actions {
  gap: 6px;
  margin-left: auto;
}

.tool {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  background: none;
  box-shadow: inset 0 0 0 1px var(--line);
  color: inherit;
  font: inherit;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.15s,
    scale 0.1s;
}

.tool:hover:not(:disabled) {
  background: var(--fill);
}

.tool:active:not(:disabled) {
  scale: 0.96;
}

.tool:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.tool:disabled {
  opacity: 0.35;
  cursor: default;
}

.tool.square {
  width: 32px;
  padding: 0;
  box-shadow: none;
}

.tool svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.tool.primary {
  background: #42b883;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.15);
  color: #fff;
  font-weight: 600;
}

.tool.primary:hover {
  background: #3aa776;
}

.period {
  min-width: 0;
  margin: 0 0 0 6px;
  overflow: hidden;
  font-size: 17px;
  font-weight: 650;
  letter-spacing: -0.01em;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.week-number {
  flex-shrink: 0;
  padding: 2px 7px;
  border-radius: 6px;
  background: var(--fill);
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* Narrow: the buttons keep their icons only. */
@container (max-width: 640px) {
  .new-label {
    display: none;
  }

  .tool.primary {
    width: 32px;
    padding: 0;
  }

  .period {
    font-size: 15px;
  }
}

@container (max-width: 420px) {
  .toolbar {
    gap: 4px;
    padding-inline: 10px;
  }

  .tool {
    padding: 0 10px;
  }

  .period {
    margin-left: 2px;
  }
}

.body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.toast-region {
  position: absolute;
  bottom: 16px;
  left: 50%;
  z-index: 10;
  max-width: calc(100% - 32px);
  translate: -50% 0;
  pointer-events: none;
}

/* Dark on a light page, light on a dark one. */
.toast {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px 5px 5px 14px;
  border-radius: 10px;
  background: color-mix(in srgb, CanvasText 90%, Canvas);
  box-shadow: 0 14px 36px -14px rgb(0 0 0 / 0.55);
  color: Canvas;
  font-size: 12.5px;
  pointer-events: auto;
}

.toast-text {
  min-width: 0;
  margin-right: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.toast-undo,
.toast-close {
  flex-shrink: 0;
  height: 28px;
  padding: 0 10px;
  border: 0;
  border-radius: 7px;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.toast-undo {
  color: color-mix(in srgb, #42b883 75%, Canvas);
  font-weight: 700;
}

.toast-close {
  display: grid;
  place-items: center;
  width: 28px;
  padding: 0;
  opacity: 0.6;
}

.toast-undo:hover,
.toast-close:hover {
  background: color-mix(in srgb, Canvas 14%, transparent);
  opacity: 1;
}

.toast-undo:focus-visible,
.toast-close:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 1px;
}

.toast-close svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s,
    translate 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.toast-leave-active {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  translate: 0 8px;
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-from,
  .toast-leave-to {
    translate: none;
  }
}
</style>
