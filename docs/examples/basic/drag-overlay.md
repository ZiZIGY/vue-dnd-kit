<script setup>
import CustomDragOverlay from '@examples/CustomDragOverlayContainer/Draggable.vue';
</script>

# Drag Overlay

This example demonstrates how to customize the appearance of elements during drag operations by creating custom drag overlays with transitions.

## Overview

The Drag Overlay example shows how to use the `useDragContainer` composable to create a fully customized drag overlay with transition effects. Instead of displaying a simple clone of the dragged element, you can render completely custom content with smooth animations.

<CustomDragOverlay />

## Key Concepts

- Creating a custom drag container component
- Using `useDragContainer` with transition options
- Customizing the appearance of dragged elements
- Adding transition effects to drag overlays

## Basic Usage

To implement a custom drag overlay with transitions, you need two components:

### 1. Custom Container Component

```vue
<script setup>
  import { computed } from 'vue';
  import { useDragContainer } from '@vue-dnd-kit/core';

  // useDragContainer accepts transition options that match Vue's Transition component
  const { elementRef, pointerPosition, isDragging } = useDragContainer({
    // Transition name - will apply .fade-enter-active, .fade-leave-active, etc.
    name: 'fade',
    // You can also provide other transition options
    // duration: 300,
    // mode: 'out-in',
    // css: true,
    // etc.
  });

  const computedStyle = computed(() => ({
    zIndex: 1000,
    position: 'fixed',
    top: `${pointerPosition.current.value?.y}px`,
    left: `${pointerPosition.current.value?.x}px`,
    transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
  }));
</script>

<template>
  <div
    v-if="isDragging"
    ref="elementRef"
    :style="computedStyle"
    class="custom-overlay"
  >
    <div class="overlay-content"> Custom Drag Overlay </div>
  </div>
</template>

<style>
  /* These classes will be applied automatically based on the 'name' property */
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .custom-overlay {
    background: #3eaf7c;
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
    Drag me to see custom overlay
  </div>
</template>

<style scoped>
  .draggable-item {
    padding: 12px 16px;
    border-radius: 6px;
    background-color: #3eaf7c;
    color: white;
    cursor: grab;
    user-select: none;
  }

  .is-dragging {
    opacity: 0.5;
  }
</style>
```

## How It Works

1. Create a custom container component using `useDragContainer` with transition options
2. Define transition styles in your CSS (matching the transition name)
3. Pass this container to the `useDraggable` composable via the `container` option
4. The transition will automatically be applied when the drag overlay appears/disappears

The library handles all the complexity of applying transitions behind the scenes. Under the hood, the `DragOverlay` component uses Vue's `<Transition>` component with all the options you provide to `useDragContainer`.

## Available Transition Options

The `useDragContainer` composable accepts all the same options as Vue's native `<Transition>` component:

- `name`: String - Name prefix for transition classes
- `duration`: Number | Object - Transition duration in milliseconds
- `mode`: String - Transition mode ('in-out' or 'out-in')
- And all other props accepted by Vue's `<Transition>` component

This gives you complete flexibility to create beautiful, smooth drag effects that match your application's design language.
