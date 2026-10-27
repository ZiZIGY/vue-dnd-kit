<script setup lang="ts">
import { reactive, ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Rotation from './Rotation.vue';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const columns = reactive([
  {
    id: 'primary',
    title: 'Primary',
    people: [
      { id: 'ava', name: 'Ava', hue: 160 },
      { id: 'ben', name: 'Ben', hue: 20 },
      { id: 'cleo', name: 'Cleo', hue: 280 },
      { id: 'dev', name: 'Dev', hue: 210 },
      { id: 'eli', name: 'Eli', hue: 45 },
    ],
  },
  {
    id: 'backup',
    title: 'Backup',
    people: [
      { id: 'fay', name: 'Fay', hue: 330 },
      { id: 'gus', name: 'Gus', hue: 100 },
      { id: 'hana', name: 'Hana', hue: 190 },
      { id: 'ivo', name: 'Ivo', hue: 0 },
      { id: 'jun', name: 'Jun', hue: 250 },
    ],
  },
]);

/** Live: the swap shows while you drag. On drop: nothing moves, the partner is marked. */
const placeholder = ref<'item' | 'indicator'>('item');
const last = ref('');
</script>

<template>
  <DnDProvider>
    <div class="schedule">
      <div class="modes" role="group" aria-label="Swap preview">
        <button type="button" :aria-pressed="placeholder === 'item'" @click="placeholder = 'item'">Live</button>
        <button type="button" :aria-pressed="placeholder === 'indicator'" @click="placeholder = 'indicator'">On drop</button>
      </div>
      <div class="week">
        <ol class="days">
          <li v-for="day in DAYS" :key="day">{{ day }}</li>
        </ol>
        <Rotation v-for="column in columns" :key="column.id" :column="column" :placeholder="placeholder" @swap="last = $event" />
      </div>
      <p class="last">{{ last ? `Swapped ${last}` : 'Drag a person onto another' }}</p>
    </div>
  </DnDProvider>
</template>

<style scoped>
.schedule {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.modes {
  display: flex;
  padding: 3px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

.modes button {
  padding: 6px 12px;
  border: 0;
  border-radius: 7px;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  opacity: 0.6;
  cursor: pointer;
}

.modes button[aria-pressed='true'] {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
  opacity: 1;
}

.week {
  display: flex;
  gap: 10px;
  width: 400px;
  max-width: 100%;
}

.days {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 21px 0 0;
  padding: 0;
  list-style: none;
}

.days li {
  height: 36px;
  font: 11px/36px ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.last {
  margin: 0;
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}
</style>
