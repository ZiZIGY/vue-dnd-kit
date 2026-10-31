<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem, type FlatNode } from '@vue-dnd-kit/core';
  import type { Folder } from './store';

  const props = defineProps<{ node: FlatNode<Folder>; indentation: number }>();
  const el = useTemplateRef<HTMLElement>('el');
  makeSortableItem(el, { id: () => props.node.key });
</script>

<template>
  <div
    ref="el"
    class="folder-row"
    :data-id="node.key"
    :data-depth="node.depth"
    :style="{ paddingLeft: `${12 + node.depth * indentation}px` }"
  >
    {{ node.item.id }}/
  </div>
</template>

<style scoped>
  .folder-row {
    display: flex;
    align-items: center;
    height: 36px;
    padding-right: 12px;
    background: var(--ui-surface);
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius);
    font-family: var(--font-mono);
    cursor: grab;
  }
</style>
