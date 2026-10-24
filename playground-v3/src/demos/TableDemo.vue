<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import TableRow from '../components/TableRow.vue';

  const people = ref([
    { id: 'p1', name: 'Ada Lovelace', role: 'Analyst' },
    { id: 'p2', name: 'Alan Turing', role: 'Cryptographer' },
    { id: 'p3', name: 'Grace Hopper', role: 'Admiral' },
    { id: 'p4', name: 'Edsger Dijkstra', role: 'Professor' },
    { id: 'p5', name: 'Barbara Liskov', role: 'Professor' },
  ]);

  const body = useTemplateRef<HTMLElement>('body');
  const { items } = makeSortableList(body, { id: 'table', items: people });
</script>

<template>
  <section>
    <h2>Sortable table rows</h2>
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
