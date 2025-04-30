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
- Supporting mobile devices with proper touch handling

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
    class="draggable"
    :class="{ dragging: isDragging }"
    @pointerdown="handleDragStart"
  >
    Drag me!
  </div>
</template>

<style scoped>
  .draggable {
    touch-action: none;
  }
  .dragging {
    opacity: 0.5;
    cursor: grabbing;
  }
</style>
```

## Mobile Support

To ensure proper drag behavior on mobile devices, it's crucial to add `touch-action: none` to your draggable elements. This CSS property prevents the browser's default touch actions (like scrolling) from interfering with your drag operations.

```css
.draggable {
  touch-action: none;
}
```

Without this property, mobile users might experience issues where attempting to drag an element results in page scrolling instead of the expected drag behavior.

## Next Steps

Once you understand how to make elements draggable, you can:

- Create drop zones with `useDroppable`
- Implement drag-to-reorder functionality
- Add custom drag handles
- Create a drag overlay
