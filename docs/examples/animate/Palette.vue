<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import Swatch from './Swatch.vue';

const COLORS = ['#f59e0b', '#42b883', '#3b82f6', '#ec4899', '#a855f7', '#14b8a6', '#ef4444', '#84cc16'];
const swatches = ref(COLORS.slice(0, 5).map((hex, id) => ({ id, hex })));
let created = swatches.value.length;

const animated = ref(true);
const grid = useTemplateRef<HTMLElement>('grid');
// Drags animate by default. `animate` also animates the changes no drag made: the
// buttons below replace the array, and the tiles move, fade in and fade out.
const { items } = makeSortableList(grid, { items: swatches, strategy: 'grid', animate: animated });

const shuffle = () => {
  const next = [...swatches.value];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j]!, next[i]!];
  }
  swatches.value = next;
};

const add = () => {
  const used = new Set(swatches.value.map((swatch) => swatch.hex));
  const hex = COLORS.find((color) => !used.has(color));
  if (hex) swatches.value = [{ id: created++, hex }, ...swatches.value];
};

const sort = () => {
  swatches.value = [...swatches.value].sort((a, b) => COLORS.indexOf(a.hex) - COLORS.indexOf(b.hex));
};

const remove = (id: number) => {
  swatches.value = swatches.value.filter((swatch) => swatch.id !== id);
};
</script>

<template>
  <div class="palette">
    <div class="controls">
      <button type="button" @click="shuffle">Shuffle</button>
      <button type="button" :disabled="swatches.length === COLORS.length" @click="add">Add</button>
      <button type="button" @click="sort">Sort</button>
      <button type="button" class="toggle" :aria-pressed="animated" @click="animated = !animated">
        Animate changes
      </button>
    </div>
    <div ref="grid" class="tiles">
      <Swatch v-for="swatch in items" :key="swatch.id" :swatch="swatch" @remove="remove(swatch.id)" />
    </div>
  </div>
</template>

<style scoped>
.palette {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

button {
  padding: 6px 12px;
  border: 0;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 7%, transparent);
  color: inherit;
  font: 600 12px/1.2 system-ui, sans-serif;
  cursor: pointer;
}

button:disabled {
  cursor: default;
  opacity: 0.4;
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.toggle {
  background: none;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 15%, transparent);
  opacity: 0.6;
}

.toggle[aria-pressed='true'] {
  background: color-mix(in srgb, #42b883 14%, transparent);
  box-shadow: inset 0 0 0 1px #42b883;
  color: #42b883;
  opacity: 1;
}

.tiles {
  display: grid;
  grid-template-columns: repeat(4, 76px);
  grid-auto-rows: 76px;
  gap: 12px;
  min-height: 164px;
}
</style>
