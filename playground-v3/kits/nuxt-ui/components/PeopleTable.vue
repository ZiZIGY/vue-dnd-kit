<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import UTable from '@nuxt/ui/components/Table.vue';
  import type { TableColumn } from '@nuxt/ui';
  import RowHandle from './RowHandle.vue';
  import { createPeople, ids, type KitPerson } from '../../shared/data';

  const people = ref(createPeople());
  // Typed by hand: UTable's instance type depends on `items`, which depends on this ref
  // (vue-tsc can't infer the cycle). UTable exposes its <table> as `tableRef`.
  const table = useTemplateRef<{ tableRef: HTMLTableElement | null }>('table');
  // The list is UTable's own <tbody>, which holds nothing but the rows.
  const { items } = makeSortableList(() => table.value?.tableRef?.tBodies[0] ?? null, {
    id: 'people',
    items: people,
  });

  const columns: TableColumn<KitPerson>[] = [
    { id: 'drag', header: '' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'role', header: 'Role' },
  ];
</script>

<template>
  <section class="w-96">
    <h2 class="mb-2 font-semibold text-highlighted">People (UTable rows)</h2>
    <!-- Rows keyed by id (getRowId): the default key is the row index. -->
    <UTable
      ref="table"
      :data="items"
      :columns="columns"
      :get-row-id="(person: KitPerson) => person.id"
      class="rounded-md border border-default"
      data-testid="people"
    >
      <template #drag-cell="{ row }">
        <RowHandle
          :id="row.original.id"
          :name="row.original.name"
        />
      </template>
    </UTable>
    <pre
      class="mt-2 text-xs text-muted"
      data-testid="people-state"
      >{{ ids(people) }}</pre
    >
  </section>
</template>
