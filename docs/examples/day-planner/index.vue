<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Agenda from './Agenda.vue';
import BlockChip from './BlockChip.vue';

const BLOCKS = [
  { title: 'Focus', minutes: 90, color: '#42b883' },
  { title: 'Meeting', minutes: 30, color: '#3b82f6' },
  { title: 'Lunch', minutes: 60, color: '#f59e0b' },
  { title: 'Gym', minutes: 45, color: '#ec4899' },
  { title: 'Break', minutes: 15, color: '#a1a1aa' },
];
</script>

<template>
  <DnDProvider>
    <div class="planner">
      <aside class="blocks">
        <h4>Blocks</h4>
        <BlockChip v-for="block in BLOCKS" :key="block.title" :block="block" />
      </aside>
      <Agenda />
    </div>
  </DnDProvider>
</template>

<style scoped>
.planner {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.blocks {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 6px;
  width: 140px;
}

h4 {
  margin: 0 0 6px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

@media (max-width: 480px) {
  .blocks {
    width: 112px;
  }
}
</style>
