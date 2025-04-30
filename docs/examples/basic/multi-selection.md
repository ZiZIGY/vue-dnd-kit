<script setup>
import Example from '@examples/MultiSelection/Example.vue';
</script>

# Multi-Selection

This example demonstrates how to implement multi-selection functionality for draggable elements, allowing users to select and drag multiple items at once.

## Overview

The Multi-Selection example shows how to create selectable draggable elements using the `useSelection` composable. This pattern is commonly used in file managers, task lists, and other interfaces where users need to manipulate multiple items simultaneously.

<Example />

## Key Concepts

- Using the `useSelection` composable to track selected elements
- Combining selection with drag functionality
- Creating drag handles for better control
- Visual feedback for selection state and drag operations
- Checkbox controls for selecting/deselecting items

## Basic Usage

```vue
<script setup>
  import { useDraggable, useSelection } from 'vue-dnd-kit';

  const { elementRef, isDragging, handleDragStart } = useDraggable();

  // Pass the elementRef to useSelection to enable selection for this element
  const { handleToggleSelect, isSelected } = useSelection(elementRef);
</script>

<template>
  <div
    ref="elementRef"
    :class="{ 'is-dragging': isDragging }"
    class="draggable-item"
  >
    <div
      class="drag-handle"
      role="button"
      tabindex="0"
      aria-label="Drag handle"
      @pointerdown="handleDragStart"
    >
      ⋮⋮
    </div>
    <input
      type="checkbox"
      :checked="isSelected"
      @change="handleToggleSelect"
    />
    <div class="item-content">Drag using the handle</div>
  </div>
</template>

<style scoped>
  .draggable-item {
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 6px;
    background-color: #3eaf7c;
    color: white;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(62, 175, 124, 0.2);
    transition: all 0.2s ease;
    user-select: none;
  }

  .drag-handle {
    cursor: grab;
    padding: 8px 6px;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    user-select: none;
    touch-action: none; /* Important for mobile devices */
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
  }

  .drag-handle:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .is-dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }

  .is-dragging .drag-handle {
    cursor: grabbing;
  }
</style>
```

## Example Usage

Here's how to set up a container with multiple selectable draggable items:

```vue
<script setup>
  import Draggable from './Draggable.vue';
</script>

<template>
  <div class="draggable-container">
    <Draggable />
    <Draggable />
    <Draggable />
  </div>
</template>

<style scoped>
  .draggable-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
```

## How It Works

The `useSelection` composable works in conjunction with the library's internal selection store to:

1. **Track Selection State**: Keep track of which elements are selected
2. **Toggle Selection**: Provide a function to toggle selection state
3. **Read Selection Status**: Expose reactive properties to show if an element is selected
4. **Work with Draggable Elements**: Automatically handle dragging of selected items

Important behaviors to note:

- **Escape Key**: Pressing Escape during drag operations does not clear selection - it only cancels the current drag operation
- **Selection Persistence**: Selection is maintained until elements are successfully dropped
- **Enter Key**: Pressing Enter confirms the drop operation, completing the drag and drop process

When using a drag handle, ensure you add `touch-action: none` to the handle element. This prevents the browser's default touch actions from interfering with drag operations on mobile devices.

```css
.drag-handle {
  touch-action: none; /* Required for proper mobile drag behavior */
}
```
