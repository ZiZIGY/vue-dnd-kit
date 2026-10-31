<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ photo: { id: string; emoji: string; hue: number } }>();
const el = useTemplateRef<HTMLElement>('el');
// A click picks the photo; dragging a picked one takes every picked photo along.
const { selected } = makeSortableItem(el, { item: () => props.photo });
</script>

<template>
  <li ref="el" class="tile" :class="{ selected }" :style="{ '--hue': photo.hue }" @click="selected = !selected">
    <span class="picture">{{ photo.emoji }}</span>
    <span class="check" aria-hidden="true">
      <svg viewBox="0 0 16 16"><path d="m4 8.5 2.5 2.5L12 5.5" /></svg>
    </span>
  </li>
</template>

<style scoped>
.tile {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  cursor: grab;
  user-select: none;
}

.tile:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.picture {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  /* On a solid color: the overlay, a copy of the photo, isn't see-through. */
  background: linear-gradient(160deg, hsl(var(--hue) 75% 62% / 0.6), hsl(calc(var(--hue) + 40) 70% 35% / 0.5)), Canvas;
  font-size: 26px;
  transition:
    scale 0.15s,
    border-radius 0.15s;
}

/* Picked: the photo shrinks inside a ring, as photo apps do. */
.selected .picture {
  scale: 0.86;
  border-radius: 6px;
}

.selected {
  background: color-mix(in srgb, #42b883 22%, transparent);
}

.check {
  position: absolute;
  top: 5px;
  left: 5px;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border: 1.5px solid #fff;
  border-radius: 50%;
  background: rgb(0 0 0 / 0.25);
  opacity: 0;
  transition: opacity 0.15s;
}

.tile:hover .check,
.selected .check {
  opacity: 1;
}

.selected .check {
  border-color: #42b883;
  background: #42b883;
}

.check svg {
  width: 11px;
  height: 11px;
  fill: none;
  stroke: #fff;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
}

.selected .check svg {
  stroke: #04130c;
  opacity: 1;
}

/* The slot of a photo being dragged. */
.tile[data-dnd-placeholder] {
  opacity: 1;
  background: none;
  outline: 1.5px dashed color-mix(in srgb, #42b883 70%, transparent);
  outline-offset: -2px;
}

.tile[data-dnd-placeholder] > * {
  visibility: hidden;
}
</style>
