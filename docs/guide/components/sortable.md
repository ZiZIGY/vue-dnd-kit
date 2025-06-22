# Sortable

A flexible and intuitive drag-and-drop sortable list component for creating reorderable lists.

<script setup>
import Example from '@examples/AnimatedSortable/Example.vue';
</script>

## Overview

The Sortable component provides a simple yet powerful interface for creating drag-and-drop sortable lists, perfect for to-do lists, priority queues, and other interactive UI elements that require reordering.

<Example />

## API Reference

### Sortable

The main container component that manages the sortable list layout and provides droppable functionality.

#### Props

| Name        | Type       | Default             | Description                            |
| ----------- | ---------- | ------------------- | -------------------------------------- |
| data        | `T[]`      | Required            | Array of data to display in the list   |
| groups      | `string[]` | `['sortable']`      | Groups for drag-n-drop operations      |
| placeholder | `string`   | `'Drop items here'` | Text to display when the list is empty |

#### Slots

| Name    | Props | Description                |
| ------- | ----- | -------------------------- |
| default | -     | Content for the list items |

### SortableItem

Component for displaying individual sortable items with drag functionality.

#### Props

| Name   | Type       | Default        | Description                           |
| ------ | ---------- | -------------- | ------------------------------------- |
| source | `T[]`      | Required       | Source array containing the item      |
| index  | `number`   | Required       | Index of the item in the source array |
| groups | `string[]` | `['sortable']` | Groups for drag-n-drop operations     |

#### Slots

| Name    | Props | Description               |
| ------- | ----- | ------------------------- |
| default | -     | Content for the list item |

## Installation

```bash
pnpm dlx @vue-dnd-kit/components add sortable
```

## Import

```ts
import { Sortable, SortableItem } from '{your component path}/Sortable';
```

## Usage

### Basic Example

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { Sortable, SortableItem } from '{your component path}/Sortable';

  interface Task {
    id: number;
    title: string;
  }

  const tasks = ref<Task[]>([
    { id: 1, title: 'Complete project' },
    { id: 2, title: 'Client meeting' },
    { id: 3, title: 'Update documentation' },
    { id: 4, title: 'Fix bugs' },
  ]);
</script>

<template>
  <div class="sortable-container">
    <h2>Task List</h2>

    <Sortable :data="tasks">
      <SortableItem
        v-for="(task, index) in tasks"
        :key="task.id"
        :source="tasks"
        :index="index"
      >
        <div class="task-item">
          <h3>{{ task.title }}</h3>
        </div>
      </SortableItem>
    </Sortable>
  </div>
</template>
```

### With TransitionGroup for Animations

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { Sortable, SortableItem } from '{your component path}/Sortable';

  interface Task {
    id: number;
    title: string;
  }

  const tasks = ref<Task[]>([
    { id: 1, title: 'Complete project' },
    { id: 2, title: 'Client meeting' },
    { id: 3, title: 'Update documentation' },
    { id: 4, title: 'Fix bugs' },
  ]);

  const addTask = () => {
    const newId = Math.max(0, ...tasks.value.map((t) => t.id)) + 1;
    tasks.value.push({
      id: newId,
      title: `New task ${newId}`,
    });
  };
</script>

<template>
  <div class="sortable-container">
    <h2>Animated Task List</h2>
    <button
      @click="addTask"
      class="add-task-btn"
      >Add Task</button
    >

    <Sortable :data="tasks">
      <TransitionGroup
        name="task-list"
        tag="div"
        class="task-transition-group"
      >
        <SortableItem
          v-for="(task, index) in tasks"
          :key="task.id"
          :source="tasks"
          :index="index"
        >
          <div class="task-item">
            <h3>{{ task.title }}</h3>
          </div>
        </SortableItem>
      </TransitionGroup>
    </Sortable>
  </div>
</template>

<style>
  /* TransitionGroup animations */
  .task-list-enter-active,
  .task-list-leave-active {
    transition: all 0.5s ease;
  }

  .task-list-enter-from {
    opacity: 0;
    transform: translateY(-30px);
  }

  .task-list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .task-list-move {
    transition: transform 0.5s ease;
  }
</style>
```

## Features

- **Simple drag-and-drop sorting functionality**
- **Customizable drag-n-drop groups**
- **Smooth animations and transitions**
- **Empty state placeholder**
- **Modern styling with hover effects**
- **Responsive design**

## Styling

The Sortable component comes with a set of predefined CSS classes:

- `.vue-dnd-sortable` - Main sortable container
- `.vue-dnd-sortable-empty` - Empty state placeholder
- `.vue-dnd-sortable-item` - Sortable list item
- `.vue-dnd-sortable-item-dragging` - Applied when an item is being dragged
- `.vue-dnd-sortable-item-ghost` - Applied to the ghost element during dragging
- `.vue-dnd-sortable-item-dropped` - Applied briefly when an item is dropped
- `.vue-dnd-sortable-drop-indicator` - Indicates where an item will be dropped

## Multiple Lists

You can create multiple sortable lists that interact with each other:

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { Sortable, SortableItem } from '{your component path}/Sortable';

  const todoTasks = ref([
    { id: 1, title: 'Task 1' },
    { id: 2, title: 'Task 2' },
  ]);

  const completedTasks = ref([{ id: 3, title: 'Task 3' }]);
</script>

<template>
  <div class="lists-container">
    <div class="list">
      <h2>To Do</h2>
      <Sortable
        :data="todoTasks"
        :groups="['tasks']"
      >
        <SortableItem
          v-for="(task, index) in todoTasks"
          :key="task.id"
          :source="todoTasks"
          :index="index"
          :groups="['tasks']"
        >
          {{ task.title }}
        </SortableItem>
      </Sortable>
    </div>

    <div class="list">
      <h2>Completed</h2>
      <Sortable
        :data="completedTasks"
        :groups="['tasks']"
      >
        <SortableItem
          v-for="(task, index) in completedTasks"
          :key="task.id"
          :source="completedTasks"
          :index="index"
          :groups="['tasks']"
        >
          {{ task.title }}
        </SortableItem>
      </Sortable>
    </div>
  </div>
</template>
```

## Events

Sortable components handle various drag-and-drop events:

- `onStart`: When dragging an item starts
- `onMove`: When an item is being moved
- `onHover`: When hovering over a drop zone
- `onLeave`: When leaving a drop zone
- `onEnd`: When dragging ends
- `onDrop`: When an item is dropped (handled by DnDOperations.applyTransfer by default)

## Performance

The component is optimized for large lists:

- Efficient re-rendering during drag operations
- Minimal DOM updates
- Smooth animations using CSS transforms

## Important Notes

1. Each item should have a unique `id` for proper tracking
2. Use appropriate groups for different drag operations
3. Implement proper data persistence for order changes
4. Consider using `TransitionGroup` for smooth animations
5. Handle empty lists appropriately in your UI

## Related Components

### SortableItem

Component for displaying individual sortable items with drag functionality.

---

This component is part of the @vue-dnd-kit/components library, which provides a CLI that generates components directly into your project directory, similar to shadcn.
