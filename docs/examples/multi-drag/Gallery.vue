<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSelectionArea, makeSortableList, useDnD } from '@vue-dnd-kit/core';
import Shot from './Shot.vue';

const shots = ref(
  [12, 48, 96, 150, 200, 265, 300, 330].map((hue, index) => ({ id: `s${index + 1}`, hue })),
);

const grid = useTemplateRef<HTMLElement>('grid');
const { items } = makeSortableList(grid, { items: shots, strategy: 'grid' });

// Press on the empty space and draw a box to select; Ctrl/Cmd-click a shot to toggle it.
const area = useTemplateRef<HTMLElement>('area');
const { isSelecting, style } = makeSelectionArea(area);
const { selection } = useDnD();
</script>

<template>
  <div ref="area" class="area">
    <div ref="grid" class="grid">
      <Shot v-for="shot in items" :key="shot.id" :shot="shot" />
    </div>
    <p class="hint">
      {{ selection.ids.size ? `${selection.ids.size} selected — drag one to move them all` : 'Ctrl/Cmd-click or draw a box to select' }}
    </p>
    <div v-if="isSelecting" class="band" :style="style" />
  </div>
</template>

<style scoped>
.area {
  position: relative;
  padding: 16px;
  user-select: none;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 96px);
  gap: 10px;
  justify-content: center;
}

.hint {
  margin: 16px 0 0;
  font: 12px/1 ui-monospace, monospace;
  text-align: center;
  opacity: 0.6;
}

.band {
  border: 1px solid #42b883;
  background: color-mix(in srgb, #42b883 15%, transparent);
}
</style>
