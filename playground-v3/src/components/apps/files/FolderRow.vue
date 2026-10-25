<script setup lang="ts">
  import { computed, inject, useTemplateRef } from 'vue';
  import { makeSortableItem, type FlatNode, type Key } from '@vue-dnd-kit/core';
  import { FILE_MANAGER, type FolderNode } from './fs';
  import { useFolderDrop } from './useFolderDrop';

  const props = defineProps<{ node: FlatNode<FolderNode>; indentation: number; count: number }>();
  const emit = defineEmits<{ toggle: [key: Key] }>();
  const fm = inject(FILE_MANAGER)!;
  const el = useTemplateRef<HTMLElement>('el');

  // A node of the folder tree (keyed `tree:<id>`: the folder's grid tile has its id)...
  makeSortableItem(el, { id: () => props.node.key, type: 'tree' });
  // ...and a drop target for what is dragged from the grid (and elsewhere). It refuses
  // the tree's own drags, so the tree nests and sorts them over it as usual.
  const { isOver, isAccepting } = useFolderDrop(el, () => props.node.item.id, 'row');

  const current = computed(() => fm.current.value === props.node.item.id);
</script>

<template>
  <div
    ref="el"
    class="fm-row"
    :class="{ current, accepting: isAccepting, target: isOver && isAccepting }"
    :data-id="node.item.id"
    :data-depth="node.depth"
    :data-target="(isOver && isAccepting) || undefined"
    :style="{ paddingLeft: `${6 + node.depth * indentation}px` }"
    @click="fm.open(node.item.id)"
  >
    <button
      v-if="node.hasChildren"
      type="button"
      class="fm-chevron"
      :aria-expanded="!node.collapsed"
      :aria-label="`${node.collapsed ? 'Expand' : 'Collapse'} ${node.item.name}`"
      :data-testid="`toggle-${node.item.id}`"
      @click.stop="emit('toggle', node.key)"
    >
      {{ node.collapsed ? '▸' : '▾' }}
    </button>
    <span
      v-else
      class="fm-chevron"
    />
    <span
      class="fm-folder"
      aria-hidden="true"
    />
    <span class="fm-name">{{ node.item.name }}</span>
    <span
      v-if="count"
      class="fm-count"
      >{{ count }}</span
    >
  </div>
</template>

<style scoped>
  .fm-row {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding-right: 8px;
    border-radius: 6px;
    color: #334155;
    cursor: pointer;
    user-select: none;
  }

  .fm-row:hover {
    background: #e2e8f0;
  }

  .fm-row:focus-visible {
    outline: 2px solid #2563eb;
  }

  .fm-row.current {
    background: #dbeafe;
    color: #1e3a8a;
    font-weight: 600;
  }

  .fm-row.accepting {
    box-shadow: inset 0 0 0 1px #93c5fd;
  }

  .fm-row.target {
    background: #2563eb;
    color: #fff;
  }

  .fm-row[data-dnd-placeholder] {
    opacity: 1;
    background: repeating-linear-gradient(-45deg, #e2e8f0, #e2e8f0 6px, #f1f5f9 6px, #f1f5f9 12px);
  }

  .fm-chevron {
    width: 16px;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  .fm-folder {
    width: 16px;
    height: 12px;
    border-radius: 2px 3px 3px 3px;
    background: #f59e0b;
    box-shadow: inset 0 3px 0 #fbbf24;
  }

  .fm-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .fm-count {
    padding: 0 6px;
    border-radius: 999px;
    background: rgb(100 116 139 / 0.15);
    font-size: 11px;
    font-weight: 400;
  }
</style>
