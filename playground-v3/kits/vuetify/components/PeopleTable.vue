<script setup lang="ts">
  import { ref, useTemplateRef, type ComponentPublicInstance } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import { VDataTable } from 'vuetify/components';
  import PersonRow from './PersonRow.vue';
  import { createPeople, ids } from '../../shared/data';

  const people = ref(createPeople());
  // Typed by hand: the table's instance type depends on `items`, which depends on this
  // ref (vue-tsc can't infer the cycle).
  const table = useTemplateRef<ComponentPublicInstance>('table');
  // v-data-table renders its own <tbody>: the list is found inside the table's root.
  const { items } = makeSortableList(
    () => (table.value?.$el as HTMLElement | undefined)?.querySelector('tbody') ?? null,
    { id: 'people', items: people },
  );

  const headers = [
    { key: 'drag', title: '', sortable: false, width: 56 },
    { key: 'name', title: 'Name' },
    { key: 'role', title: 'Role' },
  ];
</script>

<template>
  <section style="width: 420px">
    <h2 class="text-subtitle-1 font-weight-bold mb-2">People (v-data-table rows)</h2>
    <!-- The draft order is rendered as is: no sorting, no pagination. -->
    <VDataTable
      ref="table"
      :headers="headers"
      :items="items"
      item-value="id"
      :items-per-page="-1"
      hide-default-footer
      disable-sort
      density="compact"
      class="border rounded"
      data-testid="people"
    >
      <template #item="{ item, props: rowProps }">
        <PersonRow
          :person="item"
          :row-props="rowProps"
        />
      </template>
    </VDataTable>
    <pre
      class="text-caption mt-2"
      data-testid="people-state"
      >{{ ids(people) }}</pre
    >
  </section>
</template>
