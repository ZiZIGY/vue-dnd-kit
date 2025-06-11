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

  const { elementRef, handleDragStart } = useDraggable({
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
  >
    <td
      v-for="column in columns"
      :key="column.key"
    >
      {{ row[column.key] }}
    </td>
  </tr>
</template>
