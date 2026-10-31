<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import type { Task } from '../types';

  // `size` must match the virtualizer's item size exactly (VueUse `itemHeight`).
  const props = defineProps<{ item: Task; size: number }>();
  const el = useTemplateRef<HTMLElement>('el');
  // A getter: virtual lists may hand this component another item.
  const { selected } = makeSortableItem(el, { id: () => props.item.id });

  // Ctrl/Cmd+click selects for multi-drag; the selection is keyed by id, so it survives
  // the row being recycled or unmounted while scrolled away.
  const onClick = (event: MouseEvent) => {
    if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
  };
</script>

<template>
  <div
    ref="el"
    class="vrow"
    :class="{ selected }"
    :data-id="item.id"
    :data-selected="selected || undefined"
    :style="{ height: `${size}px` }"
    @click="onClick"
  >
    {{ item.title }}
  </div>
</template>

<style scoped>
  .vrow {
    display: flex;
    align-items: center;
    padding: 0 12px;
    background: var(--ui-surface);
    border-bottom: 1px solid var(--ui-border);
    cursor: grab;
  }

  .vrow.selected {
    background: var(--ui-selection-soft);
    box-shadow: inset 3px 0 var(--ui-selection);
  }
</style>
