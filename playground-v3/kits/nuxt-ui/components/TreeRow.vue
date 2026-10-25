<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem, type FlatNode, type Key } from '@vue-dnd-kit/core';
  import UCard from '@nuxt/ui/components/Card.vue';
  import UButton from '@nuxt/ui/components/Button.vue';
  import UIcon from '@nuxt/ui/components/Icon.vue';
  import type { FileNode } from '../../../src/fileTree';

  const props = defineProps<{ node: FlatNode<FileNode>; indentation: number }>();
  const emit = defineEmits<{ toggle: [key: Key] }>();
  const row = useTemplateRef('row');
  makeSortableItem(row, { id: () => props.node.key });
</script>

<template>
  <UCard
    ref="row"
    variant="outline"
    class="cursor-grab rounded-md"
    :ui="{ body: 'flex h-9 items-center gap-1.5 py-0 pr-3 sm:py-0 sm:pr-3' }"
    :data-id="node.key"
    :data-depth="node.depth"
    :style="{ paddingLeft: `${4 + node.depth * indentation}px` }"
  >
    <UButton
      v-if="node.item.type === 'folder'"
      :icon="node.collapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-down'"
      color="neutral"
      variant="ghost"
      size="xs"
      square
      :aria-expanded="!node.collapsed"
      :aria-label="`${node.collapsed ? 'Expand' : 'Collapse'} ${node.item.name}`"
      :data-toggle="node.key"
      @click="emit('toggle', node.key)"
    />
    <span
      v-else
      class="w-6"
    />
    <UIcon
      :name="node.item.type === 'folder' ? 'i-lucide-folder' : 'i-lucide-file'"
      class="size-4 text-muted"
    />
    <span
      class="text-sm"
      :class="{ 'font-semibold': node.item.type === 'folder' }"
      >{{ node.item.name }}</span
    >
  </UCard>
</template>
