<script setup lang="ts" generic="T extends Record<string, unknown>">
  import { useDraggable } from '@vue-dnd-kit/core';
  import { ITableColumn } from './types';
  import { computed } from 'vue';

  const { column, columns, columnIndex, headerGroups } = defineProps<{
    column: ITableColumn<T>;
    columns: ITableColumn<T>[];
    columnIndex: number;
    headerGroups: string[];
  }>();

  const { elementRef, handleDragStart } = useDraggable({
    groups: headerGroups,
    data: computed(() => ({
      source: columns,
      index: columnIndex,
    })),
  });
</script>

<template>
  <th
    ref="elementRef"
    @pointerdown="handleDragStart"
  >
    <slot :column="column">
      {{ column.label }}
    </slot>
  </th>
</template>
