# Tree Component

The `Tree` component provides a hierarchical tree structure with drag and drop functionality, perfect for creating interactive file explorers, organizational charts, or nested data displays.

## Features

- Hierarchical tree structure with unlimited nesting levels
- Drag and drop functionality for reordering and moving items
- Expandable/collapsible tree nodes
- Visual indicators for items with and without children
- Customizable drag handles and arrow controls
- Modern styling with hover effects and smooth animations
- Empty zone highlighting for drop targets

## Import

```ts
import {
  Tree,
  TreeItem,
  TreeControls,
  TreeArrow,
  TreeDragHandle,
} from '{your component path}/Tree';
```

## Types

```typescript
export type TValidItemKeys<T> = {
  [K in keyof T]-?: T[K] extends string | number ? K : never;
}[keyof T];

export type TValidNestingKeys<T> = {
  [K in keyof T]: T[K] extends T[] | undefined ? K : never;
}[keyof T];
```

## Props

### Tree

| Name       | Type                   | Default    | Description                               |
| ---------- | ---------------------- | ---------- | ----------------------------------------- |
| data       | `T[]`                  | Required   | Array of tree data items                  |
| itemKey    | `TValidItemKeys<T>`    | Required   | Key to use as unique identifier for items |
| nestingKey | `TValidNestingKeys<T>` | Required   | Key that contains child items array       |
| groups     | `string[]`             | `['tree']` | Groups for drag-n-drop operations         |

### TreeItem

| Name       | Type                   | Default  | Description                           |
| ---------- | ---------------------- | -------- | ------------------------------------- |
| data       | `T`                    | Required | Tree item data                        |
| itemKey    | `TValidItemKeys<T>`    | Required | Key to use as unique identifier       |
| nestingKey | `TValidNestingKeys<T>` | Required | Key that contains child items array   |
| source     | `T[]`                  | Required | Array of all items at current level   |
| index      | `number`               | Required | Index of the item in the source array |
| groups     | `string[]`             | Required | Groups for drag-n-drop operations     |

### TreeControls

| Name         | Type                            | Default  | Description                       |
| ------------ | ------------------------------- | -------- | --------------------------------- |
| expanded     | `boolean`                       | `false`  | Whether the tree node is expanded |
| hasChildren  | `boolean`                       | `false`  | Whether the item has children     |
| onArrowClick | `() => void`                    | Required | Callback for arrow click events   |
| onDragStart  | `(event: PointerEvent) => void` | Required | Callback for drag start events    |

### TreeArrow

| Name     | Type      | Default | Description                         |
| -------- | --------- | ------- | ----------------------------------- |
| expanded | `boolean` | `false` | Whether the arrow should be rotated |

### TreeDragHandle

No props available. This component provides a drag handle with predefined styling.

## Slots

### Tree

| Name    | Props      | Description                |
| ------- | ---------- | -------------------------- |
| default | `{ item }` | Content for each tree item |

### TreeItem

| Name    | Props      | Description               |
| ------- | ---------- | ------------------------- |
| default | `{ item }` | Content for the tree item |

### TreeControls

No slots available in this component. TreeControls renders arrow and drag handle controls.

### TreeArrow

No slots available in this component. TreeArrow renders an arrow icon.

### TreeDragHandle

No slots available in this component. TreeDragHandle renders a drag handle icon.

## Usage Example

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { Tree } from '{your component path}/Tree';

  interface IUser {
    id: number;
    name: string;
    children?: IUser[];
  }

  const users = ref<IUser[]>([
    {
      id: 1,
      name: 'John',
      children: [
        {
          id: 2,
          name: 'Victoria',
          children: [],
        },
        {
          id: 3,
          name: 'Abraham',
          children: [
            {
              id: 4,
              name: 'Eliz',
            },
          ],
        },
      ],
    },
    {
      id: 5,
      name: 'Sarah',
      children: [
        {
          id: 6,
          name: 'Michael',
        },
      ],
    },
  ]);
</script>

<template>
  <Tree
    :data="users"
    item-key="id"
    nesting-key="children"
    v-slot="{ item }"
  >
    <div class="tree-item-content">
      <span class="user-name">{{ item.name }}</span>
      <span class="user-id">#{{ item.id }}</span>
    </div>
  </Tree>
</template>

<style scoped>
  .tree-item-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .user-name {
    font-weight: 500;
  }

  .user-id {
    color: #6b7280;
    font-size: 0.875rem;
  }
</style>
```

## Styling

The Tree component comes with a set of predefined CSS classes:

- `.tree-container` - Main tree container
- `.tree-item` - Individual tree item
- `.tree-item-content` - Content wrapper for tree items
- `.tree-children` - Container for child items
- `.tree-children-empty` - Styling for empty child containers
- `.tree-children-overed` - Applied when hovering over drop zone
- `.tree-container-overed` - Applied when hovering over main container
- `.tree-item-text` - Text content within tree items
- `.tree-controls` - Container for arrow and drag handle
- `.tree-arrow` - Arrow control styling
- `.tree-drag-handle` - Drag handle styling
- `.tree-item-dot` - Dot indicator for items without children

For status styling, you can use:

- `.tree-item.dragging` - Applied when an item is being dragged
- `.tree-item.drag-over` - Applied when dragging over an item

## Related Components

### TreeItem

Component for displaying individual tree nodes with drag functionality.

### TreeControls

Component for displaying tree node controls (arrow and drag handle).

### TreeArrow

Component for displaying expand/collapse arrows.

### TreeDragHandle

Component for displaying drag handles.

---

This component is part of the @vue-dnd-kit/components library, which provides a CLI that generates components directly into your project directory, similar to shadcn.
