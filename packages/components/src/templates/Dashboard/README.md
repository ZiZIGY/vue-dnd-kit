# Dashboard Component

The `Dashboard` component provides a flexible and draggable grid system, perfect for creating dynamic and interactive dashboard layouts.

## Features

- Draggable grid items
- Responsive grid layout powered by CSS Grid
- Smooth animations on item add, remove, and move, powered by `TransitionGroup`
- Fully customizable item components via slots

## Import

```ts
import { Dashboard, DashboardItem } from '{your component path}/Dashboard';
```

## Interfaces

```typescript
export interface IDashboardItem {
  id: number;
  component: Component; // Vue component to render
}
```

## Props

### Dashboard

| Name | Type  | Default  | Description                            |
| ---- | ----- | -------- | -------------------------------------- |
| data | `T[]` | Required | Array of data for the dashboard items. |

### DashboardItem

| Name   | Type     | Default  | Description                                  |
| ------ | -------- | -------- | -------------------------------------------- |
| index  | `number` | Required | The index of the item in the `source` array. |
| source | `T[]`    | Required | The source array the item belongs to.        |

## Slots

### Dashboard

| Name    | Props | Description                                                          |
| ------- | ----- | -------------------------------------------------------------------- |
| default | -     | The main content, typically a `TransitionGroup` of `DashboardItem`s. |

### DashboardItem

| Name    | Props | Description                        |
| ------- | ----- | ---------------------------------- |
| default | -     | The content of the dashboard item. |

## Usage Example

```vue
<script setup lang="ts">
  import { type Component, ref } from 'vue';
  import { Dashboard, DashboardItem } from '{your component path}/Dashboard';

  // Example components are provided in the 'Example' folder.
  // Adjust the path based on your project structure.
  import ChartCard from '{your component path}/Dashboard/Example/ChartCard.vue';
  import StatCard from '{your component path}/Dashboard/Example/StatCard.vue';
  import TaskList from '{your component path}/Dashboard/Example/TaskList.vue';
  import NotificationCard from '{your component path}/Dashboard/Example/NotificationCard.vue';

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
```

## Styling

The Dashboard component uses a flexible class system. Import the default styles or create your own.

- `.dashboard`: The main container for the droppable area.
- `.dashboard-grid-container`: The element that acts as the grid container (if you use one).
- `.dashboard-item`: Base class for all dashboard items.
- `.item-1`, `.item-2`, etc.: Specific classes for custom styling based on ID or index.

For animations, `TransitionGroup` classes are used:

- `.dashboard-move`: Applied to items when they are re-ordered.
- `.dashboard-enter-active`, `.dashboard-leave-active`: Applied during enter/leave transitions.
- `.dashboard-enter-from`, `.dashboard-leave-to`: Define the starting/ending state for enter/leave transitions.

## Related Components

### DashboardItem

Component for displaying individual dashboard items with drag functionality. It must be used within a `Dashboard` component to work correctly.

---

This component is part of the @vue-dnd-kit/components library, which provides a CLI that generates components directly into your project directory, similar to shadcn.
