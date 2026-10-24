<script setup lang="ts">
  import { ref } from 'vue';
  import KanbanColumn from '../components/KanbanColumn.vue';
  import type { Column } from '../types';

  const columns = ref<Column[]>([
    {
      id: 'todo',
      title: 'To do',
      tasks: [1, 2, 3, 4].map((n) => ({ id: `a${n}`, title: `Card A${n}` })),
    },
    {
      id: 'doing',
      title: 'Doing',
      tasks: [1, 2].map((n) => ({ id: `b${n}`, title: `Card B${n}` })),
    },
    { id: 'done', title: 'Done', tasks: [] },
  ]);
</script>

<template>
  <section>
    <h2>Kanban</h2>
    <div class="board">
      <KanbanColumn
        v-for="column in columns"
        :key="column.id"
        :column="column"
      />
    </div>
    <pre data-testid="board">{{
      columns.map((column) => `${column.id}:${column.tasks.map((task) => task.id).join(',')}`).join(' | ')
    }}</pre>
  </section>
</template>
