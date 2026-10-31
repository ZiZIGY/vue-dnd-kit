<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeSortableItem, type FlatNode, type Key } from '@vue-dnd-kit/core';
  import type { FileNode } from '../fileTree';

  /** A tree row for `placeholder: 'indicator'`: it draws the drop line itself. */
  const props = defineProps<{ node: FlatNode<FileNode>; indentation: number }>();
  const emit = defineEmits<{ toggle: [key: Key] }>();
  const el = useTemplateRef<HTMLElement>('el');
  const { indicator, selected } = makeSortableItem(el, { id: () => props.node.key });

  // The line starts at the indentation of the level the drop lands at (as in VS Code or
  // Notion); a drop into this folder highlights it instead.
  const line = computed(() => {
    const value = indicator.value;
    if (!value || value.side === 'inside') return null;
    return { side: value.side, left: 8 + (value.depth ?? 0) * props.indentation };
  });
  const into = computed(() => indicator.value?.side === 'inside');

  const onClick = (event: MouseEvent) => {
    if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
  };
</script>

<template>
  <div
    ref="el"
    class="tree-row"
    :class="[node.item.type, { selected, into }]"
    :data-id="node.key"
    :data-depth="node.depth"
    :data-into="into || undefined"
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
    <span
      v-if="line"
      class="drop-line"
      :class="line.side"
      :style="{ left: `${line.left}px` }"
      data-drop-line
      :data-side="line.side"
      :data-depth="indicator?.depth"
      :data-parent="indicator?.parentKey ?? 'root'"
    />
  </div>
</template>

<style scoped>
  .tree-row {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding-right: 12px;
    background: var(--ui-surface);
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius);
    cursor: grab;
  }

  .tree-row.selected {
    background: var(--ui-selection-soft);
    border-color: var(--ui-selection);
  }

  .tree-row.into {
    background: var(--ui-primary-soft);
    border-color: var(--ui-primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-primary) 30%, transparent);
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
    color: var(--ui-text-dimmed);
    cursor: pointer;
  }

  /* In the 4px gap between rows, from the drop's indentation to the right edge. */
  .drop-line {
    position: absolute;
    right: 0;
    height: 3px;
    border-radius: 2px;
    background: var(--ui-primary);
    pointer-events: none;
  }

  .drop-line::before {
    content: '';
    position: absolute;
    left: -4px;
    top: -3px;
    width: 9px;
    height: 9px;
    box-sizing: border-box;
    border: 2px solid var(--ui-primary);
    border-radius: 50%;
    background: var(--ui-bg);
  }

  .drop-line.before {
    top: -4px;
  }

  .drop-line.after {
    bottom: -4px;
  }
</style>
