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
<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import Draggable from './Draggable.vue';
  import { DnDOperations, useDroppable } from '@vue-dnd-kit/core';

  const { elementRef, isOvered, isAllowed } = useDroppable({
    data: computed(() => ({
      source: items,
    })),
    events: {
      onDrop: (store, payload) => {
        DnDOperations.applyTransfer(store);
      },
    },
  });

  const items = ref([
    { id: crypto.randomUUID(), content: crypto.randomUUID() },
    { id: crypto.randomUUID(), content: crypto.randomUUID() },
    { id: crypto.randomUUID(), content: crypto.randomUUID() },
  ]);

  const addItem = () =>
    items.value.push({
      id: crypto.randomUUID(),
      content: crypto.randomUUID(),
    });

  const removeItem = (index: number) => items.value.splice(index, 1);
</script>

<template>
  <button
    @click="addItem"
    class="add-item-button"
    >Add Item</button
  >
  <div
    class="list"
    ref="elementRef"
  >
    <TransitionGroup name="list">
      <Draggable
        v-for="(item, index) in items"
        :key="item.id"
        :source="items"
        :index="index"
      >
        <div class="item">
          {{ item.content }}
          <button @click="removeItem(index)">Remove</button>
        </div>
      </Draggable>
    </TransitionGroup>
  </div>
</template>

<style scoped>
  .list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    position: relative;
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
    height: 0px;
  }
  .list-leave-active {
    position: absolute;
    pointer-events: none;
  }
  .add-item-button {
    margin-bottom: 12px;
    padding: 12px 16px;
    border-radius: 6px;
    background-color: #3eaf7c;
    color: white;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      background-color: #3eaf7c;
      transform: translateY(-2px);
    }
  }
</style>
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
