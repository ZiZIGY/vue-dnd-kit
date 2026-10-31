<script setup lang="ts">
  import { computed, ref, useTemplateRef } from 'vue';
  import { makeSortableTree, type Key } from '@vue-dnd-kit/core';
  import TreeRow from './TreeRow.vue';
  import { createFileTree, serializeTree, type FileNode } from '../../../src/fileTree';

  const INDENTATION = 24;

  const tree = ref<FileNode[]>(createFileTree());
  const collapsed = ref(new Set<Key>(['docs']));
  const root = useTemplateRef<HTMLElement>('root');
  const { items, projected } = makeSortableTree(root, {
    id: 'tree',
    items: tree,
    indentation: INDENTATION,
    maxDepth: 2,
    collapsed,
    canNest: (_node, parent) => parent.type === 'folder',
  });

  const toggle = (key: Key) => {
    if (collapsed.value.has(key)) collapsed.value.delete(key);
    else collapsed.value.add(key);
  };
  const structure = computed(() => serializeTree(tree.value));
</script>

<template>
  <section>
    <h2 class="mb-2 font-semibold text-highlighted">Files (makeSortableTree, UCard rows)</h2>
    <div
      ref="root"
      class="flex w-96 max-w-full flex-col gap-1 rounded-lg border border-default bg-muted p-2"
      data-testid="tree-root"
    >
      <TreeRow
        v-for="node in items"
        :key="node.key"
        :node="node"
        :indentation="INDENTATION"
        @toggle="toggle"
      />
    </div>
    <pre
      class="mt-2 text-xs text-muted whitespace-pre-wrap break-all"
      data-testid="tree"
      >{{ structure }}</pre
    >
    <pre
      class="text-xs text-muted whitespace-pre-wrap break-all"
      data-testid="projected"
      >{{ projected ? `${projected.depth}:${projected.parentKey ?? 'root'}` : '' }}</pre
    >
  </section>
</template>
