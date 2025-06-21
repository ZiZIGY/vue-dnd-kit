<script setup lang="ts">
  import {
    Dashboard,
    DashboardItem,
  } from '@vue-dnd-kit/components/src/templates/Dashboard';

  import ChartCard from '@vue-dnd-kit/components/src/templates/Dashboard/Example/ChartCard.vue';
  import TaskList from '@vue-dnd-kit/components/src/templates/Dashboard/Example/TaskList.vue';
  import StatCard from '@vue-dnd-kit/components/src/templates/Dashboard/Example/StatCard.vue';
  import NotificationCard from '@vue-dnd-kit/components/src/templates/Dashboard/Example/NotificationCard.vue';
  import ExampleContainer from '../../ExampleContainer.vue';
  import { ref, type Component } from 'vue';

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
  <ExampleContainer>
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
  </ExampleContainer>
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
    touch-action: none;
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
