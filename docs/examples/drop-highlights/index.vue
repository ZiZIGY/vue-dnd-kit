<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Palette from './Palette.vue';
import Swatch from './Swatch.vue';

const SWATCHES = [
  { id: 'orange', color: '#f97316', tone: 'warm' as const },
  { id: 'blue', color: '#3b82f6', tone: 'cool' as const },
  { id: 'stone', color: '#a8a29e', tone: 'neutral' as const },
  { id: 'red', color: '#ef4444', tone: 'warm' as const },
  { id: 'cyan', color: '#06b6d4', tone: 'cool' as const },
  { id: 'slate', color: '#475569', tone: 'neutral' as const },
  { id: 'amber', color: '#eab308', tone: 'warm' as const },
  { id: 'violet', color: '#8b5cf6', tone: 'cool' as const },
];
</script>

<template>
  <DnDProvider>
    <div class="studio">
      <div class="swatches">
        <Swatch v-for="swatch in SWATCHES" :key="swatch.id" :swatch="swatch" />
      </div>
      <div class="palettes">
        <Palette tone="warm" />
        <Palette tone="cool" />
        <Palette tone="neutral" />
      </div>
    </div>

    <!-- The dragged swatch says it too: over a palette, `accepted` tells yes from no. -->
    <template #overlay="{ active, over, accepted }">
      <div class="lifted" :class="{ yes: over && accepted, no: over && !accepted }" :style="{ background: (active.data as { color: string }).color }">
        <span v-if="over" class="badge">{{ accepted ? '+' : '✕' }}</span>
      </div>
    </template>
  </DnDProvider>
</template>

<style scoped>
.studio {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.swatches {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.palettes {
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
}

/* Fills the overlay box, which has the swatch's size. */
.lifted {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 12px 22px -8px rgb(0 0 0 / 0.55);
  transition:
    filter 0.15s,
    scale 0.15s;
}

.lifted.yes {
  scale: 1.12;
}

.lifted.no {
  filter: grayscale(1) brightness(0.7);
}

.badge {
  position: absolute;
  top: -7px;
  right: -7px;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #42b883;
  color: #fff;
  font: 700 12px/1 system-ui, sans-serif;
}

.no .badge {
  background: #f43f5e;
  font-size: 9px;
}
</style>
