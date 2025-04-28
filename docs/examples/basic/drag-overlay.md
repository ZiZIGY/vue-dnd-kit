<script setup>
import CustomDragOverlay from '@examples/CustomDragOverlayContainer/Draggable.vue';
</script>

# Drag Overlay

This example demonstrates how to customize the appearance of elements during drag operations by creating custom drag overlays.

## Overview

The Drag Overlay example shows how to use the `useDragContainer` composable to create a fully customized drag overlay. Instead of displaying a clone of the dragged element, you can render completely custom content during drag operations.

<CustomDragOverlay/>

## Key Concepts

- Creating a custom drag container component
- Using `useDragContainer` to access drag state information
- Replacing the default overlay with custom elements
- Providing visual feedback during drag operations

## Basic Usage

To implement a custom drag overlay, you need two components:

### 1. Custom Container Component

```vue
<script setup>
  import { useDragContainer } from '@vue-dnd-kit/core';

  const { elementRef, draggingElements, isDragging, pointerPosition } =
    useDragContainer();
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isDragging"
      class="custom-overlay"
      :style="{
        position: 'fixed',
        top: `${pointerPosition.y}px`,
        left: `${pointerPosition.x}px`,
        transform: 'translate(-50%, -50%)',
      }"
    >
      Custom Drag Overlay
    </div>
  </Transition>
</template>

<style scoped>
  .custom-overlay {
    padding: 12px 16px;
    background: #3eaf7c;
    color: white;
    border-radius: 4px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
```

### 2. Draggable Component Using Custom Container

```vue
<script setup>
  import { useDraggable } from '@vue-dnd-kit/core';
  import CustomContainer from './CustomContainer.vue';

  const { elementRef, handleDragStart, isDragging } = useDraggable({
    container: CustomContainer, // Specify your custom container
  });
</script>

<template>
  <div
    ref="elementRef"
    class="draggable-item"
    :class="{ 'is-dragging': isDragging }"
    @pointerdown="handleDragStart"
  >
    Drag me to see custom drag overlay
  </div>
</template>

<style scoped>
  .draggable-item {
    padding: 12px 16px;
    border-radius: 6px;
    background-color: #3eaf7c;
    color: white;
    box-shadow: 0 2px 4px rgba(62, 175, 124, 0.2);
    cursor: grab;
    user-select: none;
  }

  .is-dragging {
    opacity: 0.5;
  }
</style>
```

## How It Works

1. Create a custom container component using `useDragContainer`
2. Pass this container to the `useDraggable` composable via the `container` option
3. During drag operations, your custom container will be rendered instead of the default overlay
4. Use the `isDragging` and `pointerPosition` values to control the visibility and positioning of your custom overlay
5. Add transitions and animations to enhance the user experience

With this approach, you have complete control over what appears during drag operations. You can create complex overlays with additional information, custom styling, or even interactive elements.

## Accessing Dragged Content

The `draggingElements` value from `useDragContainer` gives you access to all elements currently being dragged. You can use this to render information about the dragged items in your overlay:

```vue
<template>
  <div
    v-if="isDragging"
    class="custom-overlay"
  >
    <div
      v-for="element in draggingElements"
      :key="element.id"
    >
      Dragging: {{ element.data.someProperty }}
    </div>
  </div>
</template>
```

This allows you to create dynamic overlays that adapt based on what's being dragged.
