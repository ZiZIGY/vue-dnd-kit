<script setup lang="ts">
import { computed } from 'vue';
import { formatTime } from './calendar';

/** What an event looks like, in the week and in hand. */
const props = defineProps<{ title: string; color: string; start: number; duration: number }>();

// Half an hour has room for one line: the title and when it starts.
const short = computed(() => props.duration <= 0.5);
const time = computed(() =>
  short.value ? formatTime(props.start) : `${formatTime(props.start)} – ${formatTime(props.start + props.duration)}`,
);
</script>

<template>
  <div class="event" :class="{ short }" :style="{ '--color': color }">
    <strong>{{ title }}</strong>
    <span class="time">{{ time }}</span>
  </div>
</template>

<style scoped>
.event {
  display: flex;
  flex-direction: column;
  gap: 3px;
  box-sizing: border-box;
  height: calc(100% - 2px);
  margin: 1px 5px 1px 2px;
  padding: 5px 8px;
  overflow: hidden;
  border-left: 3px solid var(--color);
  border-radius: 6px;
  background: color-mix(in srgb, var(--color) 18%, Canvas);
  /* Apart from an event it overlaps. */
  box-shadow: 0 0 0 1px Canvas;
  font-size: 12px;
  line-height: 1.2;
}

.event.short {
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding-block: 0;
}

strong {
  overflow: hidden;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.time {
  font: 10px/1.2 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
  opacity: 0.7;
}
</style>
