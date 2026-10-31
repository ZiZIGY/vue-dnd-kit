<script setup lang="ts">
  import { shallowRef, type ComponentPublicInstance } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import { VDataTableRow } from 'vuetify/components';
  import type { KitTask } from '../../shared/data';

  const props = defineProps<{
    row: KitTask;
    rowProps: Record<string, unknown>;
    /** v-data-table-virtual measures the row through this ref. */
    itemRef: (target: Element | ComponentPublicInstance | null) => void;
  }>();
  // Vuetify's own row component (a single <tr> root); the library resolves the
  // component to it. One function ref feeds both the library and the table.
  const element = shallowRef<ComponentPublicInstance | null>(null);
  makeSortableItem(element, { id: () => props.row.id });
  const setRef = (target: Element | ComponentPublicInstance | null) => {
    // The ref is on a component: never a bare element.
    element.value = target as ComponentPublicInstance | null;
    props.itemRef(target);
  };
</script>

<template>
  <VDataTableRow
    :ref="setRef"
    v-bind="rowProps"
    :data-id="row.id"
    style="cursor: grab"
  />
</template>
