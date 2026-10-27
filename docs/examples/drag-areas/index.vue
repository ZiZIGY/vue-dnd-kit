<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider, type Coordinates, type Key } from '@vue-dnd-kit/core';
import DragArea from './DragArea.vue';

const stickers = ref([
  { id: 'logo', text: 'Logo', color: '#42b883', area: 'sketch', x: 20, y: 24 },
  { id: 'photo', text: 'Photo', color: '#3b82f6', area: 'sketch', x: 110, y: 96 },
  { id: 'quote', text: 'Quote', color: '#ec4899', area: 'sketch', x: 36, y: 150 },
  { id: 'title', text: 'Title', color: '#f59e0b', area: 'layout', x: 24, y: 24 },
  { id: 'button', text: 'Button', color: '#a855f7', area: 'layout', x: 120, y: 144 },
]);

const place = (area: string, id: Key, at: Coordinates) => {
  const sticker = stickers.value.find((item) => item.id === id);
  if (!sticker) return;
  sticker.area = area;
  sticker.x = Math.round(at.x);
  sticker.y = Math.round(at.y);
};
</script>

<template>
  <DnDProvider>
    <div class="studio">
      <DragArea
        id="sketch"
        title="Sketch"
        rules="no rules"
        :stickers="stickers.filter((sticker) => sticker.area === 'sketch')"
        @place="place"
      />
      <DragArea
        id="layout"
        title="Layout"
        rules="snapToGrid(24) · restrictToArea"
        strict
        :stickers="stickers.filter((sticker) => sticker.area === 'layout')"
        @place="place"
      />
    </div>
  </DnDProvider>
</template>

<style scoped>
.studio {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}
</style>
