<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeSortableTree, type TreeNesting } from '@vue-dnd-kit/core';
import Heading from './Heading.vue';

interface Section {
  id: string;
  title: string;
  children?: Section[];
}

const props = defineProps<{ nesting: TreeNesting; indentation: number }>();

const outline = ref<Section[]>([
  {
    id: 'start',
    title: 'Getting started',
    children: [
      { id: 'install', title: 'Installation' },
      { id: 'first', title: 'Your first list' },
    ],
  },
  {
    id: 'concepts',
    title: 'Concepts',
    children: [
      { id: 'provider', title: 'The provider' },
      {
        id: 'lists',
        title: 'Lists and items',
        children: [
          { id: 'draft', title: 'The draft' },
          { id: 'keys', title: 'Keys' },
        ],
      },
    ],
  },
  { id: 'recipes', title: 'Recipes', children: [{ id: 'kanban', title: 'A kanban board' }] },
  { id: 'faq', title: 'FAQ' },
]);

const root = useTemplateRef<HTMLElement>('root');
// Options as getters: switching them applies to the next drag.
const { items, projected } = makeSortableTree(root, {
  items: outline,
  nesting: () => props.nesting,
  indentation: () => props.indentation,
  maxDepth: 2,
});

// Section numbers from the rendered rows: the dragged one is at its projected depth,
// so the numbers follow the drag.
const numbers = computed(() => {
  const counters: number[] = [];
  return items.value.map((node) => {
    counters.length = node.depth + 1;
    counters[node.depth] = (counters[node.depth] ?? 0) + 1;
    return counters.join('.');
  });
});

const titleOf = (id: unknown) => items.value.find((node) => node.key === id)?.item.title;
const where = computed(() => {
  const value = projected.value;
  if (!value) return 'Drag a section sideways to change its level';
  return `depth ${value.depth} · ${value.parentKey == null ? 'top level' : `in “${titleOf(value.parentKey)}”`}`;
});
</script>

<template>
  <section class="toc">
    <header>Contents</header>
    <ol ref="root" class="sections">
      <Heading
        v-for="(node, index) in items"
        :key="node.key"
        :node="node"
        :number="numbers[index]!"
        :indentation="indentation"
      />
    </ol>
    <p class="where" :class="{ live: projected }">{{ where }}</p>
  </section>
</template>

<style scoped>
.toc {
  width: min(100%, 340px);
  padding: 14px 10px 10px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

header {
  padding: 0 10px 10px;
  font-size: 15px;
  font-weight: 700;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.where {
  margin: 10px 10px 0;
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.where.live {
  color: #42b883;
  opacity: 1;
}
</style>
