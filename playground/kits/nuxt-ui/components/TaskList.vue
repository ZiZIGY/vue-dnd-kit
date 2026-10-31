<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import TaskCard from './TaskCard.vue';
  import { createTasks, ids } from '../../shared/data';

  const tasks = ref(createTasks());
  const list = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(list, { id: 'tasks', items: tasks });
</script>

<template>
  <section class="w-80">
    <h2 class="mb-2 font-semibold text-highlighted">Tasks (UCard, UButton handle)</h2>
    <div
      ref="list"
      class="flex flex-col gap-2"
      data-testid="tasks"
    >
      <TaskCard
        v-for="task in items"
        :key="task.id"
        :task="task"
      />
    </div>
    <pre
      class="mt-2 text-xs text-muted whitespace-pre-wrap break-all"
      data-testid="tasks-state"
      >{{ ids(tasks) }}</pre
    >
  </section>
</template>
