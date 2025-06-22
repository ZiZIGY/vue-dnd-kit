# Sortable Component

The `Sortable` component provides a flexible and intuitive drag-and-drop sortable list interface, perfect for creating reorderable lists, to-do applications, and other interactive UI elements.

## Features

- Simple drag-and-drop sorting functionality
- Customizable drag-n-drop groups
- Smooth animations and transitions
- Status indicators for list items
- Responsive design
- Empty state placeholder
- Modern styling with hover effects

## Import

```ts
import { Sortable, SortableItem } from '{your component path}/Sortable';
```

## Props

### Sortable

| Name        | Type       | Default             | Description                            |
| ----------- | ---------- | ------------------- | -------------------------------------- |
| data        | `T[]`      | Required            | Array of data to display in the list   |
| groups      | `string[]` | `['sortable']`      | Groups for drag-n-drop operations      |
| placeholder | `string`   | `'Drop items here'` | Text to display when the list is empty |

### SortableItem

| Name   | Type                                          | Default        | Description                            |
| ------ | --------------------------------------------- | -------------- | -------------------------------------- |
| source | `T[]`                                         | Required       | Source array containing the item       |
| index  | `number`                                      | Required       | Index of the item in the source array  |
| groups | `string[]`                                    | `['sortable']` | Groups for drag-n-drop operations      |
| status | `'success' \| 'warning' \| 'error' \| 'info'` | -              | Optional status indicator for the item |

## Slots

### Sortable

| Name    | Props | Description                |
| ------- | ----- | -------------------------- |
| default | -     | Content for the list items |

### SortableItem

| Name    | Props | Description               |
| ------- | ----- | ------------------------- |
| default | -     | Content for the list item |

## Usage Example

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { Sortable, SortableItem } from '{your component path}/Sortable';

  interface Task {
    id: number;
    title: string;
    status: 'success' | 'warning' | 'error' | 'info';
  }

  const tasks = ref<Task[]>([
    { id: 1, title: 'Complete project', status: 'success' },
    { id: 2, title: 'Client meeting', status: 'warning' },
    { id: 3, title: 'Update documentation', status: 'info' },
    { id: 4, title: 'Fix bugs', status: 'error' },
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
        :status="task.status"
      >
        <div class="task-item">
          <h3>{{ task.title }}</h3>
          <span class="task-status">{{ task.status }}</span>
        </div>
      </SortableItem>
    </Sortable>
  </div>
</template>

<style>
  .sortable-container {
    max-width: 500px;
    margin: 0 auto;
  }

  .task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .task-status {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    background-color: #f3f4f6;
  }
</style>
```

## Styling

The Sortable component comes with a set of predefined CSS classes:

- `.vue-dnd-sortable` - Main sortable container
- `.vue-dnd-sortable-empty` - Empty state placeholder
- `.vue-dnd-sortable-item` - Sortable list item
- `.vue-dnd-sortable-item-dragging` - Applied when an item is being dragged
- `.vue-dnd-sortable-item-ghost` - Applied to the ghost element during dragging
- `.vue-dnd-sortable-item-dropped` - Applied briefly when an item is dropped
- `.vue-dnd-sortable-drop-indicator` - Indicates where an item will be dropped

For status styling, you can use:

- `.vue-dnd-sortable-item-success` - Success status styling (green left border)
- `.vue-dnd-sortable-item-warning` - Warning status styling (yellow left border)
- `.vue-dnd-sortable-item-error` - Error status styling (red left border)
- `.vue-dnd-sortable-item-info` - Info status styling (blue left border)

## Advanced Usage

### Using with Multiple Lists

You can create multiple sortable lists that interact with each other:

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { Sortable, SortableItem } from '{your component path}/Sortable';

  const todoTasks = ref([
    { id: 1, title: 'Task 1', status: 'warning' },
    { id: 2, title: 'Task 2', status: 'info' },
  ]);

  const completedTasks = ref([{ id: 3, title: 'Task 3', status: 'success' }]);
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
          :status="task.status"
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
          :status="task.status"
          :groups="['tasks']"
        >
          {{ task.title }}
        </SortableItem>
      </Sortable>
    </div>
  </div>
</template>
```

### Using with TransitionGroup for Animations

You can enhance the user experience by adding smooth animations using Vue's TransitionGroup:

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { Sortable, SortableItem } from '{your component path}/Sortable';

  interface Task {
    id: number;
    title: string;
    status: 'success' | 'warning' | 'error' | 'info';
  }

  const tasks = ref<Task[]>([
    { id: 1, title: 'Complete project', status: 'success' },
    { id: 2, title: 'Client meeting', status: 'warning' },
    { id: 3, title: 'Update documentation', status: 'info' },
    { id: 4, title: 'Fix bugs', status: 'error' },
  ]);

  const addTask = () => {
    const newId = Math.max(0, ...tasks.value.map((t) => t.id)) + 1;
    tasks.value.push({
      id: newId,
      title: `New task ${newId}`,
      status: ['success', 'warning', 'error', 'info'][
        Math.floor(Math.random() * 4)
      ] as any,
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
          :status="task.status"
        >
          <div class="task-item">
            <h3>{{ task.title }}</h3>
            <div class="task-actions">
              <span class="task-status">{{ task.status }}</span>
            </div>
          </div>
        </SortableItem>
      </TransitionGroup>
    </Sortable>
  </div>
</template>

<style>
  .sortable-container {
    max-width: 500px;
    margin: 0 auto;
  }

  .add-task-btn {
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-weight: 500;
  }

  .add-task-btn:hover {
    background-color: #2563eb;
  }

  .task-transition-group {
    position: relative;
  }

  .task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .task-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .task-status {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    background-color: #f3f4f6;
  }

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

## Related Components

### SortableItem

Component for displaying individual sortable items with drag functionality.

---

This component is part of the @vue-dnd-kit/components library, which provides a CLI that generates components directly into your project directory, similar to shadcn.
