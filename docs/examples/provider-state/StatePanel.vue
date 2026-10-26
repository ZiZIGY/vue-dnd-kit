<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDnD, useDnDMonitor } from '@vue-dnd-kit/core';

// The drag as reactive state, anywhere under the provider.
const { status, active, over, pointer } = useDnD();

const rows = computed(() => [
  { name: 'status', value: status.value },
  { name: 'active', value: active.value?.id ?? '—' },
  { name: 'over', value: over.value?.id ?? '—' },
  { name: 'pointer', value: pointer.value ? `${Math.round(pointer.value.x)}, ${Math.round(pointer.value.y)}` : '—' },
]);

// Every drag's events, wherever it starts. The newest first.
const events = ref<{ id: number; text: string }[]>([]);
let count = 0;
const log = (text: string) => {
  events.value = [{ id: ++count, text }, ...events.value].slice(0, 5);
};

useDnDMonitor({
  onDragStart: ({ active }) => log(`start   ${active.id}`),
  onDragOver: ({ over }) => log(`over    ${over?.id ?? '—'}`),
  onDragEnd: ({ active, over }) => log(`end     ${active.id} → ${over?.id ?? '—'}`),
  onDragCancel: ({ active }) => log(`cancel  ${active.id}`),
});
</script>

<template>
  <section class="panel">
    <h4>useDnD()</h4>
    <dl>
      <template v-for="row in rows" :key="row.name">
        <dt>{{ row.name }}</dt>
        <dd :class="{ live: row.value !== '—' && row.value !== 'idle' }">{{ row.value }}</dd>
      </template>
    </dl>
    <h4>useDnDMonitor()</h4>
    <ol class="events">
      <li v-for="event in events" :key="event.id">{{ event.text }}</li>
      <li v-if="!events.length" class="empty">No events yet</li>
    </ol>
  </section>
</template>

<style scoped>
.panel {
  box-sizing: border-box;
  width: 260px;
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  font: 12px/1.6 ui-monospace, Menlo, Consolas, monospace;
}

h4 {
  margin: 0 0 6px;
  font: inherit;
  font-weight: 600;
  opacity: 0.55;
}

dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2px 16px;
  margin: 0 0 14px;
}

dt {
  opacity: 0.55;
}

dd {
  overflow: hidden;
  margin: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
}

dd.live {
  color: #42b883;
}

.events {
  min-height: 96px;
  margin: 0;
  padding: 0;
  list-style: none;
  white-space: pre;
}

.events li:first-child {
  color: #42b883;
}

.events li.empty {
  color: inherit;
  opacity: 0.45;
}
</style>
