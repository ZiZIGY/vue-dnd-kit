<script setup lang="ts" generic="T extends Record<string, unknown>">
  import { DnDOperations, useDroppable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';
  import { ITableColumn } from './types';
  import TableColumn from './TableColumn.vue';

  const {
    rows,
    columns,
    bodyGroups = ['table-body'],
    headerGroups = ['table-header'],
  } = defineProps<{
    rows: T[];
    columns: ITableColumn<T>[];
    bodyGroups?: string[];
    headerGroups?: string[];
  }>();

  const { elementRef: tableHeaderRef } = useDroppable({
    groups: headerGroups,
    data: computed(() => ({
      source: columns,
    })),
    events: {
      onDrop: (store) => {
        DnDOperations.applyTransfer(store);
      },
    },
  });

  const { elementRef: tableBodyRef } = useDroppable({
    groups: bodyGroups,
    data: computed(() => ({
      source: rows,
    })),
    events: {
      onDrop: (store) => {
        DnDOperations.applyTransfer(store);
      },
    },
  });

  defineSlots<
    {
      [K in keyof T as K extends string ? `header-${K}` : never]: (props: {
        column: ITableColumn<T>;
      }) => any;
    } & {
      default: (props: {
        rows: T[];
        columns: ITableColumn<T>[];
        bodyGroups: string[];
      }) => any;
    }
  >();
</script>

<template>
  <table>
    <thead ref="tableHeaderRef">
      <tr>
        <TableColumn
          v-for="(column, index) in columns"
          :key="column.key"
          :column="column"
          :column-index="index"
          :columns="columns"
          :header-groups="headerGroups"
        >
          <slot
            :name="`header-${String(column.key)}`"
            :column="column"
          />
        </TableColumn>
      </tr>
    </thead>
    <tbody ref="tableBodyRef">
      <slot
        :rows="rows"
        :columns="columns"
        :body-groups="bodyGroups"
      />
    </tbody>
  </table>
</template>
