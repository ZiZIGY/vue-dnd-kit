<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableTree } from '@vue-dnd-kit/core';
  import FolderRow from './FolderRow.vue';
  import type { Folder, Store } from './store';

  const INDENTATION = 20;
  const props = defineProps<{ store: Store }>();

  const el = useTemplateRef<HTMLElement>('el');
  const { items } = makeSortableTree(el, {
    id: 'folders',
    // A getter: the tree never writes the store, and its frozen nodes can't be mutated.
    items: () => props.store.tree(),
    getKey: (node) => node.id,
    getChildren: (node) => node.children as Folder[],
    // `result` copies the nodes on the changed paths: through the class, so they stay Folders.
    withChildren: (node, children) => node.withChildren(children),
    group: 'controlled-tree',
    indentation: INDENTATION,
    onDrop: (event) => {
      // Applied right here, synchronously: the overlay lands in the new tree.
      event.preventDefault();
      props.store.setTree(event.result.get(event.to.list)!);
    },
  });
</script>

<template>
  <div
    ref="el"
    class="folders"
    data-testid="folders"
  >
    <FolderRow
      v-for="node in items"
      :key="node.key"
      :node="node"
      :indentation="INDENTATION"
    />
  </div>
</template>

<style scoped>
  .folders {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 320px;
    padding: 8px;
    background: #e5e7eb;
    border-radius: 8px;
  }
</style>
