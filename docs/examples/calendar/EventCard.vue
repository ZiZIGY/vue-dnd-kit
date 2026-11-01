<script setup lang="ts">
import { computed } from 'vue';
import { sizeOf } from './placement';
import { clock, span } from './time';

/**
 * What an event looks like: a block in the hours (given its `start` and `duration`), a chip
 * all day and among the tasks. The overlay shows it too, outside the calendar, so it needs
 * nothing but its props.
 */
const props = defineProps<{
  title: string;
  color: string;
  start?: number;
  duration?: number;
  /** Shown at the end of a chip: a task's length. */
  meta?: string;
}>();

const size = computed(() => (props.duration === undefined ? 'chip' : sizeOf(props.duration)));
// A block of an hour has room for the whole span; a shorter one, on one line, for its start.
const time = computed(() => {
  if (props.start === undefined || props.duration === undefined) return null;
  return size.value ? clock(props.start) : span(props.start, props.duration);
});
</script>

<template>
  <div class="card" :class="size" :style="{ '--color': color }">
    <div class="face">
      <slot name="title">
        <strong class="title">{{ title || 'New event' }}</strong>
      </slot>
      <span v-if="time" class="time">{{ time }}</span>
      <span v-if="meta" class="meta">{{ meta }}</span>
    </div>
  </div>
</template>

<style scoped>
/* The box fills its slot on the grid; the face is inset in it, so neighbours stay apart. */
.card {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 1px 3px 1px 1px;
}

.face {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  padding: 3px 6px 3px 10px;
  overflow: hidden;
  border-radius: 6px;
  background: color-mix(in srgb, var(--color) 15%, Canvas);
  /* The calendar's colour as a bar on the left, the text tinted with it. */
  box-shadow:
    inset 3px 0 0 var(--color),
    0 0 0 1px color-mix(in srgb, var(--color) 12%, transparent);
  color: color-mix(in srgb, var(--color) 38%, currentColor);
  font-size: 12px;
  line-height: 15px;
  transition:
    background-color 0.15s,
    box-shadow 0.15s;
}

.title {
  min-width: 0;
  overflow: hidden;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.time,
.meta {
  flex-shrink: 0;
  font-size: 11px;
  line-height: 13px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  opacity: 0.75;
}

/* One line: half an hour or less, and chips. */
.short .face,
.tiny .face,
.chip .face {
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding-block: 0;
}

.tiny .face {
  font-size: 10px;
  line-height: 10px;
}

.tiny .time {
  font-size: 10px;
}

/* A narrow one-line block leaves its line to the title. (Its width comes from the grid, so it
   can be a size container; a chip's comes from its text.) */
.short,
.tiny {
  container-type: inline-size;
}

@container (max-width: 90px) {
  .short .time,
  .tiny .time {
    display: none;
  }
}

.chip .face {
  padding-right: 8px;
}

.chip .title {
  flex: 1;
  font-weight: 500;
}
</style>
