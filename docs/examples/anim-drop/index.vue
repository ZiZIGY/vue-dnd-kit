<script setup lang="ts">
import { shallowRef } from 'vue';
import { DnDProvider, type DropAnimation } from '@vue-dnd-kit/core';
import CardTable from './CardTable.vue';

/** A function of your own: the overlay arcs to its slot, as if tossed. */
const toss: DropAnimation = ({ overlay, from, to, reducedMotion }) => {
  if (reducedMotion) return;
  // No visible slot to land on: fade out where it is.
  if (!to) return overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
  const place = (x: number, y: number) => `translate3d(${x}px, ${y}px, 0)`;
  const rise = Math.min(120, Math.hypot(to.left - from.left, to.top - from.top) / 2);
  return overlay.animate(
    [
      { transform: place(from.left, from.top), width: `${from.width}px`, height: `${from.height}px` },
      { transform: place((from.left + to.left) / 2, Math.min(from.top, to.top) - rise), offset: 0.45 },
      { transform: place(to.left, to.top), width: `${to.width}px`, height: `${to.height}px` },
    ],
    { duration: 550, easing: 'ease-in-out', fill: 'forwards' },
  );
};

const OPTIONS: { label: string; animation: DropAnimation }[] = [
  { label: 'true', animation: true },
  { label: '{ duration: 700 }', animation: { duration: 700 } },
  { label: '{ easing }', animation: { duration: 450, easing: 'cubic-bezier(.34, 1.56, .64, 1)' } },
  { label: 'toss()', animation: toss },
  { label: 'false', animation: false },
];
const choice = shallowRef(OPTIONS[0]!);
</script>

<template>
  <!-- `dropAnimation` is read at every drop: switching it applies to the next one. -->
  <DnDProvider :drop-animation="choice.animation">
    <div class="demo">
      <div class="options" role="group" aria-label="dropAnimation">
        <button
          v-for="option in OPTIONS"
          :key="option.label"
          type="button"
          :aria-pressed="choice === option"
          @click="choice = option"
        >
          {{ option.label }}
        </button>
      </div>
      <CardTable />
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3px;
  padding: 3px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

button {
  padding: 6px 10px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: 12px/1.2 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

button[aria-pressed='true'] {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}
</style>
