<script setup lang="ts">
import { computed, ref, shallowRef, useTemplateRef } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { makeSortableList, restrictToFirstScrollableAncestor } from '@vue-dnd-kit/core';
import RowGrip from './RowGrip.vue';
import { makeTasks, type Status, type Task } from './tasks';

const tasks = shallowRef(makeTasks(2_000));
const query = ref('');

// The sortable list is the table's `<tbody>`, where UTable renders the rows.
const table = useTemplateRef<{ tableRef: HTMLTableElement | null }>('table');
const { items, captureLayout } = makeSortableList(() => table.value?.tableRef?.tBodies[0] ?? null, {
  items: tasks,
  // The search shows some of the tasks; a drop writes the whole array, the hidden ones
  // where they were.
  filter: (task) => {
    const text = query.value.trim().toLowerCase();
    return !text || `${task.id} ${task.title} ${task.assignee}`.toLowerCase().includes(text);
  },
  // Up and down only, and never out of the table: its scroller is the rows' first
  // scrollable ancestor.
  axis: 'y',
  modifiers: [restrictToFirstScrollableAncestor],
  label: 'Tasks',
});

const columns: TableColumn<Task>[] = [
  { id: 'grip', header: '' },
  { accessorKey: 'id', header: 'Key' },
  { accessorKey: 'title', header: 'Task' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'assignee', header: 'Assignee' },
  { accessorKey: 'points', header: 'Points' },
];

const COLORS: Record<Status, 'neutral' | 'info' | 'warning' | 'success'> = {
  Backlog: 'neutral',
  Todo: 'info',
  'In progress': 'warning',
  Done: 'success',
};

const shown = computed(() => (query.value.trim() ? `${items.value.length} of ${tasks.value.length}` : `${tasks.value.length}`));
</script>

<template>
  <!-- As tall as the frame on the page; expanded, the frame is a flex column that `flex-1` fills. -->
  <div class="mx-auto flex h-[29rem] min-h-0 w-full max-w-7xl flex-1 flex-col gap-3">
    <div class="flex items-center gap-3">
      <UInput v-model="query" icon="i-lucide-search" placeholder="Search tasks, keys, people" class="flex-1" />
      <span class="shrink-0 text-xs text-muted tabular-nums">{{ shown }} tasks</span>
    </div>

    <!--
      `data` is the list's draft: the rows move while you drag, and only the matching ones show.
      `get-row-id` keys the rows by task, as the list does. The virtualizer measures every
      row; `onChange` lets the library animate what its measuring moves.
    -->
    <UTable
      ref="table"
      :data="items"
      :columns="columns"
      :get-row-id="(task: Task) => task.id"
      :watch-options="{ deep: false }"
      :virtualize="{ estimateSize: 45, overscan: 8, onChange: () => captureLayout() }"
      sticky
      class="min-h-0 flex-1 rounded-lg bg-default ring ring-default"
      :ui="{
        th: 'px-3 py-2.5',
        td: 'px-3 py-2',
        tr: 'data-[dnd-placeholder]:bg-primary/5',
      }"
    >
      <template #grip-cell="{ row }">
        <RowGrip :task="row.original" />
      </template>
      <!-- The task's title may wrap: the rest stays on one line, and the row fits the table. -->
      <template #id-cell="{ row }">
        <span class="font-mono text-xs whitespace-nowrap text-muted">{{ row.original.id }}</span>
      </template>
      <template #title-cell="{ row }">
        <span class="font-medium text-highlighted">{{ row.original.title }}</span>
      </template>
      <template #status-cell="{ row }">
        <UBadge :label="row.original.status" :color="COLORS[row.original.status]" variant="subtle" size="sm" class="whitespace-nowrap" />
      </template>
      <template #assignee-cell="{ row }">
        <div class="flex items-center gap-2 whitespace-nowrap">
          <UAvatar :alt="row.original.assignee" size="2xs" />
          <span>{{ row.original.assignee }}</span>
        </div>
      </template>
      <template #points-cell="{ row }">
        <span class="tabular-nums">{{ row.original.points }}</span>
      </template>
      <template #empty>
        <span class="text-muted">No task matches “{{ query }}”.</span>
      </template>
    </UTable>
  </div>
</template>
