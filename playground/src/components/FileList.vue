<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import FileListRow from './FileListRow.vue';
  import type { FileNode } from '../fileTree';

  // A list next to the tree: rows find their list by the DOM, so it could live in the
  // tree's component too.
  const props = defineProps<{ listId: string; group: string }>();
  const files = defineModel<FileNode[]>({ required: true });
  const el = useTemplateRef<HTMLElement>('el');
  const { items } = makeSortableList(el, { id: props.listId, items: files, group: props.group });
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
