<script setup lang="ts">
  import { computed, ref, useTemplateRef, type ComponentPublicInstance } from 'vue';
  import { makeSortableTree, type Key } from '@vue-dnd-kit/core';
  import { VList } from 'vuetify/components';
  import TreeRow from './TreeRow.vue';
  import { createFileTree, serializeTree, type FileNode } from '../../../src/fileTree';

  const INDENTATION = 24;

  const tree = ref<FileNode[]>(createFileTree());
  const collapsed = ref(new Set<Key>(['docs']));
  // <v-list> as the tree root; rows are flat <v-list-item>s indented by depth. Typed by
  // hand: the template that defines the ref also renders `items` (an inference cycle).
  const root = useTemplateRef<ComponentPublicInstance>('root');
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
    <h2 class="text-subtitle-1 font-weight-bold mb-2">Files (makeSortableTree, v-list-item rows)</h2>
    <VList
      ref="root"
      class="pa-2 bg-surface-light"
      rounded="lg"
      width="380"
      data-testid="tree-root"
    >
      <TreeRow
        v-for="node in items"
        :key="node.key"
        :node="node"
        :indentation="INDENTATION"
        @toggle="toggle"
      />
    </VList>
    <pre
      class="text-caption mt-2 text-pre-wrap text-break"
      data-testid="tree"
      >{{ structure }}</pre
    >
    <pre
      class="text-caption text-pre-wrap text-break"
      data-testid="projected"
      >{{ projected ? `${projected.depth}:${projected.parentKey ?? 'root'}` : '' }}</pre
    >
  </section>
</template>
