# Tree Structure

Vue DnD Kit allows you to create and manage complex tree structures with full drag and drop support. You can reorder nodes, move them between branches, and nest them at different levels.

<script setup>
import Example from '@examples/Tree/Example.vue';
</script>

## Overview

Vue DnD Kit provides powerful features for working with tree structures:

1. **Nested droppable zones**: Create infinitely nested draggable areas
2. **Recursive components**: Build complex hierarchical structures
3. **Automatic data management**: Handle tree data updates automatically
4. **Seamless transfers**: Move nodes between any level in the tree

<Example />

## Implementation

### Tree Component

The main recursive component that renders the tree structure:

```vue
<script setup lang="ts">
  import Draggable from './Draggable.vue';
  import Droppable from './Droppable.vue';

  interface TreeItem {
    id?: string | number;
    children?: TreeItem[];
  }

  const { source } = defineProps<{
    source: TreeItem[];
  }>();
</script>

<template>
  <Droppable :source="source">
    <TransitionGroup name="list">
      <Draggable
        v-for="(item, index) in source"
        :key="item.id"
        :index="index"
        :source="source"
      >
        Draggable - {{ item.id }}
        <Tree
          v-if="item.children"
          :source="item.children"
        />
      </Draggable>
    </TransitionGroup>
  </Droppable>
</template>

<style scoped>
  .list-move {
    transition: all 0.3s ease;
  }
  .list-enter-active,
  .list-leave-active {
    transition: all 0.3s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
  }
  .list-leave-active {
    position: absolute;
  }
</style>
```

### Draggable Component

Create draggable nodes for the tree:

```vue
<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const { index, source } = defineProps<{
    index: number;
    source: any[];
  }>();

  // Using computed for index and source ensures reactivity
  // This is especially important when working with nested trees
  const { elementRef, handleDragStart, isDragging, isOvered } = useDraggable({
    data: computed(() => ({
      source,
      index,
    })),
  });
</script>

<template>
  <div
    class="draggable"
    ref="elementRef"
    :class="{ 'is-dragging': isDragging, 'is-overed': isOvered }"
  >
    <div>
      <button
        class="drag-handle"
        aria-label="Drag handle"
        @pointerdown="handleDragStart"
      >
        ⋮⋮
      </button>
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .draggable {
    padding: 10px 16px;
    border: 1px solid rgba(62, 175, 124, 0.3);
    border-radius: 6px;
    background-color: rgba(62, 175, 124, 0.1);
    font-weight: 500;
    font-size: 14px;
    width: 100%;
    transition: all 0.2s ease;
  }

  .is-dragging {
    opacity: 0.5;
  }

  .is-overed {
    background-color: rgba(62, 175, 124, 0.2);
    border-color: rgba(62, 175, 124, 0.3);
  }
</style>
```

### Droppable Component

Create drop zones for tree nodes:

```vue
<script setup lang="ts">
  import { useDroppable, DnDOperations } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const { source } = defineProps<{
    source: any[];
  }>();

  // Using computed to ensure reactivity with nested structures
  const { elementRef, isOvered } = useDroppable({
    data: computed(() => ({
      source,
    })),
    events: {
      onDrop: DnDOperations.applyTransfer,
    },
  });
</script>

<template>
  <div
    class="droppable"
    ref="elementRef"
    :class="{ 'is-overed': isOvered }"
  >
    <slot />
  </div>
</template>

<style scoped>
  .droppable {
    padding: 16px;
    border-radius: 6px;
    border: 1px dashed rgba(62, 175, 124, 0.3);
    background-color: rgba(62, 175, 124, 0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
  }

  .is-overed {
    background-color: rgba(62, 175, 124, 0.2);
  }
</style>
```

### Example Usage

Setup a tree with nested nodes:

```vue
<script setup lang="ts">
  import Tree from './Tree.vue';
  import { ref } from 'vue';

  interface TreeItem {
    id: string | number;
    children?: TreeItem[];
  }

  const source = ref<TreeItem[]>([
    {
      id: crypto.randomUUID(),
      children: [
        {
          id: crypto.randomUUID(),
          children: [
            {
              id: crypto.randomUUID(),
              children: [],
            },
            {
              id: crypto.randomUUID(),
              children: [],
            },
            {
              id: crypto.randomUUID(),
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      children: [
        {
          id: crypto.randomUUID(),
          children: [
            {
              id: crypto.randomUUID(),
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      children: [
        {
          id: crypto.randomUUID(),
          children: [],
        },
        {
          id: crypto.randomUUID(),
          children: [],
        },
      ],
    },
  ]);
</script>

<template>
  <Tree :source="source" />
</template>
```

## Key Features

### Recursive Structure

The Tree component recursively renders itself for children nodes, creating an infinitely nestable structure:

```vue
<Tree v-if="item.children" :source="item.children" />
```

### Transitions for Smooth Animations

Adding transition groups enhances the user experience with smooth animations:

```vue
<TransitionGroup name="list">
  <Draggable v-for="..." :key="...">
    <!-- content -->
  </Draggable>
</TransitionGroup>
```

### Drag Handle for Better Control

Adding a dedicated drag handle improves the user interaction:

```vue
<button
  class="drag-handle"
  aria-label="Drag handle"
  @pointerdown="handleDragStart"
>
  ⋮⋮
</button>
```

### Visual Feedback

Providing visual feedback when dragging or hovering over elements:

```vue
<div :class="{ 'is-dragging': isDragging, 'is-overed': isOvered }">
  <!-- content -->
</div>
```

### Consistent Styling

Using semi-transparent colors maintains a consistent look across themes:

```css
.draggable {
  border: 1px solid rgba(62, 175, 124, 0.3);
  background-color: rgba(62, 175, 124, 0.1);
}

.droppable {
  border: 1px dashed rgba(62, 175, 124, 0.3);
  background-color: rgba(62, 175, 124, 0.1);
}

.is-overed {
  background-color: rgba(62, 175, 124, 0.2);
}
```

### Automatic Data Transfer

Vue DnD Kit automatically handles the data updates when items are moved within the tree:

```js
const { elementRef } = useDroppable({
  data: computed(() => ({
    source,
  })),
  events: {
    onDrop: DnDOperations.applyTransfer, // Automatically updates tree data
  },
});
```

## Best Practices

1. **Unique IDs**: Always provide unique IDs for tree nodes to ensure proper updates
2. **Computed Properties**: Use computed properties for data to maintain reactivity in nested structures
3. **Performance Optimization**: Consider implementing virtualization for large trees
4. **Deep Cloning**: When manually manipulating the tree data, use deep cloning to preserve reactivity
5. **Type Definitions**: Use TypeScript interfaces to define your tree structure for better code maintenance
6. **Empty Children Arrays**: Use empty arrays instead of undefined for leaf nodes to simplify operations
7. **Visual Feedback**: Provide clear visual cues for drag states to enhance user experience
8. **Consistent Styling**: Use semi-transparent colors for better theme compatibility
