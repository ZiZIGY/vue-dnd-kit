<script setup lang="ts">
import { reactive } from 'vue';
import { DnDProvider, type Key } from '@vue-dnd-kit/core';
import Bin from './Bin.vue';
import { BINS, WASTE } from './waste';

// The tray takes everything back (no `accept`); the bins take what their rule allows.
const TRAY = { id: 'tray', name: 'To sort', color: '#42b883', accept: '*', rule: "'*'" };

/** Where each item is: the tray or a bin. */
const place = reactive<Record<string, string>>(Object.fromEntries(WASTE.map((waste) => [waste.id, 'tray'])));
const itemsIn = (bin: string) => WASTE.filter((waste) => place[waste.id] === bin);
const drop = (bin: string, id: Key) => (place[String(id)] = bin);
</script>

<template>
  <DnDProvider>
    <div class="recycling">
      <Bin :bin="TRAY" :items="itemsIn('tray')" tray @drop="drop('tray', $event)" />
      <div class="bins">
        <Bin v-for="bin in BINS" :key="bin.id" :bin="bin" :items="itemsIn(bin.id)" @drop="drop(bin.id, $event)" />
      </div>
    </div>
  </DnDProvider>
</template>

<style scoped>
.recycling {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
}

.bins {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

@media (max-width: 560px) {
  .bins {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
