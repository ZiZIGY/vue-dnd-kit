<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { Kanban, KanbanColumn, KanbanItem } from '@vue-dnd-kit/components';
  import { DnDOperations, useDnDStore } from '@vue-dnd-kit/core';
  import kanbanData from '../data/kanbanData.json';

  const store = useDnDStore();
  const columns = ref(kanbanData.columns);

  // Функция для генерации большого количества задач
  const generateTasks = (baseId, count) => {
    const tasks = [];
    for (let i = 0; i < count; i++) {
      const id = `${baseId}-${i + 1}`;
      tasks.push({
        id,
        title: `Задача ${id}`,
        description: `Описание задачи ${id}`,
      });
    }
    return tasks;
  };

  // Добавляем дополнительные задачи к каждой колонке
  onMounted(() => {
    columns.value.forEach((column, index) => {
      const additionalTasks = generateTasks(100 * (index + 1), 200);
      column.items.push(...additionalTasks);
    });
  });
</script>

<template>
  <div class="kanban-container">
    <h2>Пример Kanban доски с большими данными (1000+ элементов)</h2>

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
            {{ column.title }} ({{ column.items.length }})
          </div>
        </template>

        <div class="task-list-container">
          <ul class="task-list">
            <KanbanItem
              v-for="(task, taskIndex) in column.items"
              :key="task.id"
              :index="taskIndex"
              :source="column.items"
              tag="li"
              class="task-card"
              v-slot="{ handleDragStart }"
            >
              <button @pointerdown="handleDragStart">
                <h3>{{ task.title }}</h3>
                <p>{{ task.description }}</p>
              </button>

              <KanbanColumn
                :title="task.title"
                :index="3"
                :source="column.items"
                tag="li"
                class="task-card"
              >

              </KanbanColumn>
            </KanbanItem>
          </ul>
        </div>
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
    overflow-x: auto;
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
    max-height: 80vh;
  }

  .column-header {
    padding: 12px;
    font-weight: bold;
    color: white;
    border-radius: 4px 4px 0 0;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .task-list-container {
    overflow-y: auto;
    flex: 1;
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

  .task-card button {
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 0;
    cursor: grab;
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
    overflow-y: auto;
  }

  .dnd-kit-droppable-active {
    background-color: #f0f0f0;
  }
</style>
