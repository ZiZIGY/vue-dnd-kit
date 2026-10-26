<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSelectionArea, makeSortableList } from '@vue-dnd-kit/core';
import Shot from './Shot.vue';

const shots = ref(
  [12, 48, 96, 150, 200, 265, 300, 330].map((hue, index) => ({ id: `s${index + 1}`, hue })),
);

const grid = useTemplateRef<HTMLElement>('grid');
const { items } = makeSortableList(grid, { items: shots, strategy: 'grid' });

// Press on the empty space and draw a box to select; Ctrl/Cmd-click a shot to toggle it.
const area = useTemplateRef<HTMLElement>('area');
const { isSelecting, style } = makeSelectionArea(area);
</script>

<template>
  <div ref="area" class="area">
    <div ref="grid" class="grid">
      <Shot v-for="shot in items" :key="shot.id" :shot="shot" />
    </div>
    <div v-if="isSelecting" class="band" :style="style" />
  </div>
</template>

<style scoped>
/* The area fills its box: a selection box starts anywhere in it. */
.area {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 100%;
  min-height: 320px;
  padding: 24px;
  user-select: none;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  width: min(100%, 528px);
}

.band {
  border: 1px solid #42b883;
  background: color-mix(in srgb, #42b883 15%, transparent);
}
</style>
