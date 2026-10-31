<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem, type FlatNode, type Key } from '@vue-dnd-kit/core';
  import type { FileNode } from '../fileTree';

  const props = withDefaults(defineProps<{ node: FlatNode<FileNode>; indentation: number; selectable?: boolean }>(), {
    selectable: false,
  });
  const emit = defineEmits<{ toggle: [key: Key] }>();
  const el = useTemplateRef<HTMLElement>('el');
  const { selected } = makeSortableItem(el, { id: () => props.node.key });

  // Ctrl/Cmd+click selects for multi-drag (rfcs/0001-v3.md §4.5: the recipe is the user's).
  const onClick = (event: MouseEvent) => {
    if (props.selectable && (event.ctrlKey || event.metaKey)) selected.value = !selected.value;
  };
</script>

<template>
  <div
    ref="el"
    class="tree-row"
    :class="[node.item.type, { selected }]"
    :data-id="node.key"
    :data-depth="node.depth"
    :data-selected="selected || undefined"
    :style="{ paddingLeft: `${8 + node.depth * indentation}px` }"
    @click="onClick"
  >
    <button
      v-if="node.item.type === 'folder'"
      type="button"
      class="toggle"
      :data-toggle="node.key"
      :aria-expanded="!node.collapsed"
      :aria-label="`${node.collapsed ? 'Expand' : 'Collapse'} ${node.item.name}`"
      @click="emit('toggle', node.key)"
    >
      {{ node.collapsed ? '▸' : '▾' }}
    </button>
    <span
      v-else
      class="toggle"
    />
    <span class="name">{{ node.item.name }}{{ node.item.type === 'folder' ? '/' : '' }}</span>
  </div>
</template>

<style scoped>
  .tree-row {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding-right: 12px;
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: grab;
  }

  .tree-row.selected {
    background: #dbeafe;
    border-color: #3b82f6;
  }

  .tree-row.folder .name {
    font-weight: 600;
  }

  .toggle {
    width: 20px;
    height: 20px;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    color: #6b7280;
    cursor: pointer;
  }
</style>
