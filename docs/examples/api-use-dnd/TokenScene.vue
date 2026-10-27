<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeDroppable, makeSelectionArea, type DnDEvent } from '@vue-dnd-kit/core';
import TokenChip from './TokenChip.vue';

type Place = 'tray' | 'inbox' | 'locked';
const tokens = ref<{ id: string; place: Place; hold?: boolean }[]>([
  { id: 'a', place: 'tray' },
  { id: 'b', place: 'tray' },
  { id: 'c', place: 'tray', hold: true },
]);
const moveTo = (place: Place) => ({ active }: DnDEvent) => {
  for (const token of tokens.value) if (active.ids.includes(token.id)) token.place = place;
};

const tray = useTemplateRef<HTMLElement>('tray');
const inbox = useTemplateRef<HTMLElement>('inbox');
const locked = useTemplateRef<HTMLElement>('locked');
makeDroppable(tray, { id: 'tray', onDrop: moveTo('tray') });
makeDroppable(inbox, { id: 'inbox', onDrop: moveTo('inbox') });
// Refuses everything: `over.accepted` reads false above it.
const { isOver: overLocked } = makeDroppable(locked, { id: 'locked', accept: () => false });
// A band drawn in the tray: `status` reads 'selecting'.
const { isSelecting, style } = makeSelectionArea(tray);
</script>

<template>
  <div class="scene">
    <div ref="tray" class="zone tray">
      <span class="caption">tray</span>
      <TokenChip v-for="token in tokens.filter((item) => item.place === 'tray')" :key="token.id" :token="token" />
      <div v-if="isSelecting" class="band" :style="style" />
    </div>
    <div class="pads">
      <div ref="inbox" class="zone">
        <span class="caption">inbox</span>
        <TokenChip v-for="token in tokens.filter((item) => item.place === 'inbox')" :key="token.id" :token="token" />
      </div>
      <div ref="locked" class="zone locked" :class="{ refusing: overLocked }">
        <span class="caption">locked</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scene {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 220px;
  max-width: 100%;
}

.zone {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 8px;
  min-height: 84px;
  padding: 26px 10px 10px;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
}

.tray {
  min-height: 68px;
}

.pads {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.locked {
  background: repeating-linear-gradient(-45deg, transparent 0 6px, color-mix(in srgb, currentColor 5%, transparent) 6px 12px);
}

.locked.refusing {
  box-shadow: inset 0 0 0 1.5px #e5484d;
}

.caption {
  position: absolute;
  top: 8px;
  left: 10px;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

.band {
  border: 1px solid #42b883;
  background: color-mix(in srgb, #42b883 14%, transparent);
}
</style>
