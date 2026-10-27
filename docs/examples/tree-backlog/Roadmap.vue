<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableTree } from '@vue-dnd-kit/core';
import WorkRow from './WorkRow.vue';

interface Work {
  id: string;
  title: string;
  kind: 'epic' | 'story' | 'task';
  children?: Work[];
}

const roadmap = ref<Work[]>([
  {
    id: 'checkout',
    title: 'Checkout v2',
    kind: 'epic',
    children: [
      {
        id: 'cards',
        title: 'Saved cards',
        kind: 'story',
        children: [
          { id: 'card-form', title: 'Card form', kind: 'task' },
          { id: 'vault', title: 'Vault API', kind: 'task' },
        ],
      },
      { id: 'apple-pay', title: 'Apple Pay', kind: 'story' },
    ],
  },
  { id: 'onboarding', title: 'Onboarding', kind: 'epic', children: [{ id: 'tour', title: 'Welcome tour', kind: 'story' }] },
]);

const RANK = { epic: 0, story: 1, task: 2 };
let copies = 0;
/** A copy with its whole subtree, every node with a key of its own. */
const copy = (work: Work): Work => ({ ...work, id: `${work.id}-copy-${++copies}`, children: work.children?.map(copy) });

const root = useTemplateRef<HTMLElement>('root');
const { items, isOver } = makeSortableTree(root, {
  id: 'roadmap',
  items: roadmap,
  // Same group as the backlog: nodes move between the two, subtrees included.
  group: 'work',
  indentation: 20,
  // Stories go into epics, tasks into stories or epics.
  canNest: (work, parent) => RANK[parent.kind] < RANK[work.kind],
  maxDepth: 2,
  // Hold Alt while dragging into the backlog to copy instead.
  clone: copy,
});
</script>

<template>
  <section class="panel" :class="{ over: isOver }">
    <h3>Roadmap</h3>
    <ul ref="root" class="rows">
      <WorkRow v-for="node in items" :key="node.key" :work="node.item" :depth="node.depth" />
    </ul>
  </section>
</template>

<style scoped>
.panel {
  padding: 10px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, transparent);
  transition: border-color 0.2s;
}

.panel.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
}

h3 {
  margin: 2px 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 250px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
