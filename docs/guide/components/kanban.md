# Kanban

A flexible drag-and-drop kanban board component for task management and workflow visualization.

<script setup>
import Example from '@examples/Kanban/Example.vue';
</script>

## Overview

The Kanban component provides a powerful board-based task management system with drag-and-drop functionality, perfect for visualizing workflows and managing tasks across different stages.

<Example />

## API Reference

### Kanban

The main container component that manages the kanban board layout and column interactions.

#### Props

| Property | Type       | Default              | Description                              |
| -------- | ---------- | -------------------- | ---------------------------------------- |
| columns  | `T[]`      | Required             | Array of columns to display in the board |
| groups   | `string[]` | `['kanban-columns']` | Groups for column drag-n-drop operations |

#### Slots

| Name    | Props         | Description                           |
| ------- | ------------- | ------------------------------------- |
| default | `{ columns }` | Content of the kanban board (columns) |

### KanbanColumn

Component for displaying individual kanban columns with droppable functionality.

#### Props

| Property    | Type       | Default                  | Description                              |
| ----------- | ---------- | ------------------------ | ---------------------------------------- |
| column      | `T`        | Required                 | Column data                              |
| columns     | `T[]`      | Required                 | Array of all columns                     |
| columnIndex | `number`   | Required                 | Index of the column in the columns array |
| bodySource  | `S[]`      | Required                 | Array of items to display in the column  |
| groups      | `string[]` | `['kanban-columns']`     | Groups for column drag-n-drop operations |
| bodyGroups  | `string[]` | `['kanban-column-body']` | Groups for item drag-n-drop operations   |

#### Slots

| Name    | Props            | Description                   |
| ------- | ---------------- | ----------------------------- |
| default | `{ bodySource }` | Content of the column (items) |
| header  | -                | Header content of the column  |
| footer  | -                | Footer content of the column  |

### KanbanItem

Component for displaying individual kanban cards with drag functionality.

#### Props

| Property  | Type       | Default                  | Description                            |
| --------- | ---------- | ------------------------ | -------------------------------------- |
| item      | `T`        | Required                 | Item data                              |
| items     | `T[]`      | Required                 | Array of all items in the column       |
| itemIndex | `number`   | Required                 | Index of the item in the items array   |
| groups    | `string[]` | `['kanban-column-body']` | Groups for item drag-n-drop operations |

#### Slots

| Name    | Props      | Description         |
| ------- | ---------- | ------------------- |
| default | `{ item }` | Content of the item |

## Installation

```bash
pnpm dlx @vue-dnd-kit/components add kanban
```

## Import

```ts
import { Kanban, KanbanColumn, KanbanItem } from '{your component path}/Kanban';
```

## Usage

### Basic Example

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import {
    Kanban,
    KanbanColumn,
    KanbanItem,
  } from '{your component path}/Kanban';

  interface ITask {
    id: number;
    title: string;
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
        { id: 1, title: 'Research competitors' },
        { id: 2, title: 'Define project scope' },
      ],
    },
    {
      id: 2,
      title: 'In Progress',
      tasks: [
        { id: 3, title: 'Create wireframes' },
        { id: 4, title: 'Design UI components' },
      ],
    },
    {
      id: 3,
      title: 'Done',
      tasks: [
        { id: 5, title: 'Project kickoff meeting' },
        { id: 6, title: 'Gather requirements' },
      ],
    },
  ]);
</script>

<template>
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
    >
      <template #header>
        {{ column.title }}
      </template>

      <KanbanItem
        v-for="(task, taskIndex) in column.tasks"
        :key="task.id"
        :item="task"
        :items="column.tasks"
        :item-index="taskIndex"
      >
        {{ task.title }}
      </KanbanItem>
    </KanbanColumn>
  </Kanban>
</template>
```

## Features

- **Drag and drop columns**: Columns can be reordered by dragging
- **Drag and drop items**: Items can be moved between different columns
- **Customizable drag-n-drop groups**: Flexible grouping for different drag operations
- **Flexible slot system**: Customize header, item, and footer content
- **Modern styling**: Smooth animations and hover effects
- **Responsive design**: Works well on different screen sizes

## Events

Kanban components handle various drag-and-drop events:

- `onStart`: When dragging an item or column starts
- `onMove`: When an item or column is being moved
- `onHover`: When hovering over a drop zone
- `onLeave`: When leaving a drop zone
- `onEnd`: When dragging ends

## Performance

The component is optimized for large kanban boards:

- Efficient re-rendering during drag operations
- Minimal DOM updates
- Smooth animations using CSS transforms

## Important Notes

1. Each column and item must have a unique `id`
2. Use appropriate groups for different drag operations
3. Implement proper data persistence for column and item changes
4. Consider using `TransitionGroup` for smooth item animations
5. Handle empty columns appropriately in your UI

## Related Components

### KanbanColumn

Component for displaying columns with drag functionality and item containers.

### KanbanItem

Component for displaying draggable items within columns.

### DragHandle

Component providing a handle for dragging columns.

---

This component is part of the @vue-dnd-kit/components library, which provides a CLI that generates components directly into your project directory, similar to shadcn.
