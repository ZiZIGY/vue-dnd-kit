<script setup lang="ts">
import { computed, ref, shallowRef, useTemplateRef } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { makeSortableList } from '@vue-dnd-kit/core';
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
  axis: 'y',
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
  <div class="mx-auto flex w-full max-w-3xl flex-col gap-3">
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
      class="h-[26rem] rounded-lg bg-default ring ring-default"
      :ui="{
        th: 'py-2.5',
        td: 'py-2 whitespace-nowrap',
        tr: 'data-[dnd-placeholder]:bg-primary/5',
      }"
    >
      <template #grip-cell="{ row }">
        <RowGrip :task="row.original" />
      </template>
      <template #id-cell="{ row }">
        <span class="font-mono text-xs text-muted">{{ row.original.id }}</span>
      </template>
      <template #title-cell="{ row }">
        <span class="font-medium text-highlighted">{{ row.original.title }}</span>
      </template>
      <template #status-cell="{ row }">
        <UBadge :label="row.original.status" :color="COLORS[row.original.status]" variant="subtle" size="sm" />
      </template>
      <template #assignee-cell="{ row }">
        <div class="flex items-center gap-2">
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
