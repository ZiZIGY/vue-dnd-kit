<script setup lang="ts">
  import {
    Kanban,
    KanbanColumn,
    KanbanItem,
  } from '@vue-dnd-kit/components/src/templates/Kanban';
  import ExampleContainer from '../../ExampleContainer.vue';
  import { ref } from 'vue';

  interface ITask {
    id: number;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
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
        { id: 1, title: 'Research competitors', priority: 'high' },
        { id: 2, title: 'Define project scope', priority: 'medium' },
        { id: 3, title: 'Setup development environment', priority: 'low' },
      ],
    },
    {
      id: 2,
      title: 'In Progress',
      tasks: [
        { id: 4, title: 'Create wireframes', priority: 'high' },
        { id: 5, title: 'Design UI components', priority: 'medium' },
      ],
    },
    {
      id: 3,
      title: 'Done',
      tasks: [
        { id: 6, title: 'Project kickoff meeting', priority: 'high' },
        { id: 7, title: 'Gather requirements', priority: 'medium' },
        { id: 8, title: 'Setup repository', priority: 'low' },
      ],
    },
  ]);
</script>

<template>
  <ExampleContainer>
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
        style="margin-top: 0px"
      >
        <template #header>
          <div class="column-header">
            <h3>{{ column.title }}</h3>
            <span class="task-count">{{ column.tasks.length }}</span>
          </div>
        </template>

        <TransitionGroup name="task">
          <KanbanItem
            v-for="(task, taskIndex) in column.tasks"
            :key="task.id"
            :item="task"
            :items="column.tasks"
            :item-index="taskIndex"
            v-slot="{ item }"
          >
            <div class="task-content">
              <div class="task-header">
                <h4>{{ item.title }}</h4>
                <span
                  class="priority-badge"
                  :class="item.priority"
                >
                  {{ item.priority }}
                </span>
              </div>
              <p
                v-if="item.description"
                class="task-description"
              >
                {{ item.description }}
              </p>
            </div>
          </KanbanItem>
        </TransitionGroup>
      </KanbanColumn>
    </Kanban>
  </ExampleContainer>
</template>

<style>
  .column-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .column-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .task-count {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .task-content {
    width: 100%;
  }

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .task-header h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
    flex: 1;
  }

  .priority-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
    margin-left: 8px;
  }

  .priority-badge.high {
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
  }

  .priority-badge.medium {
    background: rgba(255, 193, 7, 0.1);
    color: #ffc107;
  }

  .priority-badge.low {
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
  }

  .task-description {
    margin: 0;
    font-size: 12px;
    color: #666;
    line-height: 1.4;
  }

  .task-move {
    transition: all 0.3s ease;
  }

  .task-enter-active,
  .task-leave-active {
    transition: all 0.3s ease;
  }

  .task-enter-from,
  .task-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
</style>
