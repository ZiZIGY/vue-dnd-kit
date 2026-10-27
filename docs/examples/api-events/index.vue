<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import { describe, type LoggedEvent } from './describe';
import TaskColumn from './TaskColumn.vue';
import EventInspector from './EventInspector.vue';

const todo = ref([
  { id: 'docs', title: 'Write docs' },
  { id: 'bug', title: 'Fix #42' },
]);
const done = ref([{ id: 'ship', title: 'Ship v3' }]);

// Every event of the drag, described when it fires. A new drag starts a new log;
// moves fire every frame, so they share one entry, which keeps the latest.
const events = ref<LoggedEvent[]>([]);
let count = 0;
const record = (name: string, type: string, payload: unknown) => {
  if (name === 'onDragStart') events.value = [];
  const lines = describe(type, payload);
  const move = name === 'onDragMove' && events.value.find((event) => event.name === name);
  if (move) Object.assign(move, { lines, count: move.count + 1 });
  else events.value.push({ id: ++count, name, type, lines, count: 1 });
};
</script>

<template>
  <DnDProvider>
    <div class="demo">
      <div class="columns">
        <TaskColumn id="todo" v-model="todo" :record="record" />
        <TaskColumn id="done" v-model="done" :record="record" />
      </div>
      <EventInspector :events="events" :record="record" />
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
}

.columns {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 168px;
}
</style>
