<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ shape: { id: string; kind: string; hue: number } }>();
const el = useTemplateRef<HTMLElement>('el');
// `type` is what the area's `accept` matches; `selected` is this shape in the provider's selection.
const { selected } = makeSortableItem(el, { item: () => props.shape, type: () => props.shape.kind });
</script>

<template>
  <li
    ref="el"
    class="tile"
    :class="[shape.kind, { picked: selected }]"
    :style="{ '--hue': shape.hue }"
    :aria-label="`${shape.kind} ${shape.id}`"
    @click="selected = !selected"
  />
</template>

<style scoped>
.tile {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 9px;
  background: hsl(var(--hue) 65% 55%);
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.15);
  cursor: grab;
}

.tile.circle {
  border-radius: 50%;
}

.tile:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 3px;
}

/* Selected: a ring and a check. */
.tile.picked {
  box-shadow:
    0 0 0 2px Canvas,
    0 0 0 4px #42b883;
}

.tile.picked::after {
  content: '✓';
  position: absolute;
  top: -6px;
  right: -6px;
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #42b883;
  color: #fff;
  font: 700 10px/1 system-ui, sans-serif;
}

.tile[data-dnd-placeholder] {
  opacity: 0.3;
}
</style>
