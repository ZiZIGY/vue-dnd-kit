<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem, type FlatNode, type Key } from '@vue-dnd-kit/core';
  import { VBtn, VIcon, VListItem } from 'vuetify/components';
  import type { FileNode } from '../../../src/fileTree';
  import { mdiChevronDown, mdiChevronRight, mdiFileOutline, mdiFolder } from '../icons';

  const props = defineProps<{ node: FlatNode<FileNode>; indentation: number }>();
  const emit = defineEmits<{ toggle: [key: Key] }>();
  const row = useTemplateRef('row');
  makeSortableItem(row, { id: () => props.node.key });
</script>

<template>
  <VListItem
    ref="row"
    :data-id="node.key"
    :data-depth="node.depth"
    :style="{ paddingInlineStart: `${4 + node.depth * indentation}px` }"
    density="compact"
    rounded
    border
    class="mb-1 bg-surface"
    style="cursor: grab"
  >
    <template #prepend>
      <VBtn
        v-if="node.item.type === 'folder'"
        :icon="node.collapsed ? mdiChevronRight : mdiChevronDown"
        variant="text"
        size="x-small"
        :aria-expanded="!node.collapsed"
        :aria-label="`${node.collapsed ? 'Expand' : 'Collapse'} ${node.item.name}`"
        :data-toggle="node.key"
        @click="emit('toggle', node.key)"
      />
      <span
        v-else
        style="display: inline-block; width: 28px"
      />
      <VIcon
        :icon="node.item.type === 'folder' ? mdiFolder : mdiFileOutline"
        size="small"
        class="mx-1"
      />
    </template>
    <span :class="{ 'font-weight-bold': node.item.type === 'folder' }">{{ node.item.name }}</span>
  </VListItem>
</template>
