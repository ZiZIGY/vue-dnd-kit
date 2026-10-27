<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ tile: { id: string; hue: number }; across: boolean }>();
const el = useTemplateRef<HTMLElement>('el');
// With `placeholder: 'indicator'`: the drop line, while it is next to this tile.
const { indicator } = makeSortableItem(el, { item: () => props.tile });
</script>

<template>
  <li ref="el" class="tile" :class="[indicator && `drop-${indicator.side}`, { across }]" :style="{ '--hue': tile.hue }">
    <span class="swatch" />
    {{ tile.id }}
  </li>
</template>

<style scoped>
.tile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  font-size: 13px;
  font-weight: 600;
  cursor: grab;
  user-select: none;
}

/* Across (rows and grids): squares. */
.tile.across {
  flex-direction: column;
  justify-content: center;
  width: 72px;
  height: 72px;
  padding: 0;
}

.tile:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.tile[data-dnd-placeholder] {
  opacity: 0.35;
}

.swatch {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: hsl(var(--hue) 70% 55%);
}

/* The drop line: above or below in a column, left or right across. */
.tile.drop-before::before,
.tile.drop-after::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 2px;
  background: #42b883;
}

.tile.drop-before::before {
  top: -6px;
}

.tile.drop-after::after {
  bottom: -6px;
}

.tile.across.drop-before::before,
.tile.across.drop-after::after {
  top: 0;
  bottom: 0;
  width: 3px;
  height: auto;
}

.tile.across.drop-before::before {
  left: -7px;
  right: auto;
}

.tile.across.drop-after::after {
  left: auto;
  right: -7px;
}
</style>
