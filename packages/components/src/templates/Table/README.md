# Table Component

The `Table` component provides a draggable table with sortable rows and columns, perfect for creating interactive data displays.

## Features

- Sortable rows with drag and drop functionality
- Sortable columns with drag and drop functionality
- Customizable drag-n-drop groups
- Flexible slot system for header, cell, caption and footer customization
- Modern styling with status indicators and interactive elements

## Import

```ts
import {
  Table,
  TableRow,
  TableColumn,
  type ITableColumn,
} from '{your component path}/Table';
```

## Interfaces

```typescript
export interface ITableColumn<T = any> {
  label: string;
  key: keyof T;
}
```

## Props

### Table

| Name         | Type                | Default            | Description                                |
| ------------ | ------------------- | ------------------ | ------------------------------------------ |
| rows         | `T[]`               | Required           | Array of data to display in the table rows |
| columns      | `ITableColumn<T>[]` | Required           | Array of column configurations             |
| bodyGroups   | `string[]`          | `['table-body']`   | Groups for body drag-n-drop operations     |
| headerGroups | `string[]`          | `['table-header']` | Groups for header drag-n-drop operations   |

### TableRow

| Name       | Type                | Default  | Description                           |
| ---------- | ------------------- | -------- | ------------------------------------- |
| row        | `T`                 | Required | Row data                              |
| rowIndex   | `number`            | Required | Index of the row in the rows array    |
| columns    | `ITableColumn<T>[]` | Required | Array of column configurations        |
| rows       | `T[]`               | Required | Array of all rows                     |
| bodyGroups | `string[]`          | Required | Groups for row drag-n-drop operations |

### TableColumn

| Name         | Type                | Default  | Description                              |
| ------------ | ------------------- | -------- | ---------------------------------------- |
| column       | `ITableColumn<T>`   | Required | Column configuration                     |
| columns      | `ITableColumn<T>[]` | Required | Array of all column configurations       |
| columnIndex  | `number`            | Required | Index of the column in the columns array |
| headerGroups | `string[]`          | Required | Groups for column drag-n-drop operations |

## Slots

### Table

| Name         | Props                           | Description                                   |
| ------------ | ------------------------------- | --------------------------------------------- |
| default      | `{ rows, columns, bodyGroups }` | Table body content                            |
| caption      | -                               | Table caption                                 |
| footer       | -                               | Table footer                                  |
| header-[key] | `{ column }`                    | Custom header rendering for a specific column |

### TableRow

No slots available in this component. TableRow renders cells based on the columns prop.

### TableColumn

| Name    | Props        | Description                  |
| ------- | ------------ | ---------------------------- |
| default | `{ column }` | Content of the column header |

## Usage Example

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

## Related Components

### TableColumn

Component for displaying column headers with drag functionality.

### TableRow

Component for displaying table rows with drag functionality.

---

This component is part of the @vue-dnd-kit/components library, which provides a CLI that generates components directly into your project directory, similar to shadcn.
