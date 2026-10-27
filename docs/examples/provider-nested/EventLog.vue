<script setup lang="ts">
import { ref } from 'vue';
import { useDnDMonitor } from '@vue-dnd-kit/core';

defineProps<{ title: string }>();

// Hears every drag of the closest provider above it, and only those.
const events = ref<{ id: number; text: string }[]>([]);
let count = 0;
const log = (text: string) => {
  events.value = [{ id: ++count, text }, ...events.value].slice(0, 4);
};

useDnDMonitor({
  onDragStart: ({ active }) => log(`start  ${active.id}`),
  onDragEnd: ({ active, over }) => log(`end    ${active.id} → ${over?.id ?? '—'}`),
  onDragCancel: ({ active }) => log(`cancel ${active.id}`),
});
</script>

<template>
  <section class="log">
    <h4>{{ title }}</h4>
    <ol>
      <li v-for="event in events" :key="event.id">{{ event.text }}</li>
      <li v-if="!events.length" class="empty">Nothing heard yet</li>
    </ol>
  </section>
</template>

<style scoped>
.log {
  padding: 10px 12px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 5%, transparent);
  font: 11px/1.6 ui-monospace, Menlo, Consolas, monospace;
}

h4 {
  margin: 0 0 4px;
  font: inherit;
  font-weight: 600;
  opacity: 0.55;
}

ol {
  min-height: 70px;
  margin: 0;
  padding: 0;
  list-style: none;
  white-space: pre;
}

li:first-child {
  color: #42b883;
}

li.empty {
  color: inherit;
  opacity: 0.45;
}
</style>
