# Sorting Lists

Vue DnD Kit provides powerful capabilities for creating sortable lists with drag and drop functionality, allowing items to be reordered within a single list or moved between different lists.

<script setup>
import Example from '@examples/SortingLists/Example.vue';
</script>

## Overview

Vue DnD Kit offers several key features for working with sortable lists:

1. **Internal sorting**: Reorder items within the same list
2. **Cross-list transfers**: Move items between different lists
3. **Transition animations**: Smooth animations during item movement
4. **Automatic updates**: Built-in operations for data management

<Example />

## Implementation

### Draggable Component

Create a draggable component for list items:

```vue
<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const { index, source } = defineProps<{
    index: number;
    source: any[];
  }>();

  // Using computed for index and source ensures reactivity
  // This is especially important when working with nested lists
  const { elementRef, handleDragStart, isOvered, isDragging } = useDraggable({
    data: computed(() => ({
      index,
      source,
    })),
  });
</script>

<template>
  <div
    ref="elementRef"
    @pointerdown="handleDragStart"
    :class="{
      'is-over': isOvered,
      'is-dragging': isDragging,
    }"
    class="draggable"
  >
    <slot />
  </div>
</template>

<style>
  .draggable {
    padding: 10px 16px;
    border: 1px solid #3eaf7c;
    border-radius: 6px;
    cursor: move;
    background-color: #3eaf7c;
    color: white;
    font-weight: 500;
    font-size: 14px;
    width: 100%;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(62, 175, 124, 0.2);
    user-select: none;
    touch-action: none;
    opacity: 0.5;
  }

  .draggable:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.3);
  }

  .is-dragging {
    opacity: 0.2;
  }

  .is-over {
    border-color: #3eaf7c;
    box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.3);
    background-color: #44c98d;
    opacity: 1;
  }
</style>
```

### Example Component

Main component showcasing sortable lists functionality:

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import Draggable from './Draggable.vue';
  import { useDroppable, DnDOperations } from '@vue-dnd-kit/core';

  const firstColumn = ref([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ]);

  const secondColumn = ref([
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
  ]);

  const { elementRef: firstColumnRef } = useDroppable({
    data: {
      source: firstColumn.value,
    },
    events: {
      onDrop: DnDOperations.applyTransfer,
    },
  });

  const { elementRef: secondColumnRef } = useDroppable({
    data: {
      source: secondColumn.value,
    },
    events: {
      onDrop: DnDOperations.applyTransfer,
    },
  });
</script>

<template>
  <div class="container">
    <div
      class="dropzone"
      ref="firstColumnRef"
    >
      <TransitionGroup name="list">
        <Draggable
          v-for="(item, index) in firstColumn"
          :key="item.id"
          :index="index"
          :source="firstColumn"
        >
          {{ item.name }}
        </Draggable>
      </TransitionGroup>
    </div>

    <div
      class="dropzone"
      ref="secondColumnRef"
    >
      <TransitionGroup name="list">
        <Draggable
          v-for="(item, index) in secondColumn"
          :key="item.id"
          :index="index"
          :source="secondColumn"
        >
          {{ item.name }}
        </Draggable>
      </TransitionGroup>
    </div>
  </div>
</template>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .dropzone {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 1px dashed rgba(62, 175, 124, 0.3);
    border-radius: 6px;
    background-color: rgba(62, 175, 124, 0.1);
  }

  .list-move {
    transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .list-enter-active,
  .list-leave-active {
    transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }

  .list-leave-active {
    position: absolute;
    pointer-events: none;
  }
</style>
```

## Key Features

### Automatic Transfer Operations

Vue DnD Kit includes built-in operations for handling common list operations:

```js
import { DnDOperations } from '@vue-dnd-kit/core';

// In your droppable configuration
const { elementRef } = useDroppable({
  events: {
    onDrop: DnDOperations.applyTransfer, // Handles item movement automatically
  },
});
```

### Transition Animations

Implement smooth animations using Vue's transition system:

```vue
<template>
  <div class="dropzone">
    <TransitionGroup name="list">
      <Draggable
        v-for="(item, index) in items"
        :key="item.id"
        :index="index"
        :source="items"
      >
        {{ item.name }}
      </Draggable>
    </TransitionGroup>
  </div>
</template>

<style>
  .list-move {
    transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .list-enter-active,
  .list-leave-active {
    transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
</style>
```

### Visual Feedback

Add visual cues for drag and drop interactions:

```css
.dropzone {
  padding: 1rem;
  border: 1px dashed rgba(62, 175, 124, 0.3);
  border-radius: 6px;
  background-color: rgba(62, 175, 124, 0.1);
}

.draggable {
  cursor: move;
  transition: all 0.2s ease;
}

.is-dragging {
  opacity: 0.2;
}

.is-over {
  background-color: rgba(62, 175, 124, 0.2);
}
```

## Best Practices

1. **Unique Keys**: Always provide unique keys for list items to ensure proper rendering and animations
2. **Computed Properties**: Use computed properties for dynamic data in draggable components
3. **Touch Support**: Include touch-action CSS property for better mobile support
4. **Accessibility**: Add appropriate ARIA attributes and keyboard navigation
5. **Animation Performance**: Use transform and opacity for smooth animations
