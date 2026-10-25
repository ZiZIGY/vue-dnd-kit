<script setup lang="ts">
  import { shallowRef, useTemplateRef, type ComponentPublicInstance } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import { VDataTableVirtual } from 'vuetify/components';
  import VirtualTableRow from './VirtualTableRow.vue';
  import { createRows, ids, type KitTask } from '../../shared/data';
  import { describeDrop } from '../../../src/data';

  const COUNT = 3_000;

  // Ids are unique per provider: `d…`, not the `r…` of the v-virtual-scroll list.
  const rows = shallowRef(createRows(COUNT, 'd'));
  const lastDrop = shallowRef('');
  // Typed by hand: the table's instance type depends on `items`, which depends on this
  // ref (vue-tsc can't infer the cycle). The scroller is its `.v-table__wrapper`.
  const table = useTemplateRef<ComponentPublicInstance>('table');
  /*
   * How v-data-table-virtual meets the virtualization contract (rfcs/0001-v3.md §9):
   *
   * - It renders the draft `items` with `disable-sort` (no sorting of its own), and
   *   `item-value="id"` keys each row's fragment by id.
   * - The `item` slot hands out `itemRef`: v-data-table-virtual measures the row
   *   through it, so the row element gets both refs (VirtualTableRow.vue).
   * - Rows sit in normal flow between two spacer rows, like v-virtual-scroll: no change
   *   to report with `captureLayout()`, and no event to call it from.
   *
   * Limitations:
   * - Inside each row's fragment it keys the measuring wrapper by index, so every row
   *   whose index changed is remounted on each reorder: the row component and its
   *   state are new, and the focus would drop to <body> during a keyboard drag (the
   *   library focuses the new row again, by key). Rows that must keep component state
   *   need v-virtual-scroll with `item-key`, or a TanStack virtualizer.
   * - As in v-virtual-scroll, no row can be pinned: the active row unmounts once it is
   *   scrolled out of range, and the drag carries on by key.
   */
  const { items } = makeSortableList(
    () => (table.value?.$el as HTMLElement | undefined)?.querySelector<HTMLElement>('.v-table__wrapper') ?? null,
    {
      id: 'virtual-table',
      items: rows,
      // Before the write: the new order is in `result`.
      onDrop: (event) => (lastDrop.value = describeDrop(event.result.get(event.to.list) ?? rows.value, event.keys[0])),
    },
  );

  const headers = [
    { key: 'title', title: 'Title' },
    { key: 'tag', title: 'Tag' },
  ];
  const asRow = (item: unknown) => item as KitTask;
</script>

<template>
  <section style="width: 420px; max-width: 100%">
    <h2 class="text-subtitle-1 font-weight-bold mb-2">
      v-data-table-virtual: {{ COUNT.toLocaleString('en-US') }} v-data-table-rows
    </h2>
    <VDataTableVirtual
      ref="table"
      :headers="headers"
      :items="items"
      item-value="id"
      disable-sort
      height="400"
      density="compact"
      class="border rounded"
      data-testid="virtual-table"
    >
      <template #item="{ item, props: rowProps, itemRef }">
        <VirtualTableRow
          :row="asRow(item)"
          :row-props="rowProps"
          :item-ref="itemRef"
        />
      </template>
    </VDataTableVirtual>
    <pre
      class="text-caption mt-2 text-pre-wrap text-break"
      data-testid="virtual-table-order"
      >{{ ids(rows.slice(0, 10)) }}</pre
    >
    <pre
      class="text-caption text-pre-wrap text-break"
      data-testid="virtual-table-drop"
      >{{ lastDrop }}</pre
    >
  </section>
</template>
