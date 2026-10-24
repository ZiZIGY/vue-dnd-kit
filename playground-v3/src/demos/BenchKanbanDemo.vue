<script setup lang="ts">
  import { shallowRef } from 'vue';
  import BenchKanbanColumn from '../components/BenchKanbanColumn.vue';
  import { makeRows } from '../data';
  import { useBench } from '../bench';

  // 5 columns × 1,000 cards, all mounted (no virtualization): the cost of a
  // cross-list move with large drafts and 5k registered items (rfcs/0001-v3.md §12).
  const PER_COLUMN = 1_000;
  const columns = ['k1', 'k2', 'k3', 'k4', 'k5'].map((id) => ({
    id,
    tasks: shallowRef(makeRows(`${id}-`, PER_COLUMN, 'Card')),
  }));
  const bench = useBench();
</script>

<template>
  <section>
    <h2>Bench: kanban, 5 × {{ PER_COLUMN.toLocaleString('en-US') }} cards</h2>
    <div class="board">
      <BenchKanbanColumn
        v-for="column in columns"
        :key="column.id"
        :column="column"
        :bench="bench"
      />
    </div>
  </section>
</template>
