<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import StopCard from './Stop.vue';
import { copyStop, type Day } from './trip';

const props = defineProps<{ day: Day }>();
const zone = useTemplateRef<HTMLElement>('zone');
const listRef = useTemplateRef<HTMLElement>('list');

const { items, isOver } = makeSortableList(listRef, {
  id: props.day.id,
  items: toRef(props.day, 'stops'),
  // Lists of one group trade items.
  group: 'trip',
  // Hold Alt while dragging, and the stop is copied instead of moved.
  clone: copyStop,
  // The whole column takes drops, below its last stop too.
  dropzone: zone,
});
</script>

<template>
  <section ref="zone" class="day" :class="{ over: isOver }">
    <h3>
      {{ day.title }}
      <span class="count">{{ items.length }}</span>
    </h3>
    <ul ref="list" class="stops">
      <StopCard v-for="stop in items" :key="stop.id" :stop="stop" />
    </ul>
  </section>
</template>

<style scoped>
.day {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 10px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition:
    border-color 0.2s,
    background 0.2s;
}

.day.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
  background: color-mix(in srgb, #42b883 6%, Canvas);
}

h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

.count {
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.stops {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-height: 176px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
