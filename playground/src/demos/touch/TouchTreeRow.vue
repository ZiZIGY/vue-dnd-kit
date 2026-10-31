<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem, type FlatNode, type Key } from '@vue-dnd-kit/core';
  import type { TouchNode } from './data';

  const props = defineProps<{ node: FlatNode<TouchNode>; indentation: number }>();
  const emit = defineEmits<{ toggle: [key: Key] }>();
  const el = useTemplateRef<HTMLElement>('el');
  makeSortableItem(el, { id: () => props.node.key });
</script>

<template>
  <div
    ref="el"
    class="tree-row"
    :class="node.item.type"
    :data-id="node.key"
    :data-depth="node.depth"
    :style="{ paddingLeft: `${4 + node.depth * indentation}px` }"
  >
    <!-- A button never starts a drag: tapping it toggles the folder. -->
    <button
      v-if="node.item.type === 'folder'"
      type="button"
      class="toggle"
      :aria-expanded="!node.collapsed"
      :aria-label="`${node.collapsed ? 'Expand' : 'Collapse'} ${node.item.name}`"
      @click="emit('toggle', node.key)"
    >
      {{ node.collapsed ? '▸' : '▾' }}
    </button>
    <span
      v-else
      class="toggle"
      aria-hidden="true"
      >•</span
    >
    <span class="name">{{ node.item.name }}</span>
  </div>
</template>

<style scoped>
  .tree-row {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 48px;
    padding-right: 12px;
    background: var(--ui-surface);
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius-lg);
    color: var(--ui-text-highlighted);
    font: 15px/1.3 var(--font-sans);
  }

  .tree-row.folder .name {
    font-weight: 600;
  }

  .toggle {
    display: grid;
    place-items: center;
    flex: none;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    border-radius: var(--ui-radius);
    background: none;
    color: var(--ui-text-dimmed);
    font: inherit;
  }
</style>
