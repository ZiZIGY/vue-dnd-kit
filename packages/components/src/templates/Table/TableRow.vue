<script setup lang="ts" generic="T extends Record<string, unknown>">
  import { useDraggable } from '@vue-dnd-kit/core';
  import { ITableColumn } from './types';
  import { computed } from 'vue';

  const { rowIndex, rows, bodyGroups } = defineProps<{
    row: T;
    rowIndex: number;
    columns: ITableColumn<T>[];
    rows: T[];
    bodyGroups: string[];
  }>();

  const { isDragging, elementRef, handleDragStart, isOvered } = useDraggable({
    groups: bodyGroups,
    data: computed(() => ({
      source: rows,
      index: rowIndex,
    })),
  });
</script>

<template>
  <tr
    ref="elementRef"
    @pointerdown="handleDragStart"
    class="vue-dnd-table-row"
    :class="{
      'vue-dnd-table-dragging': isDragging,
      'vue-dnd-table-row-drop-indicator': isOvered,
    }"
  >
    <td
      v-for="column in columns"
      :key="column.key"
      class="vue-dnd-table-cell"
      v-text="row[column.key]"
    />
  </tr>
</template>
