<script setup lang="ts">
  import { ref, shallowRef, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import TableRow from '../components/TableRow.vue';

  const people = ref([
    { id: 'p1', name: 'Ada Lovelace', role: 'Analyst' },
    { id: 'p2', name: 'Alan Turing', role: 'Cryptographer' },
    { id: 'p3', name: 'Grace Hopper', role: 'Admiral' },
    { id: 'p4', name: 'Edsger Dijkstra', role: 'Professor' },
    { id: 'p5', name: 'Barbara Liskov', role: 'Professor' },
  ]);

  // Rows only move up and down: the list's `axis` keeps the dragged row on the y axis.
  const lockAxis = shallowRef(true);
  const body = useTemplateRef<HTMLElement>('body');
  const { items } = makeSortableList(body, {
    id: 'table',
    items: people,
    axis: () => (lockAxis.value ? 'y' : undefined),
  });
</script>

<template>
  <section>
    <h2>Sortable table rows</h2>
    <label>
      <input
        v-model="lockAxis"
        type="checkbox"
        data-testid="lock-axis"
      />
      Lock to the vertical axis
    </label>
    <table class="sortable-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody
        ref="body"
        data-testid="table"
      >
        <TableRow
          v-for="person in items"
          :key="person.id"
          :person="person"
        />
      </tbody>
    </table>
    <pre data-testid="state">{{ people.map((person) => person.id).join(',') }}</pre>
  </section>
</template>
