<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import SortableRow from '../components/SortableRow.vue';

  const tasks = ref(
    Array.from({ length: 8 }, (_, index) => ({
      id: `t${index + 1}`,
      title: `Task ${index + 1}`,
      // Different heights exercise the anti-oscillation rule.
      tall: index === 2,
    })),
  );

  const listRef = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(listRef, { items: tasks, id: 'list' });
</script>

<template>
  <section>
    <h2>Vertical list</h2>
    <ul
      ref="list"
      class="list"
      data-testid="list"
    >
      <SortableRow
        v-for="task in items"
        :key="task.id"
        :item="task"
      />
    </ul>
    <pre data-testid="order">{{ tasks.map((task) => task.id).join(',') }}</pre>
  </section>
</template>
