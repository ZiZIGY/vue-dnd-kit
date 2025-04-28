<script setup>
import SimpleDrag from '@examples/SimpleDrag.vue';
</script>

# Simple Drag

This example demonstrates the most basic usage of Vue DnD Kit - making an element draggable.

## Overview

The Simple Drag example shows how to create draggable elements using the `useDraggable` composable. This is the foundation for all drag and drop interactions in Vue DnD Kit.

<SimpleDrag />

## Key Concepts

- Using the `useDraggable` composable
- Handling drag start events
- Tracking the dragging state
- Styling draggable elements

## Basic Usage

```vue
<script setup>
  import { useDraggable } from '@vue-dnd-kit/core';

  const { elementRef, isDragging, handleDragStart } = useDraggable({
    id: 'draggable-1',
  });
</script>

<template>
  <div
    ref="elementRef"
    :class="{ dragging: isDragging }"
    @pointerdown="handleDragStart"
  >
    Drag me!
  </div>
</template>

<style scoped>
  .dragging {
    opacity: 0.5;
    cursor: grabbing;
  }
</style>
```

## Next Steps

Once you understand how to make elements draggable, you can:

- Create drop zones with `useDroppable`
- Implement drag-to-reorder functionality
- Add custom drag handles
- Create a drag overlay
