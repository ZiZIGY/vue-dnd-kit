# Dashboard

A flexible and draggable grid system for creating dynamic dashboard layouts.

<script setup>
import Example from '@examples/Dashboard/Example.vue';
</script>

## Overview

The Dashboard component provides a powerful grid-based layout system with drag-and-drop functionality, perfect for building customizable dashboards with draggable widgets and cards.

<Example />

## Implementation

### Basic Usage

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { Dashboard, DashboardItem } from '{your component path}/Dashboard';

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
```

### Styling

```css
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
```

## Features

- **Draggable grid items**: All dashboard items can be dragged and reordered
- **Responsive grid layout**: Uses CSS Grid for flexible layouts
- **Smooth animations**: Animations for add, remove, and move operations powered by `TransitionGroup`
- **Fully customizable**: Item components can be customized via slots
- **Modern styling**: Flexible class system with hover effects

## Installation

```bash
pnpm dlx @vue-dnd-kit/components add Dashboard
```

## Import

```ts
import { Dashboard, DashboardItem } from '{your component path}/Dashboard';
```

## Features Demonstrated

### Grid Layout

The dashboard uses CSS Grid with predefined areas:

- **Item 1**: Spans full width (analytics chart)
- **Item 2**: Left column (task list)
- **Item 3**: Right column (statistics)
- **Item 4**: Full width bottom (notifications)

### Drag and Drop

- Drag any widget to reorder it within the grid
- Smooth transitions during dragging
- Visual feedback with opacity and rotation effects
- Automatic grid repositioning

### Widget Types

- **ChartCard**: Analytics visualization with bar chart
- **StatCard**: Key metrics with icon and percentage change
- **TaskList**: Task management with priority indicators
- **NotificationCard**: System notifications with status badges

## Try It Out

1. **Drag widgets**: Click and drag any dashboard widget to reorder them
2. **Observe animations**: Watch smooth transitions as items move
3. **Explore widgets**: Each widget has different content and styling
4. **Responsive behavior**: The grid adapts to different screen sizes

## Use Cases

- **Analytics dashboards**: Display charts, metrics, and KPIs
- **Admin panels**: Customizable widget layouts
- **Project management**: Task lists, progress tracking
- **Monitoring systems**: Real-time data visualization
