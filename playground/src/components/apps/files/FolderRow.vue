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
    border-radius: var(--ui-radius);
    color: var(--ui-text);
    cursor: pointer;
    user-select: none;
  }

  .fm-row:hover {
    background: var(--ui-bg-elevated);
  }

  .fm-row:focus-visible {
    outline: 2px solid var(--ui-focus);
  }

  .fm-row.current {
    background: var(--ui-selection-soft);
    color: var(--ui-text-highlighted);
    font-weight: 600;
  }

  .fm-row.accepting {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-primary) 55%, transparent);
  }

  .fm-row.target {
    background: var(--ui-primary);
    color: var(--ui-on-primary);
  }

  .fm-row[data-dnd-placeholder] {
    opacity: 1;
    background: repeating-linear-gradient(
      -45deg,
      var(--ui-bg-accented) 0 6px,
      var(--ui-bg-muted) 6px 12px
    );
  }

  /* The row has no background of its own: the copy in the overlay gets one. */
  [data-dnd-overlay] .fm-row {
    background: var(--ui-bg-elevated);
    box-shadow:
      inset 0 0 0 1px var(--ui-border-accented),
      var(--ui-shadow-overlay);
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
    border-radius: var(--ui-radius-sm);
    background: color-mix(in srgb, currentColor 12%, transparent);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 400;
  }
</style>
