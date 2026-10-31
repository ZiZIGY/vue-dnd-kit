<script setup lang="ts">
  import { inject, ref, useTemplateRef } from 'vue';
  import { makeSortableTree, type Key } from '@vue-dnd-kit/core';
  import FolderRow from './FolderRow.vue';
  import { FILE_MANAGER, isFolder, mergeFolders, rowKey, subfolders } from './fs';

  const INDENTATION = 18;
  const fm = inject(FILE_MANAGER)!;
  const collapsed = ref(new Set<Key>());

  // The tree shows the folders only; what it writes back keeps the files where they are.
  const el = useTemplateRef<HTMLElement>('el');
  const { items: rows } = makeSortableTree(el, {
    id: 'folders',
    items: fm.folders,
    getKey: (node) => rowKey(node.id),
    getChildren: subfolders,
    setChildren: (node, folders) => (node.children = mergeFolders(node.children, folders)),
    group: 'folders',
    indentation: INDENTATION,
    maxDepth: 3,
    collapsed,
    onDrop: (event) => {
      const parent = event.to.parentKey == null ? 'the top level' : rows.value.find((row) => row.key === event.to.parentKey)?.item.name;
      fm.lastAction.value = `Moved folder ${event.items[0]!.name} into ${parent}`;
    },
  });

  const toggle = (key: Key) => {
    if (collapsed.value.has(key)) collapsed.value.delete(key);
    else collapsed.value.add(key);
  };
</script>

<template>
  <div
    ref="el"
    class="fm-tree"
    data-testid="folder-tree"
  >
    <FolderRow
      v-for="node in rows"
      :key="node.key"
      :node="node"
      :indentation="INDENTATION"
      :count="node.item.children.filter((entry) => !isFolder(entry)).length"
      @toggle="toggle"
    />
  </div>
</template>

<style scoped>
  .fm-tree {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-bottom: 24px;
  }
</style>
