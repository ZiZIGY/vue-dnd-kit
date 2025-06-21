# Table

A sortable and draggable table component for data management and display.

<script setup>
import Example from '@examples/Table/Example.vue';
</script>

## Overview

The Table component provides a powerful data table with drag-and-drop reordering capabilities, perfect for managing and displaying structured data with interactive sorting and reordering.

<Example />

## API Reference

### Table

The main container component that manages the table layout and provides droppable functionality for rows.

#### Props

| Name         | Type                | Default            | Description                                |
| ------------ | ------------------- | ------------------ | ------------------------------------------ |
| rows         | `T[]`               | Required           | Array of data to display in the table rows |
| columns      | `ITableColumn<T>[]` | Required           | Array of column configurations             |
| bodyGroups   | `string[]`          | `['table-body']`   | Groups for body drag-n-drop operations     |
| headerGroups | `string[]`          | `['table-header']` | Groups for header drag-n-drop operations   |

#### Slots

| Name         | Props                           | Description                                   |
| ------------ | ------------------------------- | --------------------------------------------- |
| default      | `{ rows, columns, bodyGroups }` | Table body content                            |
| caption      | -                               | Table caption                                 |
| footer       | -                               | Table footer                                  |
| header-[key] | `{ column }`                    | Custom header rendering for a specific column |

### TableRow

Component for displaying individual table rows with drag functionality.

#### Props

| Name       | Type                | Default  | Description                           |
| ---------- | ------------------- | -------- | ------------------------------------- |
| row        | `T`                 | Required | Row data                              |
| rowIndex   | `number`            | Required | Index of the row in the rows array    |
| columns    | `ITableColumn<T>[]` | Required | Array of column configurations        |
| rows       | `T[]`               | Required | Array of all rows                     |
| bodyGroups | `string[]`          | Required | Groups for row drag-n-drop operations |

#### Slots

No slots available in this component. TableRow renders cells based on the columns prop.

### TableColumn

Component for defining table column structure and behavior.

#### Props

| Name         | Type                | Default  | Description                              |
| ------------ | ------------------- | -------- | ---------------------------------------- |
| column       | `ITableColumn<T>`   | Required | Column configuration                     |
| columns      | `ITableColumn<T>[]` | Required | Array of all column configurations       |
| columnIndex  | `number`            | Required | Index of the column in the columns array |
| headerGroups | `string[]`          | Required | Groups for column drag-n-drop operations |

#### Slots

| Name    | Props        | Description                  |
| ------- | ------------ | ---------------------------- |
| default | `{ column }` | Content of the column header |

## Interfaces

```typescript
export interface ITableColumn<T = any> {
  label: string;
  key: keyof T;
}
```

## Installation

```bash
pnpm dlx @vue-dnd-kit/components add table
```

## Import

```ts
import {
  Table,
  TableRow,
  TableColumn,
  type ITableColumn,
} from '{your component path}/Table';
```

## Usage

### Basic Example

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import {
    Table,
    TableRow,
    type ITableColumn,
  } from '{your component path}/Table';

  interface IRow {
    id: number;
    name: string;
    age?: number;
    status?: string;
  }

  const rows = ref<IRow[]>([
    { id: 1, name: 'John Doe', status: 'Success' },
    { id: 2, name: 'Jane Smith', status: 'Success' },
    { id: 3, name: 'Jim Beam', status: 'Processing' },
    { id: 4, name: 'Jill Johnson', status: 'Failed' },
    { id: 5, name: 'Jack Daniels', age: 20, status: 'Success' },
  ]);

  const columns = ref<ITableColumn<IRow>[]>([
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Status', key: 'status' },
    { label: 'Age', key: 'age' },
  ]);
</script>

<template>
  <Table
    :rows="rows"
    :columns="columns"
  >
    <template #caption> Employee Data </template>

    <template #default="props">
      <TableRow
        v-for="(row, index) in rows"
        :key="row.id"
        :row="row"
        :row-index="index"
        v-bind="props"
      />
    </template>

    <template #footer>
      <tr>
        <td colspan="4">Total employees: {{ rows.length }}</td>
      </tr>
    </template>
  </Table>
</template>
```

## Features

- **Sortable rows**: Rows can be reordered with drag and drop functionality
- **Sortable columns**: Columns can be reordered with drag and drop functionality
- **Customizable drag-n-drop groups**: Flexible grouping for different drag operations
- **Flexible slot system**: Customize header, cell, caption and footer content
- **Modern styling**: Status indicators and interactive elements
- **Responsive design**: Works well on different screen sizes

## Styling

The Table component comes with a set of predefined CSS classes:

- `.vue-dnd-table` - Main table container
- `.vue-dnd-table-column` - Table header column
- `.vue-dnd-table-row` - Table row
- `.vue-dnd-table-cell` - Table cell
- `.vue-dnd-table-dragging` - Applied when an element is being dragged
- `.vue-dnd-table-row-drop-indicator` - Indicates where a row will be dropped
- `.vue-dnd-table-column-drop-indicator` - Indicates where a column will be dropped

For status styling, you can use:

- `.vue-dnd-table-row-success` - Success status styling
- `.vue-dnd-table-row-processing` - Processing status styling
- `.vue-dnd-table-row-failed` - Failed status styling

## Events

Table components handle various drag-and-drop events:

- `onStart`: When dragging a row or column starts
- `onMove`: When a row or column is being moved
- `onHover`: When hovering over a drop zone
- `onLeave`: When leaving a drop zone
- `onEnd`: When dragging ends

## Performance

The component is optimized for large tables:

- Efficient re-rendering during drag operations
- Minimal DOM updates
- Virtual scrolling support for large datasets
- Smooth animations using CSS transforms

## Important Notes

1. Each row must have a unique `id`
2. Use appropriate groups for different drag operations
3. Implement proper data persistence for row and column order changes
4. Consider using `TransitionGroup` for smooth row animations
5. Handle empty tables appropriately in your UI
6. Use appropriate column configurations for better layout control

## Related Components

### TableColumn

Component for displaying column headers with drag functionality.

### TableRow

Component for displaying table rows with drag functionality.

---

This component is part of the @vue-dnd-kit/components library, which provides a CLI that generates components directly into your project directory, similar to shadcn.
