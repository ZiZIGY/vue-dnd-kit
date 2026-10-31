<script setup lang="ts">
  import { shallowRef, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import UTable from '@nuxt/ui/components/Table.vue';
  import type { TableColumn } from '@nuxt/ui';
  import RowHandle from './RowHandle.vue';
  import { createRows, ids, type KitTask } from '../../shared/data';
  import { describeDrop } from '../../../src/data';

  const COUNT = 3_000;
  /** Height of a row with the default `td` padding, the handle button and the divider. */
  const ROW = 58;

  // shallowRef: no deep proxies for thousands of rows.
  const rows = shallowRef(createRows(COUNT));
  const lastDrop = shallowRef('');
  // Typed by hand: UTable's instance type depends on `items`, which depends on this
  // ref (vue-tsc can't infer the cycle). Its `$el` is the root, which is the scroller.
  const table = useTemplateRef<{ $el: HTMLElement | undefined }>('table');
  const { items, captureLayout } = makeSortableList(() => table.value?.$el ?? null, {
    id: 'virtual',
    items: rows,
    // Before the write: the new order is in `result`.
    onDrop: (event) => (lastDrop.value = describeDrop(event.result.get(event.to.list) ?? rows.value, event.keys[0])),
  });

  /*
   * How UTable's `virtualize` (TanStack Virtual inside) meets the virtualization
   * contract (rfcs/0001-v3.md §9):
   *
   * - It renders the draft `items`; `get-row-id` keys its rows and its virtualizer by id
   *   (the default key is the row index). The virtualizer's `getItemKey` is rebuilt
   *   from the table's rows on every change, so measurements follow the keys.
   * - `onChange` calls `captureLayout()`: the virtualizer's own re-measurements and range
   *   changes, after the library's FLIP pass.
   * - `watch-options="{ deep: false }"`: the draft is a new array per reorder, so a
   *   shallow watch is enough; the default deep watch walks every row on every reorder.
   * - `estimateSize` is the real row height, so unmeasured rows don't shift the scroll.
   *
   * Limitation: the active row can't be pinned. UTable reads `virtualize` once, when it
   * is set up, and doesn't expose its virtualizer, so a `rangeExtractor` could never
   * see a new `activeIndex`. Worse, it lays rows out in normal flow between two padding
   * rows sized from the first and the last rendered row: a pinned row outside the range
   * would push every visible row to the wrong place. So the active row unmounts once it
   * is scrolled out of range plus `overscan`; the drag carries on by key and the drop
   * still lands (the overlay fades out when the row isn't rendered), but the row's
   * component state and DOM focus go with it. When the active row must stay mounted,
   * virtualize the rows yourself with `useVirtualizer` (absolutely positioned rows, a
   * `rangeExtractor` that pins `activeIndex`; see src/demos/VirtualTanstackDemo.vue)
   * around Nuxt UI components, instead of UTable's `virtualize`.
   */
  const virtualize = { estimateSize: ROW, overscan: 12, onChange: () => captureLayout() };

  const columns: TableColumn<KitTask>[] = [
    { id: 'drag', header: '' },
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'tag', header: 'Tag' },
  ];
</script>

<template>
  <section class="w-96 max-w-full">
    <h2 class="mb-2 font-semibold text-highlighted">UTable virtualize: {{ COUNT.toLocaleString('en-US') }} rows</h2>
    <UTable
      ref="table"
      :data="items"
      :columns="columns"
      :get-row-id="(row: KitTask) => row.id"
      :virtualize="virtualize"
      :watch-options="{ deep: false }"
      class="h-[480px] rounded-md border border-default"
      data-testid="virtual-scroller"
    >
      <template #drag-cell="{ row }">
        <RowHandle
          :id="row.original.id"
          :name="row.original.title"
        />
      </template>
    </UTable>
    <pre
      class="mt-2 text-xs text-muted whitespace-pre-wrap break-all"
      data-testid="virtual-order"
      >{{ ids(rows.slice(0, 10)) }}</pre
    >
    <pre
      class="text-xs text-muted whitespace-pre-wrap break-all"
      data-testid="virtual-drop"
      >{{ lastDrop }}</pre
    >
  </section>
</template>
