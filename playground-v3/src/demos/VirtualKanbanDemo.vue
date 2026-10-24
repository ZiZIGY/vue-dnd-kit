<script setup lang="ts">
  import { shallowRef } from 'vue';
  import VirtualKanbanColumn from '../components/VirtualKanbanColumn.vue';
  import { makeRows } from '../data';

  const PER_COLUMN = 2_000;
  // A plain array of shallow refs: each column's list writes its own Ref on drop,
  // and 6k cards never get deep proxies.
  const columns = [
    { id: 'todo', title: 'To do', tasks: shallowRef(makeRows('a', PER_COLUMN, 'Card')) },
    { id: 'doing', title: 'Doing', tasks: shallowRef(makeRows('b', PER_COLUMN, 'Card')) },
    { id: 'done', title: 'Done', tasks: shallowRef(makeRows('c', PER_COLUMN, 'Card')) },
  ];
  const lastDrop = shallowRef('');
</script>

<template>
  <section>
    <h2>Virtual kanban: 3 × {{ PER_COLUMN.toLocaleString('en-US') }} cards</h2>
    <div class="board">
      <VirtualKanbanColumn
        v-for="column in columns"
        :key="column.id"
        :column="column"
        :on-dropped="(text: string) => (lastDrop = text)"
      />
    </div>
    <pre data-testid="virtual-board">{{
      columns
        .map(
          (column) =>
            `${column.id}(${column.tasks.value.length}):${column.tasks.value
              .slice(0, 5)
              .map((task) => task.id)
              .join(',')}`,
        )
        .join(' | ')
    }}</pre>
    <pre data-testid="virtual-board-drop">{{ lastDrop }}</pre>
  </section>
</template>
