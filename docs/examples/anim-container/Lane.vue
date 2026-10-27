<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import Candidate from './Candidate.vue';

type Person = { id: string; name: string; role: string; hue: number };
const props = defineProps<{ lane: { id: string; title: string; people: Person[] } }>();

const zone = useTemplateRef<HTMLElement>('zone');
const list = useTemplateRef<HTMLElement>('list');
// `isAccepting`: a drag runs that this lane takes. `isOver`: it is over this lane.
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: props.lane.id,
  items: toRef(props.lane, 'people'),
  group: 'pipeline',
  dropzone: zone,
});
</script>

<template>
  <section ref="zone" class="lane" :class="{ ready: isAccepting, over: isOver }">
    <h3>
      <span class="dot" />
      {{ lane.title }}
      <!-- A new element for every count: its animation plays on each change. -->
      <span :key="items.length" class="count">{{ items.length }}</span>
    </h3>
    <ul ref="list" class="people">
      <Candidate v-for="person in items" :key="person.id" :person="person" />
    </ul>
    <p v-if="!items.length" class="empty">Drop a candidate here</p>
  </section>
</template>

<style scoped>
.lane {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  transition:
    background-color 0.25s,
    box-shadow 0.25s;
}

/* A drag runs that this lane takes: it shows it's ready. */
.lane.ready {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, #42b883 35%, transparent);
}

/* The drag is over this lane: it lights up. */
.lane.over {
  background: color-mix(in srgb, #42b883 8%, transparent);
  box-shadow:
    inset 0 0 0 1.5px #42b883,
    0 0 0 4px color-mix(in srgb, #42b883 14%, transparent),
    0 12px 32px -12px color-mix(in srgb, #42b883 45%, transparent);
}

h3 {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 2px 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: color-mix(in srgb, currentColor 30%, transparent);
  transition: background-color 0.25s;
}

.over .dot {
  background: #42b883;
}

.count {
  margin-left: auto;
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.people {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.empty {
  display: grid;
  flex: 1;
  place-items: center;
  min-height: 64px;
  margin: 0;
  border: 1.5px dashed color-mix(in srgb, currentColor 18%, transparent);
  border-radius: 10px;
  font-size: 12px;
  opacity: 0.6;
  transition:
    border-color 0.25s,
    opacity 0.25s;
}

.ready .empty {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
  opacity: 1;
}

@media (prefers-reduced-motion: no-preference) {
  .count {
    animation: bump 0.3s ease-out;
  }

  .over .dot {
    animation: pulse 1s ease-in-out infinite;
  }
}

@keyframes bump {
  40% {
    scale: 1.3;
    background: color-mix(in srgb, #42b883 35%, transparent);
  }
}

@keyframes pulse {
  50% {
    box-shadow: 0 0 0 5px color-mix(in srgb, #42b883 25%, transparent);
  }
}
</style>
