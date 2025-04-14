# Vue Drag & Drop Library - Components Package

[![Beta](https://img.shields.io/badge/status-beta-yellow.svg)](https://github.com/zizigy/vue-dnd-kit)

> ⚠️ **Warning**: This project is in active development (beta). The API may change between minor versions. Not recommended for production use until version 1.0.0.

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-hooks/">
    <img src="https://raw.githubusercontent.com/ZiZiGY/vue-dnd-hooks/master/public/logo.svg" width="400" alt="Vue Drag & Drop Logo">
  </a>
</p>

<p align="center">
  Ready-to-use components for the Vue Drag & Drop library with Kanban, Table, and more.
</p>

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-hooks/" target="_blank">
    <img src="https://img.shields.io/badge/Documentation-Visit-blue?style=flat-square" alt="Documentation">
  </a>
</p>

<p align="center">
  Inspired by the popular <a href="https://dndkit.com/" target="_blank">React DnD Kit</a> library, adapted for Vue.js
</p>

## Project Status

This project is in active development. We're working toward a stable API, but until version 1.0.0, there may be breaking changes.

Roadmap:

- [x] Basic drag & drop components
- [x] Table component
- [x] Kanban board
- [ ] Tree
- [ ] SortableList
- [ ] FormBuilder
- [ ] Dashboard
- [ ] Tabs
- [ ] FileExplorer
- [ ] Grid
- [ ] Tests
- [ ] Stable API (version 1.0.0)

## Features

### Component Presets

- 📋 **Table Component**

  - Customizable structure
  - Flexible column handling
  - Minimal styling for easy customization
  - Full control over drag & drop behavior

- 📊 **Kanban Board**

  - Simple column and item structure
  - Unopinionated styling
  - Flexible data handling
  - Customizable drag & drop logic

- 🧩 **Base Components**

  - Draggable
  - Droppable
  - DragHandle

### Design Philosophy

- 🎨 **Minimal Styling**

  - Components come with minimal styling
  - Full freedom to implement your own design
  - No CSS dependencies
  - Easy to integrate with any UI framework

- 🔧 **Maximum Flexibility**

  - Components don't enforce specific data structures
  - Custom event handling
  - Write your own drag & drop logic
  - Extend components as needed

### Integration

- 🔌 **Framework Integration**
  - Vue 3 Composition API
  - TypeScript support
  - Works with Nuxt.js
  - Compatible with any styling approach

## Installation

Choose your preferred package manager:

```bash
npm install @vue-dnd-kit/components @vue-dnd-kit/core
```

```bash
yarn add @vue-dnd-kit/components @vue-dnd-kit/core
```

```bash
pnpm install @vue-dnd-kit/components @vue-dnd-kit/core
```

## Basic Usage

### Table Component

```vue
<script setup>
  import { ref } from 'vue';
  import { Table, TableHead, TableBody } from '@vue-dnd-kit/components';
  import { DnDOperations } from '@vue-dnd-kit/core';

  const columns = ref([
    { key: 'code', name: 'Code' },
    { key: 'name', name: 'Name' },
    { key: 'category', name: 'Category' },
    { key: 'price', name: 'Price' },
  ]);

  const tableData = ref([
    { code: '1001', name: 'Product 1', category: 'Category A', price: 99 },
    { code: '1002', name: 'Product 2', category: 'Category B', price: 149 },
    { code: '1003', name: 'Product 3', category: 'Category A', price: 249 },
  ]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
</script>

<template>
  <Table>
    <TableHead
      :columns="columns"
      @update:columns="columns = $event"
      @drop="DnDOperations.applyTransfer"
    />

    <TableBody
      :columns="columns"
      :data="tableData"
      @drop="DnDOperations.applyTransfer"
    >
      <template #cell="{ row, column, value }">
        <div v-if="column.key === 'price'">
          {{ formatCurrency(value) }}
        </div>
        <div v-else>
          {{ value }}
        </div>
      </template>
    </TableBody>
  </Table>
</template>
```

### Kanban Board

```vue
<script setup>
  import { Kanban, KanbanColumn, KanbanItem } from '@vue-dnd-kit/components';
  import { DnDOperations } from '@vue-dnd-kit/core';
  import { ref } from 'vue';

  const data = ref([
    {
      title: 'To Do',
      items: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'],
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

<style>
  .kanban-container {
    display: flex;
    width: 100%;
    padding: 20px;
  }

  .column-header {
    font-weight: bold;
    margin-bottom: 12px;
  }
</style>
```

### Custom Implementation

You can easily implement your own drag & drop logic:

```vue
<script setup>
  import { Draggable } from '@vue-dnd-kit/components';
  import { ref, computed } from 'vue';

  const items = ref(['Item 1', 'Item 2', 'Item 3']);

  const handleDrop = (store) => {
    const { source, sourceIndex, targetIndex } = store;

    // Implement your own reordering logic
    if (source && sourceIndex !== undefined && targetIndex !== undefined) {
      const newItems = [...items.value];
      const [removed] = newItems.splice(sourceIndex, 1);
      newItems.splice(targetIndex, 0, removed);
      items.value = newItems;
    }
  };
</script>

<template>
  <div class="custom-list">
    <Draggable
      v-for="(item, index) in items"
      :key="item"
      :data="computed(() => ({ index, source: items }))"
      @end="handleDrop"
      class="custom-item"
    >
      {{ item }}
    </Draggable>
  </div>
</template>
```

## 📄 License

[MIT](LICENSE) © [ZiZiGY](https://github.com/ZiZiGY)

---

<p align="center">Made with ❤️ for the Vue.js community</p>
