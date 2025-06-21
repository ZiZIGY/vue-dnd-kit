# Tree

A hierarchical tree component with drag-and-drop functionality for file systems and nested data structures.

<script setup>
import Example from '@examples/Tree/ExampleTree.vue';
</script>

## Overview

The Tree component provides a powerful hierarchical data structure with drag-and-drop functionality, perfect for file explorers, nested menus, and complex data organization.

<Example />

## API Reference

### Tree

The main container component that manages the tree structure and provides droppable functionality for tree nodes.

#### Props

| Name       | Type                   | Default    | Description                               |
| ---------- | ---------------------- | ---------- | ----------------------------------------- |
| data       | `T[]`                  | Required   | Array of tree data items                  |
| itemKey    | `TValidItemKeys<T>`    | Required   | Key to use as unique identifier for items |
| nestingKey | `TValidNestingKeys<T>` | Required   | Key that contains child items array       |
| groups     | `string[]`             | `['tree']` | Groups for drag-n-drop operations         |

#### Slots

| Name    | Props      | Description                |
| ------- | ---------- | -------------------------- |
| default | `{ item }` | Content for each tree item |

### TreeItem

Component for displaying individual tree nodes with drag functionality and expand/collapse behavior.

#### Props

| Name       | Type                   | Default  | Description                           |
| ---------- | ---------------------- | -------- | ------------------------------------- |
| data       | `T`                    | Required | Tree item data                        |
| itemKey    | `TValidItemKeys<T>`    | Required | Key to use as unique identifier       |
| nestingKey | `TValidNestingKeys<T>` | Required | Key that contains child items array   |
| source     | `T[]`                  | Required | Array of all items at current level   |
| index      | `number`               | Required | Index of the item in the source array |
| groups     | `string[]`             | Required | Groups for drag-n-drop operations     |

#### Slots

| Name    | Props      | Description               |
| ------- | ---------- | ------------------------- |
| default | `{ item }` | Content for the tree item |

### TreeControls

Component for managing tree operations like expand all, collapse all, etc.

#### Props

| Name         | Type                            | Default  | Description                       |
| ------------ | ------------------------------- | -------- | --------------------------------- |
| expanded     | `boolean`                       | `false`  | Whether the tree node is expanded |
| hasChildren  | `boolean`                       | `false`  | Whether the item has children     |
| onArrowClick | `() => void`                    | Required | Callback for arrow click events   |
| onDragStart  | `(event: PointerEvent) => void` | Required | Callback for drag start events    |

#### Slots

No slots available in this component. TreeControls renders arrow and drag handle controls.

### TreeArrow

Component for displaying expand/collapse arrows with custom styling.

#### Props

| Name     | Type      | Default | Description                         |
| -------- | --------- | ------- | ----------------------------------- |
| expanded | `boolean` | `false` | Whether the arrow should be rotated |

#### Slots

No slots available in this component. TreeArrow renders an arrow icon.

### TreeDragHandle

Component for providing a dedicated drag handle for tree items.

#### Props

No props available. This component provides a drag handle with predefined styling.

#### Slots

No slots available in this component. TreeDragHandle renders a drag handle icon.

## Types

```typescript
export type TValidItemKeys<T> = {
  [K in keyof T]-?: T[K] extends string | number ? K : never;
}[keyof T];

export type TValidNestingKeys<T> = {
  [K in keyof T]: T[K] extends T[] | undefined ? K : never;
}[keyof T];
```

## Installation

```bash
pnpm dlx @vue-dnd-kit/components add tree
```

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

## Usage

### Basic Example

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

## Features

- **Hierarchical structure**: Support for nested tree nodes with unlimited depth
- **Drag and drop**: Move nodes within the tree structure
- **Expandable/collapsible**: Built-in expand/collapse functionality for tree nodes
- **Visual indicators**: Indicators for items with and without children
- **Customizable controls**: Customizable drag handles and arrow controls
- **Modern styling**: Hover effects and smooth animations
- **Empty zone highlighting**: Visual feedback for drop targets

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

## Events

Tree components handle various drag-and-drop events:

- `onStart`: When dragging a node starts
- `onMove`: When a node is being moved
- `onHover`: When hovering over a drop zone
- `onLeave`: When leaving a drop zone
- `onEnd`: When dragging ends
- `onExpand`: When a node is expanded
- `onCollapse`: When a node is collapsed

## Performance

The component is optimized for large trees:

- Efficient re-rendering during drag operations
- Minimal DOM updates
- Virtual scrolling support for large datasets
- Smooth animations using CSS transforms

## Important Notes

1. Each node must have a unique identifier specified by `itemKey`
2. Use appropriate `nestingKey` for child items
3. Implement proper data persistence for tree structure changes
4. Consider using `TransitionGroup` for smooth node animations
5. Handle empty trees appropriately in your UI
6. Use appropriate indentation for nested levels
7. Implement proper validation for drag operations (e.g., preventing dropping a parent into its child)

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
