<script setup lang="ts">
  import { ref } from 'vue';
  import {
    Kanban,
    KanbanColumn,
    KanbanItem,
  } from '@vue-dnd-kit/components/templates/Kanban';
  import { useDnDStore } from '@vue-dnd-kit/core';

  interface ITask {
    id: number;
    title: string;
  }

  interface IColumn {
    id: number;
    title: string;
    tasks: ITask[];
  }

  const columns = ref<IColumn[]>([
    {
      id: 1,
      title: 'To Do',
      tasks: [
        { id: 1, title: 'Research competitors' },
        { id: 2, title: 'Define project scope' },
      ],
    },
    {
      id: 2,
      title: 'In Progress',
      tasks: [
        { id: 3, title: 'Create wireframes' },
        { id: 4, title: 'Design UI components' },
      ],
    },
    {
      id: 3,
      title: 'Done',
      tasks: [
        { id: 5, title: 'Project kickoff meeting' },
        { id: 6, title: 'Gather requirements' },
      ],
    },
  ]);

  const store = useDnDStore();
</script>

<template>
  <Kanban
    :columns="columns"
    v-slot="{ columns }"
  >
    <KanbanColumn
      v-for="(column, index) in columns"
      :key="column.id"
      :column="column"
      :columns="columns"
      :column-index="index"
      :body-source="column.tasks"
    >
      <template #header>
        {{ column.title }}
      </template>

      <KanbanItem
        v-for="(task, taskIndex) in column.tasks"
        :key="task.id"
        :item="task"
        :items="column.tasks"
        :item-index="taskIndex"
      >
        {{ task.title }}
      </KanbanItem>
    </KanbanColumn>
  </Kanban>
</template>

<style>
  pre {
    text-align: left;
    position: fixed;
    width: 300px;
    height: 100svh;
    overflow: auto;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: #fff;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  body {
    margin: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
      sans-serif;
    background-color: #f8fafc;
    color: #334155;
  }

  .playground {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 16px;
  }

  main {
    flex: 1;
    padding: 24px 0;
  }

  /* Сбрасываем стили из исходного файла */
  pre {
    max-width: none;
  }
</style>
