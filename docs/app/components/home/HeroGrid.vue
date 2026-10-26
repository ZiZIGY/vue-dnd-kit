<script setup lang="ts">
  import { makeSortableList } from '@vue-dnd-kit/core';

  const tiles = ref(Array.from({ length: 9 }, (_, index) => ({ id: index + 1, filled: index === 4 })));
  const grid = useTemplateRef<HTMLElement>('grid');
  const { items } = makeSortableList(grid, { items: tiles, strategy: 'grid', id: 'hero' });
</script>

<template>
  <div
    ref="grid"
    class="grid grid-cols-3 gap-3"
  >
    <HomeHeroTile
      v-for="tile in items"
      :key="tile.id"
      :tile="tile"
    />
  </div>
</template>
