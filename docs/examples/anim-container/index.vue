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
  <DnDProvider>
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
