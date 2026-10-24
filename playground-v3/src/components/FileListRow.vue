<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import type { FileNode } from '../fileTree';

  const props = defineProps<{ file: FileNode }>();
  const el = useTemplateRef<HTMLElement>('el');
  makeSortableItem(el, { id: () => props.file.id });
</script>

<template>
  <li
    ref="el"
    class="row"
    :data-id="file.id"
  >
    {{ file.name }}{{ file.type === 'folder' ? '/' : '' }}
  </li>
</template>
