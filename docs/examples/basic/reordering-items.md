<script setup>
import List from '@examples/ReorderingItems/List.vue';
</script>

# Reordering Items

This example demonstrates how to create a list of items that can be reordered through drag and drop operations.

## Overview

The Reordering Items example shows how to use the `useDraggable` and `useDroppable` composables together to create a sortable list. Users can drag items to reposition them within the list.

<List/>

## Key Concepts

- Creating a list of sortable items
- Using `useDraggable` for each list item
- Using `useDroppable` for the list container
- Transferring data between drag source and drop target
- Updating the array order when items are dropped

## Basic Usage

```vue
<script setup>
  import { computed, ref } from 'vue';
  import { useDroppable, DnDOperations } from '@vue-dnd-kit/core';
  import Draggable from './Draggable.vue';

  // List container that accepts drops
  const { elementRef, isOvered, isAllowed } = useDroppable({
    data: computed(() => ({
      source: items,
    })),
    events: {
      onDrop: DnDOperations.applyTransfer, // Built-in operation to apply array reordering
    },
  });

  // List of items that can be reordered
  const items = ref([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
  ]);
</script>

<template>
  <div
    class="list"
    ref="elementRef"
  >
    <Draggable
      v-for="(item, index) in items"
      :key="item.id"
      :source="items"
      :index="index"
    >
      {{ item.content }}
    </Draggable>
  </div>
</template>
```

### Draggable Component

```vue
<script setup>
  import { useDraggable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const props = defineProps({
    source: Array,
    index: Number,
  });

  const { elementRef, handleDragStart, isDragging, isOvered } = useDraggable({
    data: computed(() => ({
      index: props.index,
      source: props.source,
    })),
  });
</script>

<template>
  <div
    ref="elementRef"
    class="draggable-item"
    :class="{ 'is-dragging': isDragging, 'is-overed': isOvered }"
    @pointerdown="handleDragStart"
  >
    <slot />
  </div>
</template>
```

## How It Works

1. Each list item is wrapped in a `Draggable` component that uses `useDraggable`
2. The list container uses `useDroppable` to accept drops
3. When an item is dragged, it carries data about its index and source array
4. When dropped, the `DnDOperations.applyTransfer` utility handles the array reordering
5. Vue's reactivity system updates the UI to reflect the new order

This pattern can be extended to create more complex sortable interfaces like kanban boards, multi-column layouts, or nested sortable lists.
