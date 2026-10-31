<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import NestedColumn from '../components/NestedColumn.vue';
  import { describeLists, makeTasks } from '../data';
  import type { Column } from '../types';

  const columns = ref<Column[]>([
    { id: 'todo', title: 'To do', tasks: makeTasks('a', 3) },
    { id: 'doing', title: 'Doing', tasks: makeTasks('b', 2) },
    { id: 'review', title: 'Review', tasks: [] },
    { id: 'done', title: 'Done', tasks: makeTasks('c', 1) },
  ]);

  const el = useTemplateRef<HTMLElement>('el');
  const { items } = makeSortableList(el, {
    id: 'columns',
    items: columns,
    group: 'columns',
    strategy: 'horizontal',
  });
</script>

<template>
  <section>
    <h2>Kanban with draggable columns</h2>
    <ul
      ref="el"
      class="columns"
      data-testid="columns"
    >
      <NestedColumn
        v-for="column in items"
        :key="column.id"
        :column="column"
      />
    </ul>
    <pre data-testid="state">{{ describeLists(columns) }}</pre>
  </section>
</template>
