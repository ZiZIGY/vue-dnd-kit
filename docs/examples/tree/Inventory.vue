<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeSortableTree, type Key } from '@vue-dnd-kit/core';
import TreeRow from './TreeRow.vue';
import { weightOf, type Thing } from './types';

const things = ref<Thing[]>([
  {
    id: 'backpack',
    name: 'Backpack',
    icon: '🎒',
    container: true,
    children: [
      {
        id: 'pouch',
        name: 'Pouch',
        icon: '👝',
        container: true,
        children: [
          { id: 'coins', name: 'Coins', icon: '💰', weight: 1 },
          { id: 'key', name: 'Old key', icon: '🗝️', weight: 1 },
        ],
      },
      { id: 'potion', name: 'Potion', icon: '🧪', weight: 2 },
      { id: 'map', name: 'Map', icon: '🗺️', weight: 1 },
    ],
  },
  { id: 'chest', name: 'Chest', icon: '🧰', container: true, children: [{ id: 'shield', name: 'Shield', icon: '🛡️', weight: 6 }] },
  { id: 'sword', name: 'Sword', icon: '🗡️', weight: 4 },
  { id: 'apple', name: 'Apple', icon: '🍎', weight: 1 },
]);
const collapsed = ref(new Set<Key>());

const INDENT = 20;
const root = useTemplateRef<HTMLElement>('root');
// Drag sideways to change the depth, or hover the middle of a container to drop into it.
// Only containers hold things, and a container holds no more than two levels.
const { items } = makeSortableTree(root, {
  items: things,
  indentation: INDENT,
  collapsed,
  canNest: (_thing, parent) => !!parent.container,
  maxDepth: 2,
});

const carried = computed(() => things.value.filter((thing) => thing.id !== 'chest').reduce((sum, thing) => sum + weightOf(thing), 0));
const toggle = (key: Key) => (collapsed.value.has(key) ? collapsed.value.delete(key) : collapsed.value.add(key));
</script>

<template>
  <section class="inventory">
    <header>
      Inventory
      <span class="carried">{{ carried }} kg carried</span>
    </header>
    <div ref="root" class="tree">
      <TreeRow v-for="node in items" :key="node.key" :node="node" :indent="INDENT" @toggle="toggle" />
    </div>
  </section>
</template>

<style scoped>
.inventory {
  width: 320px;
  max-width: 100%;
  margin: 0 auto;
  padding: 6px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 8px;
  font-size: 13px;
  font-weight: 700;
}

.carried {
  font: 500 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.tree {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
