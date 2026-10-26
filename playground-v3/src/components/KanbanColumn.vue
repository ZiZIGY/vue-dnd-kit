<script setup lang="ts">
  import { toRef, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import SortableRow from './SortableRow.vue';
  import type { Column } from '../types';

  const props = defineProps<{ column: Column; wholeColumn?: boolean }>();
  const columnRef = useTemplateRef<HTMLElement>('column');
  const listRef = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(listRef, {
    id: props.column.id,
    items: toRef(props.column, 'tasks'),
    group: 'board',
    // The whole column takes drops (a card let go below the list lands at its end).
    dropzone: () => (props.wholeColumn ? columnRef.value : null),
  });
</script>

<template>
  <div
    ref="column"
    :data-testid="`column-${column.id}`"
  >
    <h3>{{ column.title }}</h3>
    <ul
      ref="list"
      class="list"
      :data-testid="column.id"
    >
      <SortableRow
        v-for="task in items"
        :key="task.id"
        :item="task"
      />
    </ul>
  </div>
</template>
