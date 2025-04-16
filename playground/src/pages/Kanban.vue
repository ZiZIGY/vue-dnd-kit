<script setup>
  import { ref } from 'vue';
  import { Kanban, KanbanColumn, KanbanItem } from '@vue-dnd-kit/components';
  import { DnDOperations } from '@vue-dnd-kit/core';

  const columns = ref([
    {
      title: 'К выполнению',
      color: '#f97316',
      items: [
        {
          id: '1',
          title: 'Создать дизайн',
          description: 'Разработать UI/UX',
        },
        {
          id: '2',
          title: 'Настроить проект',
          description: 'Инициализация Vue проекта',
        },
      ],
    },
    {
      title: 'В процессе',
      color: '#3b82f6',
      items: [
        {
          id: '3',
          title: 'Разработать компоненты',
          description: 'Создать базовые компоненты',
        },
        {
          id: '4',
          title: 'Написать тесты',
          description: 'Покрыть код тестами',
        },
      ],
    },
    {
      title: 'Выполнено',
      color: '#22c55e',
      items: [
        {
          id: '5',
          title: 'Документация',
          description: 'Написать документацию',
        },
      ],
    },
  ]);
</script>

<template>
  <div class="kanban-container">
    <h2>Пример Kanban доски</h2>

    <Kanban
      @drop="DnDOperations.applyTransfer"
      tag="ul"
      class="kanban-board"
    >
      <KanbanColumn
        v-for="(column, columnIndex) in columns"
        :key="`kanban-column-${column.title}`"
        :title="column.title"
        :index="columnIndex"
        :source="columns"
        @drop="DnDOperations.applyTransfer"
        tag="li"
        class="kanban-column"
        :style="{ '--column-color': column.color }"
      >
        <template #header>
          <div
            class="column-header"
            :style="{ backgroundColor: column.color }"
          >
            {{ column.title }}
          </div>
        </template>

        <KanbanItem
          v-for="(task, taskIndex) in column.items"
          :key="task.id"
          :index="taskIndex"
          :source="column.items"
          :prevent-root-drag="false"
          tag="li"
          class="task-card"
          v-slot="{ handleDragStart }"
        >
          <button @pointerdown="handleDragStart">
            <h3>{{ task.title }}</h3>
            <p>{{ task.description }}</p>
          </button>
        </KanbanItem>
      </KanbanColumn>
    </Kanban>
  </div>
</template>

<style>
  .kanban-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .kanban-board {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 16px;
  }

  .kanban-column {
    flex: 1;
    min-width: 280px;
    background-color: #f1f5f9;
    border-radius: 8px;
    border-top: 4px solid var(--column-color);
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .column-header {
    padding: 12px;
    font-weight: bold;
    color: white;
    border-radius: 4px 4px 0 0;
  }

  .task-list {
    list-style: none;
    padding: 12px;
    margin: 0;
  }

  .task-card {
    background-color: white;
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .task-card h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
  }

  .task-card p {
    margin: 0;
    font-size: 14px;
    color: #64748b;
  }

  .dnd-kit-kanban-column-body {
    list-style: none;
    padding: 20px;
    height: 100%;
  }
  .dnd-kit-droppable-active {
    background-color: #f0f0f0;
  }
</style>
