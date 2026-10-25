<script setup lang="ts">
  import { shallowRef, useTemplateRef, type ComponentPublicInstance } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import { VSheet, VVirtualScroll } from 'vuetify/components';
  import VirtualRow from './VirtualRow.vue';
  import { createRows, ids } from '../../shared/data';
  import { describeDrop } from '../../../src/data';

  const COUNT = 3_000;
  const ROW = 48;

  // shallowRef: no deep proxies for thousands of rows.
  const rows = shallowRef(createRows(COUNT));
  const lastDrop = shallowRef('');
  // The v-virtual-scroll root is the scroller and the sortable container. Typed by hand:
  // its instance type depends on `items`, which depends on this ref (an inference cycle).
  const scroller = useTemplateRef<ComponentPublicInstance>('scroller');
  const { items } = makeSortableList(scroller, {
    id: 'virtual',
    items: rows,
    onDrop: (event) => (lastDrop.value = describeDrop(rows.value, event.keys[0])),
  });

  /*
   * How v-virtual-scroll meets the virtualization contract (rfcs/0001-v3.md §9):
   *
   * - It renders the draft `items` (a new array per reorder, which its `items` watcher
   *   needs) and keys rows by `item-key="id"`; without it, rows are keyed by index.
   * - Rows sit in normal flow between two padding spacers, so the browser lays them
   *   out during the patch and the library measures them right after it: there is no
   *   change to report with `captureLayout()`, and v-virtual-scroll has no change event
   *   to call it from anyway.
   * - `item-height` must equal the real row height (the rows set it themselves);
   *   v-virtual-scroll sizes rows by index and resets its sizes on every reorder.
   *
   * Limitation: there is no way to pin a row. It renders a contiguous slice of `items`
   * (no `rangeExtractor`), so the active row unmounts once it is scrolled out of range
   * plus a 100px buffer. The drag carries on by key and the drop still lands (the
   * overlay fades out when the row isn't rendered), but the row's component state and
   * DOM focus go with it. When the active row must stay mounted, render the rows with
   * TanStack Virtual instead (`useVirtualizer` with a `rangeExtractor` that pins
   * `activeIndex`, absolutely positioned rows; see src/demos/VirtualTanstackDemo.vue)
   * and keep the kit components inside the rows.
   */
</script>

<template>
  <section style="width: 420px; max-width: 100%">
    <h2 class="text-subtitle-1 font-weight-bold mb-2">
      v-virtual-scroll: {{ COUNT.toLocaleString('en-US') }} v-list-items
    </h2>
    <VSheet
      border
      rounded="lg"
      class="overflow-hidden"
    >
      <VVirtualScroll
        ref="scroller"
        :items="items"
        item-key="id"
        :item-height="ROW"
        height="480"
        data-testid="virtual-scroller"
      >
        <template #default="{ item }">
          <VirtualRow
            :row="item"
            :height="ROW"
          />
        </template>
      </VVirtualScroll>
    </VSheet>
    <pre
      class="text-caption mt-2 text-pre-wrap text-break"
      data-testid="virtual-order"
      >{{ ids(rows.slice(0, 10)) }}</pre
    >
    <pre
      class="text-caption text-pre-wrap text-break"
      data-testid="virtual-drop"
      >{{ lastDrop }}</pre
    >
  </section>
</template>
