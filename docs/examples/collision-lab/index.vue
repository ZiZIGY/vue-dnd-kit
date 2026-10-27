<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import {
  DnDProvider,
  closestCenter,
  closestCorners,
  pointerFirst,
  pointerWithin,
  rectIntersection,
  type CollisionDetection,
  type DnDEndEvent,
  type Key,
} from '@vue-dnd-kit/core';
import Desk from './Desk.vue';
import { magnet } from './magnet';

const DETECTORS: Record<string, CollisionDetection> = {
  pointerFirst,
  pointerWithin,
  rectIntersection,
  closestCenter,
  closestCorners,
  magnet,
};
const names = Object.keys(DETECTORS);
const mode = ref('pointerFirst');

// The ranking of the current frame, best first: a wrapper around the chosen function
// records it, so the targets can show their rank.
const ranked = shallowRef<Key[]>([]);
const collision = computed<CollisionDetection>(() => {
  const detect = DETECTORS[mode.value]!;
  return (args) => (ranked.value = detect(args));
});

const result = ref('Drag the pin or the card over the targets');
const onEnd = ({ over }: DnDEndEvent) => {
  ranked.value = [];
  result.value = over ? `Dropped on ${over.id}` : 'Dropped on nothing';
};
const onCancel = () => {
  ranked.value = [];
  result.value = 'Cancelled';
};
</script>

<template>
  <DnDProvider :collision="collision" @drag-end="onEnd" @drag-cancel="onCancel">
    <div class="lab">
      <div class="modes" role="radiogroup" aria-label="Collision detection">
        <label v-for="name in names" :key="name" :class="{ on: mode === name }">
          <input v-model="mode" type="radio" :value="name" />
          {{ name }}
        </label>
      </div>
      <code class="call">&lt;DnDProvider :collision="{{ mode }}"&gt;</code>
      <Desk :ranked="ranked" />
      <p class="result" aria-live="polite">{{ result }}</p>
    </div>
  </DnDProvider>
</template>

<style scoped>
.lab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.modes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
  max-width: 100%;
  padding: 3px;
  border-radius: 9px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

.modes label {
  padding: 5px 9px;
  border-radius: 6px;
  font: 12px/1.2 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

.modes label.on {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
  font-weight: 600;
}

.modes label:has(input:focus-visible) {
  outline: 2px solid #42b883;
}

.modes input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.call {
  max-width: 100%;
  padding: 6px 10px;
  overflow-x: auto;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 6%, transparent);
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
  color: #42b883;
}

.result {
  margin: 0;
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}
</style>
