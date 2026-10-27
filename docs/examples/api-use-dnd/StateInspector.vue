<script setup lang="ts">
import { computed } from 'vue';
import { useDnD, type DnDStatus } from '@vue-dnd-kit/core';
import { inspect } from './inspect';

// The provider's drag as reactive state, in a component that drags nothing itself.
const { status, active, over, pointer, activation, selection } = useDnD();

const STATUSES: DnDStatus[] = ['idle', 'activating', 'dragging', 'dropping', 'selecting'];

const rows = computed(() => [
  {
    name: 'active',
    tokens: active.value
      ? inspect({ id: active.value.id, ids: active.value.ids, type: active.value.type, sensor: active.value.sensor }, true)
      : inspect(null),
  },
  { name: 'over', tokens: over.value ? inspect({ id: over.value.id, accepted: over.value.accepted }, true) : inspect(null) },
  { name: 'pointer', tokens: inspect(pointer.value) },
  { name: 'selection.ids', tokens: inspect(selection.ids) },
]);
</script>

<template>
  <section class="inspector" aria-label="useDnD()">
    <header><span class="fn">useDnD</span>()</header>

    <div class="field">
      <span class="name">status</span>
      <ol class="track">
        <li v-for="name in STATUSES" :key="name" :class="{ now: status === name }">{{ name }}</li>
      </ol>
    </div>

    <div class="field">
      <span class="name">activation.progress</span>
      <span class="progress">
        <span class="bar"><span :style="{ width: `${activation.progress.value * 100}%` }" /></span>
        <span class="number">{{ activation.progress.value.toFixed(2) }}</span>
      </span>
    </div>

    <div v-for="row in rows" :key="row.name" class="field">
      <span class="name">{{ row.name }}</span>
      <!-- Keyed by its text: a changed value mounts again and flashes, as in devtools. -->
      <code :key="row.name === 'pointer' ? row.name : row.tokens.map((token) => token.text).join('')" class="value">
        <span v-for="(token, index) in row.tokens" :key="index" :class="token.kind">{{ token.text }}</span>
      </code>
    </div>
  </section>
</template>

<style scoped>
.inspector {
  box-sizing: border-box;
  width: 290px;
  max-width: 100%;
  /* Tall enough for every value: it never grows during a drag, so nothing moves under the pointer. */
  min-height: 344px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  font: 11px/1.5 ui-monospace, Menlo, Consolas, monospace;
}

header {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  opacity: 0.8;
}

.fn {
  color: #42b883;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px 0;
}

.name {
  opacity: 0.5;
}

.track {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.track li {
  padding: 1px 6px;
  border-radius: 5px;
  background: color-mix(in srgb, currentColor 6%, transparent);
  opacity: 0.45;
  transition:
    background 0.15s,
    opacity 0.15s;
}

.track li.now {
  background: #42b883;
  color: #fff;
  opacity: 1;
}

.progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar {
  flex: 1;
  height: 4px;
  overflow: hidden;
  border-radius: 2px;
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.bar span {
  display: block;
  height: 100%;
  background: #42b883;
}

.value {
  border-radius: 4px;
  font: inherit;
  overflow-wrap: anywhere;
  animation: flash 0.6s ease-out;
}

@keyframes flash {
  from {
    background: color-mix(in srgb, #42b883 30%, transparent);
  }
}

.key {
  opacity: 0.6;
}

.string {
  color: #42b883;
}

.number {
  color: #e6a23c;
}

.literal {
  color: #c678dd;
}
</style>
