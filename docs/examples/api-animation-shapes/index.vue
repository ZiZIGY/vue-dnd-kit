<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider, type AutoAnimation, type DropAnimation, type LayoutAnimation } from '@vue-dnd-kit/core';
import AnimLane from './AnimLane.vue';
import { tiltDrop, tiltMove } from './tilt';

const SLOW = { duration: 700, easing: 'ease-in-out' };

// One shape per lane, for all three options: sorting, the drop, and changes no drag made.
const lanes: { label: string; animation: LayoutAnimation; dropAnimation: DropAnimation; animate: AutoAnimation }[] = [
  { label: 'true', animation: true, dropAnimation: true, animate: true },
  { label: 'false', animation: false, dropAnimation: false, animate: false },
  { label: '{ duration: 700 }', animation: SLOW, dropAnimation: SLOW, animate: SLOW },
  // `animate` takes no function itself: its parts (`move`, `enter`, `leave`) do.
  { label: 'ƒ tilt', animation: tiltMove, dropAnimation: tiltDrop, animate: { move: tiltMove } },
];

const letters = ['A', 'B', 'C', 'D'];
const rows = ref(lanes.map(() => letters.map((id, i) => ({ id, hue: 150 + i * 40 }))));

/** The same new order in every lane: `animate` plays it four ways. */
const shuffle = () => {
  const order = [...letters].sort(() => Math.random() - 0.5);
  rows.value = rows.value.map((lane) => order.map((id) => lane.find((row) => row.id === id)!));
};
</script>

<template>
  <div class="demo">
    <code>&lt;DnDProvider :animation="shape" :drop-animation="shape" :animate="shape"&gt;</code>
    <div class="lanes">
      <!-- A provider per lane: each one has its own animations. -->
      <DnDProvider
        v-for="(lane, index) in lanes"
        :key="lane.label"
        :animation="lane.animation"
        :drop-animation="lane.dropAnimation"
        :animate="lane.animate"
      >
        <AnimLane v-model="rows[index]!" :label="lane.label" />
      </DnDProvider>
    </div>
    <button type="button" @click="shuffle">Shuffle all</button>
  </div>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

code {
  max-width: 100%;
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  text-align: center;
  opacity: 0.7;
}

button {
  padding: 6px 12px;
  border: 0;
  border-radius: 8px;
  background: #42b883;
  color: #fff;
  font: 600 12px/1 system-ui, sans-serif;
  cursor: pointer;
}

button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.lanes {
  display: grid;
  grid-template-columns: repeat(4, 128px);
  gap: 8px;
}

@media (max-width: 560px) {
  .lanes {
    grid-template-columns: repeat(2, 128px);
  }
}
</style>
