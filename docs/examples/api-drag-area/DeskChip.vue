<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ chip: { id: string; x: number; y: number } }>();
const el = useTemplateRef<HTMLElement>('el');
// Nothing about axes, grids or bounds here: the area around the chip decides.
makeDraggable(el, { id: () => props.chip.id });
</script>

<template>
  <div ref="el" class="chip" :style="{ left: `${chip.x}px`, top: `${chip.y}px` }">{{ chip.id }}</div>
</template>

<style scoped>
.chip {
  position: absolute;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  width: 60px;
  height: 40px;
  border-radius: 8px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 16%, transparent),
    0 4px 10px -6px rgb(0 0 0 / 0.5);
  font: 600 13px/1 ui-monospace, Menlo, Consolas, monospace;
  cursor: grab;
  user-select: none;
}

.chip:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* In a disabled area the library marks the chip `aria-disabled`. */
.chip[aria-disabled='true'] {
  cursor: not-allowed;
}
</style>
