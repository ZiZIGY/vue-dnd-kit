<script setup lang="ts">
  import { shallowRef, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import FileListRow from './FileListRow.vue';
  import type { FileNode } from '../fileTree';

  // Templates to copy from (`group.pull: 'clone'`): they stay here, nothing comes in and
  // they don't sort. `clone` copies a folder with its subtree, every node with a key of its own.
  const props = defineProps<{
    listId: string;
    group: string;
    templates: FileNode[];
    clone: (node: FileNode) => FileNode;
  }>();
  const templates = shallowRef(props.templates);
  const el = useTemplateRef<HTMLElement>('el');
  const { items } = makeSortableList(el, {
    id: props.listId,
    items: templates,
    group: { name: props.group, pull: 'clone', put: false },
    sort: false,
    clone: props.clone,
  });
</script>

<template>
  <ul
    ref="el"
    class="list"
  >
    <FileListRow
      v-for="file in items"
      :key="file.id"
      :file="file"
    />
  </ul>
</template>
