<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import SidebarRow from './SidebarRow.vue';
import type { FolderEntry } from './files';

/**
 * A favorite: an item of the Favorites list, and a drop target too (in SidebarRow). The
 * library reads the row component's root element. Near its edges a dragged favorite
 * sorts; files dropped on it go into its folder.
 */
const props = defineProps<{ folder: FolderEntry }>();
const row = useTemplateRef('row');
makeSortableItem(row, { item: () => props.folder });
</script>

<template>
  <SidebarRow ref="row" :folder="folder" />
</template>
