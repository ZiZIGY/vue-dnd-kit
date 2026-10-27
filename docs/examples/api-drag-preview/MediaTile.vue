<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ item: { id: string; kind: 'photo' | 'video'; hue: number } }>();
const el = useTemplateRef<HTMLElement>('el');
// `type` is what the album's `group.put` reads; click to select, then drag several.
const { selected } = makeSortableItem(el, { item: () => props.item, type: () => props.item.kind });
</script>

<template>
  <li
    ref="el"
    class="tile"
    :class="{ picked: selected }"
    :style="{ '--hue': item.hue }"
    :aria-label="`${item.kind} ${item.id}`"
    @click="selected = !selected"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path v-if="item.kind === 'video'" d="M9 7.5v9l7.5-4.5z" />
      <path v-else d="m4 18 5-6 3.5 4 2.5-3 5 5zM16 9.5a1.5 1.5 0 1 0 0-.01z" />
    </svg>
    <span class="name">{{ item.id }}</span>
  </li>
</template>

<style scoped>
.tile {
  position: relative;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  overflow: hidden;
  border-radius: 10px;
  background: linear-gradient(140deg, hsl(var(--hue) 70% 62%), hsl(calc(var(--hue) + 40) 60% 40%));
  color: #fff;
  cursor: grab;
  user-select: none;
}

.tile:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.tile.picked {
  box-shadow:
    0 0 0 2px Canvas,
    0 0 0 4px #42b883;
}

.tile[data-dnd-placeholder] {
  opacity: 0.25;
}

svg {
  width: 22px;
  height: 22px;
  fill: currentColor;
  opacity: 0.9;
}

.name {
  position: absolute;
  bottom: 3px;
  left: 5px;
  font: 600 9px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.85;
}
</style>
