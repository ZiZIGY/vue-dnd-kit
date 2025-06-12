# Kanban Component

The `Kanban` component provides a flexible and interactive drag-and-drop kanban board, perfect for creating task management interfaces, workflow visualizations, and more.

## Features

- Drag and drop columns for reordering
- Drag and drop items between columns
- Customizable drag-n-drop groups
- Flexible slot system for header, item, and footer customization
- Modern styling with smooth animations

## Import

```ts
import { Kanban, KanbanColumn, KanbanItem } from '{your component path}/Kanban';
```

## Props

### Kanban

| Name    | Type       | Default              | Description                              |
| ------- | ---------- | -------------------- | ---------------------------------------- |
| columns | `T[]`      | Required             | Array of columns to display in the board |
| groups  | `string[]` | `['kanban-columns']` | Groups for column drag-n-drop operations |

### KanbanColumn

| Name        | Type       | Default                  | Description                              |
| ----------- | ---------- | ------------------------ | ---------------------------------------- |
| column      | `T`        | Required                 | Column data                              |
| columns     | `T[]`      | Required                 | Array of all columns                     |
| columnIndex | `number`   | Required                 | Index of the column in the columns array |
| bodySource  | `S[]`      | Required                 | Array of items to display in the column  |
| groups      | `string[]` | `['kanban-columns']`     | Groups for column drag-n-drop operations |
| bodyGroups  | `string[]` | `['kanban-column-body']` | Groups for item drag-n-drop operations   |

### KanbanItem

| Name      | Type       | Default                  | Description                            |
| --------- | ---------- | ------------------------ | -------------------------------------- |
| item      | `T`        | Required                 | Item data                              |
| items     | `T[]`      | Required                 | Array of all items in the column       |
| itemIndex | `number`   | Required                 | Index of the item in the items array   |
| groups    | `string[]` | `['kanban-column-body']` | Groups for item drag-n-drop operations |

## Slots

### Kanban

| Name    | Props         | Description                           |
| ------- | ------------- | ------------------------------------- |
| default | `{ columns }` | Content of the kanban board (columns) |

### KanbanColumn

| Name    | Props            | Description                   |
| ------- | ---------------- | ----------------------------- |
| default | `{ bodySource }` | Content of the column (items) |
| header  | -                | Header content of the column  |
| footer  | -                | Footer content of the column  |

### KanbanItem

| Name    | Props      | Description         |
| ------- | ---------- | ------------------- |
| default | `{ item }` | Content of the item |

## Usage Example

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

## Related Components

### KanbanColumn

Component for displaying columns with drag functionality and item containers.

### KanbanItem

Component for displaying draggable items within columns.

### DragHandle

Component providing a handle for dragging columns.

---

This component is part of the @vue-dnd-kit/components library, which provides a CLI that generates components directly into your project directory, similar to shadcn.
