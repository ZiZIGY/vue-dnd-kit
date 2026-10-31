<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import { VList } from 'vuetify/components';
  import TaskItem from './TaskItem.vue';
  import { createTasks, ids } from '../../shared/data';

  const tasks = ref(createTasks());
  const list = useTemplateRef('list');
  const { items } = makeSortableList(list, { id: 'tasks', items: tasks });
</script>

<template>
  <section style="width: 340px">
    <h2 class="text-subtitle-1 font-weight-bold mb-2">Tasks (v-list-item, v-btn handle)</h2>
    <VList
      ref="list"
      class="pa-2"
      rounded="lg"
      data-testid="tasks"
    >
      <TaskItem
        v-for="task in items"
        :key="task.id"
        :task="task"
      />
    </VList>
    <pre
      class="text-caption mt-2 text-pre-wrap text-break"
      data-testid="tasks-state"
      >{{ ids(tasks) }}</pre
    >
  </section>
</template>
