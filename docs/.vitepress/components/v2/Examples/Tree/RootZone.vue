<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import type { TreeNode } from './TreeItem.vue';

  const props = defineProps<{ items: TreeNode[] }>();
  const emit = defineEmits<{ (e: 'drop', event: IDragEvent): void }>();

  const rootRef = useTemplateRef<HTMLElement>('rootRef');

  const { isDragOver } = makeDroppable(
    rootRef,
    { events: { onDrop: (e) => emit('drop', e) } },
    () => props.items
  );
</script>

<template>
  <div
    ref="rootRef"
    class="tree-root"
    :class="{ 'tree-root--over': isDragOver }"
  >
    <slot />
  </div>
</template>

<style scoped>
  .tree-root {
    padding: 0.375rem;
    border: 2px dashed rgba(148, 163, 184, 0.18);
    border-radius: 10px;
    background: rgba(148, 163, 184, 0.02);
    min-height: 60px;
    transition: border-color 0.15s, background 0.15s;
  }

  .tree-root--over {
    border-color: rgba(99, 102, 241, 0.4);
    background: rgba(99, 102, 241, 0.04);
  }
</style>
