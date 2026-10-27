<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import Tile from './Tile.vue';

const props = defineProps<{
  strategy: 'vertical' | 'horizontal' | 'grid';
  placeholder: 'item' | 'indicator';
  behavior: 'sort' | 'swap';
}>();

const tiles = ref(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((id, i) => ({ id, hue: i * 45 })));
const listRef = useTemplateRef<HTMLElement>('list');

// Getters: the options are read live, so the switches change the list as it is.
const { items } = makeSortableList(listRef, {
  items: tiles,
  strategy: () => props.strategy,
  placeholder: () => props.placeholder,
  behavior: () => props.behavior,
});
</script>

<template>
  <ul ref="list" class="tiles" :class="strategy">
    <Tile v-for="tile in items" :key="tile.id" :tile="tile" :across="strategy !== 'vertical'" />
  </ul>
</template>

<style scoped>
.tiles {
  margin: 0;
  padding: 4px;
  list-style: none;
}

.tiles.vertical {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 200px;
}

.tiles.horizontal {
  display: flex;
  gap: 10px;
  max-width: 100%;
  overflow-x: auto;
}

.tiles.grid {
  display: grid;
  grid-template-columns: repeat(4, 72px);
  gap: 10px;
}
</style>
