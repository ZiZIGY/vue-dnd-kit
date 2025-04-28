<script setup>
import KeyboardSupport from '@examples/KeyboardSupport.vue';
</script>

# Keyboard Support

This example demonstrates how to make your drag and drop interface accessible using keyboard controls, making it usable for people who cannot or prefer not to use a mouse.

## Overview

The Keyboard Support example shows how to enhance the `useDraggable` composable with keyboard event handlers, allowing users to initiate and control drag operations using only their keyboard.

<KeyboardSupport />

## Key Concepts

- Making drag and drop operations accessible via keyboard
- Adding proper keyboard event handlers
- Using ARIA attributes to enhance screen reader compatibility
- Providing visual feedback for keyboard focus states

## Basic Usage

```vue
<script setup>
  import { useDraggable } from '@vue-dnd-kit/core';

  const { elementRef, isDragging, handleDragStart } = useDraggable({
    id: 'keyboard-draggable',
  });
</script>

<template>
  <div
    ref="elementRef"
    :class="{ 'is-dragging': isDragging }"
    class="draggable-item"
    tabindex="0"
    role="button"
    aria-label="Draggable item"
    @pointerdown="handleDragStart"
    @keydown.space.prevent="handleDragStart"
  >
    <div class="keyboard-hint"> <kbd>Space</kbd> to drag </div>
    <div class="keyboard-hint">
      <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to move
    </div>
    <div class="item-content">Press Space to drag me</div>
  </div>
</template>

<style scoped>
  .draggable-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    border-radius: 6px;
    background-color: #3eaf7c;
    color: white;
    font-weight: 500;
    transition: all 0.2s ease;
    user-select: none;
    cursor: grab;
  }

  .draggable-item:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.4);
  }

  .is-dragging {
    opacity: 0.5;
    transform: scale(0.95);
    cursor: grabbing;
  }

  /* Additional styles omitted for brevity */
</style>
```

## Accessibility Best Practices

When implementing keyboard support for drag and drop:

1. Make draggable elements focusable with `tabindex="0"`
2. Use appropriate ARIA roles and labels
3. Add keyboard event handler for Space key to start dragging (Note: Enter is reserved for drop operations)
4. Once in drag mode, use WASD keys for directional movement
5. Provide clear visual focus indicators
6. Include instructions or visual cues about keyboard commands

Supporting keyboard interactions ensures your drag and drop interface is accessible to all users, including those with motor disabilities or those who prefer keyboard navigation.
