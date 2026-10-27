<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeSortableTree, type Key, type TreeNesting } from '@vue-dnd-kit/core';
import OptionRow from './OptionRow.vue';
import TreeRow from './TreeRow.vue';

interface FileNode {
  id: string;
  name: string;
  folder?: boolean;
  children?: FileNode[];
}

const files = ref<FileNode[]>([
  {
    id: 'src',
    name: 'src',
    folder: true,
    children: [
      { id: 'components', name: 'components', folder: true, children: [{ id: 'button', name: 'Button.vue' }] },
      { id: 'main', name: 'main.ts' },
    ],
  },
  { id: 'docs', name: 'docs', folder: true, children: [{ id: 'intro', name: 'intro.md' }] },
  { id: 'readme', name: 'README.md' },
]);
const collapsed = ref(new Set<Key>());

const indentation = ref<'16' | '24' | '32'>('24');
const nesting = ref<TreeNesting>('both');
const maxDepth = ref<'1' | '2' | 'undefined'>('undefined');
const canNest = ref<'folders' | 'any'>('folders');

const root = useTemplateRef<HTMLElement>('root');
// Getters: the panel changes the options of the live tree. `canNest` is a function of its
// own, so it is passed as it is and reads the switch when the tree asks.
const { items, projected } = makeSortableTree(root, {
  items: files,
  indentation: () => Number(indentation.value),
  nesting,
  maxDepth: () => (maxDepth.value === 'undefined' ? undefined : Number(maxDepth.value)),
  canNest: (_node, parent) => canNest.value === 'any' || !!parent.folder,
  collapsed,
});

const toggle = (key: Key) => (collapsed.value.has(key) ? collapsed.value.delete(key) : collapsed.value.add(key));

const quote = (key: Key | null) => (key === null ? 'null' : `'${key}'`);
const projectedText = computed(() =>
  projected.value ? `{ depth: ${projected.value.depth}, parentKey: ${quote(projected.value.parentKey)} }` : 'null',
);
const collapsedText = computed(() => `Set(${collapsed.value.size}) { ${[...collapsed.value].map(quote).join(', ')} }`);
</script>

<template>
  <div class="demo">
    <div class="side">
      <div class="options-panel" role="group" aria-label="makeSortableTree options">
        <OptionRow v-model="indentation" name="indentation" :options="['16', '24', '32']" />
        <OptionRow v-model="nesting" name="nesting" :options="['offset', 'hover', 'both']" />
        <OptionRow v-model="maxDepth" name="maxDepth" :options="['1', '2', 'undefined']" />
        <OptionRow v-model="canNest" name="canNest" :options="['folders', 'any']" />
      </div>
      <dl class="readout">
        <dt>projected</dt>
        <dd :class="{ live: projected }">{{ projectedText }}</dd>
        <dt>collapsed</dt>
        <dd>{{ collapsedText }}</dd>
      </dl>
    </div>
    <div ref="root" class="tree">
      <TreeRow v-for="node in items" :key="node.key" :node="node" :indent="Number(indentation)" @toggle="toggle" />
    </div>
  </div>
</template>

<style scoped>
.demo {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 290px;
  max-width: 100%;
}

.options-panel {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 8px 12px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.readout {
  margin: 0;
  padding: 0 14px;
  font: 11px/1.5 ui-monospace, Menlo, Consolas, monospace;
}

dt {
  opacity: 0.5;
}

dd {
  margin: 0 0 4px;
}

dd.live {
  color: #42b883;
}

.tree {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 224px;
  max-width: 100%;
  min-height: 160px;
  padding: 6px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}
</style>
