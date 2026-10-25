<script setup lang="ts">
  import { inject, ref, useTemplateRef } from 'vue';
  import { makeSortableTree, type Key } from '@vue-dnd-kit/core';
  import FolderRow from './FolderRow.vue';
  import { FILE_MANAGER } from './fs';

  const INDENTATION = 18;
  const fm = inject(FILE_MANAGER)!;
  const collapsed = ref(new Set<Key>());

  const el = useTemplateRef<HTMLElement>('el');
  const { items: rows } = makeSortableTree(el, {
    id: 'folders',
    items: fm.folders,
    group: 'folders',
    indentation: INDENTATION,
    maxDepth: 3,
    collapsed,
    onDrop: (event) => {
      const parent = event.to.parentKey == null ? 'the top level' : fm.nameOf(String(event.to.parentKey));
      fm.lastAction.value = `Moved folder ${fm.nameOf(String(event.keys[0]))} into ${parent}`;
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
      :count="fm.files[node.key]?.length ?? 0"
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
