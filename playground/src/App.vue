<script setup lang="ts">
  import { Kanban, KanbanColumn, KanbanItem } from '@vue-dnd-kit/components';
  import { DnDOperations } from '@vue-dnd-kit/core';
  import { ref } from 'vue';

  const data = ref([
    {
      title: 'To Do',
      items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    },
    {
      title: 'In Progress',
      items: [],
    },
    {
      title: 'Done',
      items: [],
    },
  ]);
</script>

<template>
  <div class="kanban-container">
    <Kanban @drop="DnDOperations.applyTransfer">
      <KanbanColumn
        v-for="(column, index) in data"
        :key="`kanban-column-${column.title}`"
        :title="column.title"
        :index="index"
        :source="data"
        @drop="DnDOperations.applyTransfer"
      >
        <template #header>
          <h2 class="column-header">{{ column.title }}</h2>
        </template>

        <KanbanItem
          v-for="(item, index) in column.items"
          :key="item"
          :index="index"
          :source="column.items"
          :prevent-root-drag="false"
        >
          {{ item }}
        </KanbanItem>
      </KanbanColumn>
    </Kanban>
  </div>
</template>

<style scoped>
  pre {
    position: fixed;
    top: 0;
    left: 0;
    height: 100svh;
    text-align: left;
    max-width: 300px;
    overflow: auto;
  }

  .column-header {
    font-weight: bold;
    margin-bottom: 12px;
    padding: 8px;
  }
</style>
