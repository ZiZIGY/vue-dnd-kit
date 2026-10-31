<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeSortableTree } from '@vue-dnd-kit/core';
  import SeedRow from './SeedRow.vue';
  import BedOverlay from './BedOverlay.vue';
  import { seed, type Seed } from './seeds';

  const beds = ref<Seed[]>([
    { ...seed('herbs', 'Herbs', '🪴'), children: [seed('basil', 'Basil', '🌿'), seed('mint', 'Mint', '🌿')] },
    { ...seed('flowers', 'Flowers', '🪴'), children: [seed('rose', 'Rose', '🌹')] },
  ]);

  const { items } = makeSortableTree(useTemplateRef<HTMLElement>('tree'), {
    id: 'beds',
    items: beds,
    group: 'beds',
    // Plants go into beds; beds stay at the top level.
    canNest: (node, parent) => !node.children && !!parent.children,
    overlay: BedOverlay,
  });

  const describe = (nodes: Seed[]): string =>
    nodes.map((node) => (node.children ? `${node.id}(${describe(node.children)})` : node.id)).join(',');
</script>

<template>
  <section class="bed-tree">
    <h3>Beds</h3>
    <ul ref="tree">
      <SeedRow
        v-for="row in items"
        :key="row.key"
        :seed="row.item"
        :depth="row.depth"
      />
    </ul>
    <pre data-testid="beds">{{ describe(beds) }}</pre>
  </section>
</template>

<style scoped>
  .bed-tree {
    width: 240px;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    margin: 0;
    list-style: none;
    background: #f3f4f6;
    border-radius: 10px;
  }
</style>
