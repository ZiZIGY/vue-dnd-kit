<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import TaskList from './TaskList.vue';

const fit = ref<'slot' | 'source'>('slot');

const inbox = ref([
  { id: 'a', title: 'Call the bank', project: '#f59e0b', time: '15m' },
  { id: 'b', title: 'Book flights', project: '#3b82f6', time: '30m' },
  { id: 'c', title: 'Water the plants', project: '#42b883', time: '5m' },
]);
const today = ref([
  { id: 'd', title: 'Review the pull request', project: '#a855f7', time: '1h' },
  { id: 'e', title: 'Write the release notes', project: '#3b82f6', time: '45m' },
]);
</script>

<template>
  <!-- `overlayFit` is a provider prop: it sizes the overlay of every drag. -->
  <DnDProvider :overlay-fit="fit">
    <div class="fit">
      <div class="controls">
        <code>overlayFit</code>
        <div class="segmented" role="group" aria-label="overlayFit">
          <button type="button" :aria-pressed="fit === 'slot'" @click="fit = 'slot'">'slot'</button>
          <button type="button" :aria-pressed="fit === 'source'" @click="fit = 'source'">'source'</button>
        </div>
      </div>
      <div class="lists">
        <TaskList id="inbox" v-model:tasks="inbox" title="Inbox" />
        <TaskList id="today" v-model:tasks="today" title="Today" wide />
      </div>
    </div>
  </DnDProvider>
</template>

<style scoped>
.fit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

code {
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}

.segmented {
  display: flex;
  padding: 3px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

.segmented button {
  padding: 6px 12px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: 12px/1.2 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

.segmented button[aria-pressed='true'] {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
}

.segmented button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.lists {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}
</style>
