<script setup lang="ts">
  import { type Component, ref } from 'vue';
  import {
    Dashboard,
    DashboardItem,
  } from '@vue-dnd-kit/components/templates/Dashboard';

  // Example components are provided in the 'Example' folder.
  // Adjust the path based on your project structure.
  import ChartCard from '@vue-dnd-kit/components/templates/Dashboard/Example/ChartCard.vue';
  import StatCard from '@vue-dnd-kit/components/templates/Dashboard/Example/StatCard.vue';
  import TaskList from '@vue-dnd-kit/components/templates/Dashboard/Example/TaskList.vue';
  import NotificationCard from '@vue-dnd-kit/components/templates/Dashboard/Example/NotificationCard.vue';

  interface IDashboardItem {
    id: number;
    component: Component;
  }

  const dashboard = ref<IDashboardItem[]>([
    { id: 1, component: ChartCard },
    { id: 2, component: TaskList },
    { id: 3, component: StatCard },
    { id: 4, component: NotificationCard },
  ]);
</script>

<template>
  <Dashboard
    :data="dashboard"
    class="dashboard"
  >
    <TransitionGroup
      name="dashboard"
      appear
    >
      <DashboardItem
        v-for="(item, index) in dashboard"
        :key="item.id"
        :index="index"
        :source="dashboard"
        :class="['dashboard-item', `item-${index + 1}`]"
      >
        <component :is="item.component" />
      </DashboardItem>
    </TransitionGroup>
  </Dashboard>
</template>

<style>
  .dashboard {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    gap: 20px;
    padding: 20px;
    min-height: 100vh;
  }

  .dashboard-item {
    border-radius: 12px;
    overflow: hidden;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    height: 100%;
  }

  .item-1 {
    grid-column: 1 / 3;
    grid-row: 1 / 2;
  }

  .item-2 {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }

  .item-3 {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }

  .item-4 {
    grid-column: 1 / 3;
    grid-row: 3 / 4;
  }

  @keyframes slideIn {
    from {
      opacity: 0.8;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .dashboard-item:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
  }

  .dashboard-move {
    transition: all 0.3s ease;
  }

  .dashboard-enter-active,
  .dashboard-leave-active {
    transition: all 0.3s ease;
  }

  .dashboard-enter-from,
  .dashboard-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
</style>

<style scoped>
  pre {
    background: #f5f5f5;
    padding: 16px;
    border-radius: 8px;
    font-size: 14px;
    overflow-x: auto;
  }
</style>
