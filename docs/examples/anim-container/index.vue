<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Lane from './Lane.vue';

const lanes = ref([
  {
    id: 'applied',
    title: 'Applied',
    people: [
      { id: 'ava', name: 'Ava Stone', role: 'Designer', hue: 20 },
      { id: 'ben', name: 'Ben Ito', role: 'Engineer', hue: 200 },
      { id: 'cleo', name: 'Cleo Diaz', role: 'Writer', hue: 300 },
    ],
  },
  { id: 'interview', title: 'Interview', people: [{ id: 'dan', name: 'Dan Ruiz', role: 'Engineer', hue: 140 }] },
  { id: 'hired', title: 'Hired', people: [] },
]);
</script>

<template>
  <!-- `overlay-class`: the overlay's content, the whole of what follows the pointer, lifts as one. -->
  <DnDProvider overlay-class="pipeline-hand">
    <div class="pipeline">
      <Lane v-for="lane in lanes" :key="lane.id" :lane="lane" />
    </div>
  </DnDProvider>
</template>

<style scoped>
.pipeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
</style>

<!-- Not scoped: the overlay's content element is the library's, rendered outside this component. -->
<style>
@media (prefers-reduced-motion: no-preference) {
  /* Picked up, the whole overlay lifts and tilts; let go, it lies flat again as it lands. */
  .pipeline-hand {
    transition:
      rotate 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
      scale 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  [data-dnd-overlay='dragging'] > .pipeline-hand {
    rotate: 3deg;
    scale: 1.05;
  }

  /* Where the lift starts: the box appears already `dragging`, a transition needs a before. */
  @starting-style {
    [data-dnd-overlay='dragging'] > .pipeline-hand {
      rotate: 0deg;
      scale: 1;
    }
  }
}
</style>
