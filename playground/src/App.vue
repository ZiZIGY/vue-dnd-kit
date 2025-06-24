<script setup lang="ts">
  import {
    Sortable,
    SortableItem,
  } from '@vue-dnd-kit/components/templates/Sortable';

  import { ref } from 'vue';

  interface Task {
    id: number;
    title: string;
    status: 'success' | 'warning' | 'error' | 'info';
  }

  const tasks = ref<Task[]>([
    { id: 1, title: 'Complete project', status: 'success' },
    { id: 2, title: 'Client meeting', status: 'warning' },
    { id: 3, title: 'Update documentation', status: 'info' },
    { id: 4, title: 'Fix bugs', status: 'error' },
  ]);

  const addTask = () => {
    const newId = Math.max(0, ...tasks.value.map((t) => t.id)) + 1;
    tasks.value.push({
      id: newId,
      title: `New task ${newId}`,
      status: ['success', 'warning', 'error', 'info'][
        Math.floor(Math.random() * 4)
      ] as any,
    });
  };

  const removeTask = (id: number) => {
    const index = tasks.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      tasks.value.splice(index, 1);
    }
  };
</script>

<template>
  <div class="sortable-container">
    <button
      @click="addTask"
      class="add-task-btn"
      >Add Task</button
    >

    <Sortable :data="tasks">
      <TransitionGroup
        name="task-list"
        tag="div"
        class="task-transition-group"
      >
        <SortableItem
          v-for="(task, index) in tasks"
          :key="task.id"
          :source="tasks"
          :index="index"
          :status="task.status"
        >
          <div class="task-item">
            <h3>{{ task.title }}</h3>
            <div class="task-actions">
              <span class="task-status">{{ task.status }}</span>
              <button
                @click.stop="removeTask(task.id)"
                class="remove-btn"
                >×</button
              >
            </div>
          </div>
        </SortableItem>
      </TransitionGroup>
    </Sortable>
  </div>

  <pre>{{ tasks }}</pre>
</template>

<style>
  pre {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;
    height: 100vh;
    overflow: auto;
  }
  .sortable-container {
    max-width: 500px;
    margin: 0 auto;
  }

  .add-task-btn {
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-weight: 500;
  }

  .add-task-btn:hover {
    background-color: #2563eb;
  }

  .task-transition-group {
    position: relative;
  }

  .task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .task-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .task-status {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    background-color: #f3f4f6;
  }

  .remove-btn {
    background-color: #ef4444;
    color: white;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }

  .remove-btn:hover {
    background-color: #dc2626;
  }

  /* TransitionGroup animations */
  .task-list-enter-active,
  .task-list-leave-active {
    transition: all 0.5s ease;
  }

  .task-list-enter-from {
    opacity: 0;
    transform: translateY(-30px);
  }

  .task-list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .task-list-move {
    transition: transform 0.5s ease;
  }
</style>
