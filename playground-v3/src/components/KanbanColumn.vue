<script setup lang="ts">
  import { toRef, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import SortableRow from './SortableRow.vue';
  import type { Column } from '../types';

  const props = defineProps<{ column: Column }>();
  const listRef = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(listRef, {
    id: props.column.id,
    items: toRef(props.column, 'tasks'),
    group: 'board',
  });
</script>

<template>
  <div>
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
