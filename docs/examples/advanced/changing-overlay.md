# Changing Overlay Container

This example demonstrates how to dynamically change the overlay container component during drag operations, allowing you to create more interactive and contextual drag experiences.

<script setup>
import Example from '@examples/ChangingOverlay/Container.vue';
</script>

## Overview

The Changing Overlay example shows how to dynamically swap the overlay container component during a drag operation. This gives you complete control over the visual representation of dragged elements based on context - for example, when hovering over a drop zone. Unlike static overlays, this approach allows for rich visual feedback that adapts to the current drag state.

<Example />

## Key Concepts

- Dynamically changing the overlay container component during drag operations
- Using `markRaw` to optimize performance and prevent Vue reactivity warnings
- Accessing and modifying the store's active container directly
- Responding to hover and leave events to trigger container changes

## Example Code

### Main Container Component

```vue
<script setup lang="ts">
  import { useDraggable, useDroppable } from 'vue-dnd-kit';
  import ExampleOverlay from './ExampleOverlay.vue';
  import { markRaw } from 'vue';

  const { elementRef, handleDragStart, isDragging } = useDraggable();

  const { elementRef: dropZoneRef, isOvered } = useDroppable({
    events: {
      onHover: (store) =>
        (store.activeContainer.component.value = markRaw(ExampleOverlay)),
      onLeave: (store) => (store.activeContainer.component.value = null),
    },
  });
</script>

<template>
  <div class="container">
    <div
      ref="elementRef"
      @pointerdown="handleDragStart"
      class="draggable-item"
      :class="{ 'is-dragging': isDragging }"
    >
      Move me to drop zone
    </div>

    <div
      ref="dropZoneRef"
      class="drop-zone"
      :class="{ 'is-overed': isOvered }"
    >
      Drop zone
    </div>
  </div>
</template>
```

### Custom Overlay Component

```vue
<script setup lang="ts">
  import { useDragContainer } from 'vue-dnd-kit';
  import { computed, CSSProperties } from 'vue';

  const { elementRef, pointerPosition } = useDragContainer();

  const computedStyle = computed<CSSProperties>(() => ({
    transform: `translate3d(${
      (pointerPosition.current.value?.x ?? 0) -
      (pointerPosition.offset.pixel.value?.x ?? 0)
    }px, ${
      (pointerPosition.current.value?.y ?? 0) -
      (pointerPosition.offset.pixel.value?.y ?? 0)
    }px, 0)`,
    zIndex: 1000,
    position: 'fixed',
    top: 0,
    left: 0,
    transition: '0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
  }));
</script>

<template>
  <div
    ref="elementRef"
    class="user-card-skeleton"
    :style="computedStyle"
  >
    <div class="user-card-content">
      <div class="avatar-skeleton"></div>
      <div class="info-container">
        <div class="name-skeleton"></div>
        <div class="subtitle-skeleton"></div>
      </div>
      <div class="body-container">
        <div class="text-line-skeleton"></div>
        <div class="text-line-skeleton medium"></div>
        <div class="text-line-skeleton short"></div>
      </div>
      <div class="footer-container">
        <div class="button-skeleton"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .user-card-skeleton {
    width: 100%;
    max-width: 350px;
    background-color: #16161625;
    padding: 16px;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .user-card-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .avatar-skeleton {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: rgba(62, 175, 124, 0.1);
    border: 1px dashed rgba(62, 175, 124, 0.3);
    position: relative;
    overflow: hidden;
  }

  .info-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .name-skeleton {
    height: 20px;
    width: 70%;
    border-radius: 4px;
    background-color: rgba(62, 175, 124, 0.1);
    border: 1px dashed rgba(62, 175, 124, 0.3);
    position: relative;
    overflow: hidden;
  }

  .subtitle-skeleton {
    height: 16px;
    width: 50%;
    border-radius: 4px;
    background-color: rgba(62, 175, 124, 0.1);
    border: 1px dashed rgba(62, 175, 124, 0.3);
    position: relative;
    overflow: hidden;
  }

  .body-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
  }

  .text-line-skeleton {
    height: 16px;
    width: 100%;
    border-radius: 4px;
    background-color: rgba(62, 175, 124, 0.1);
    border: 1px dashed rgba(62, 175, 124, 0.3);
    position: relative;
    overflow: hidden;
  }

  .text-line-skeleton.medium {
    width: 85%;
  }

  .text-line-skeleton.short {
    width: 70%;
  }

  .footer-container {
    margin-top: 8px;
  }

  .button-skeleton {
    height: 30px;
    width: 40%;
    border-radius: 4px;
    background-color: rgba(62, 175, 124, 0.1);
    border: 1px dashed rgba(62, 175, 124, 0.3);
    position: relative;
    overflow: hidden;
  }

  .avatar-skeleton::after,
  .name-skeleton::after,
  .subtitle-skeleton::after,
  .text-line-skeleton::after,
  .button-skeleton::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(62, 175, 124, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
```

## How It Works

This example demonstrates a powerful technique for changing overlay containers dynamically:

1. **Initial State**: We start with the default overlay (or none) when dragging begins
2. **Hover Detection**: When hovering over the drop zone, we change the overlay container
3. **Dynamic Switching**: The overlay switches to a card-like skeleton UI when over the drop zone
4. **Reset on Leave**: When leaving the drop zone, the overlay returns to its default state

The key part is directly modifying the store's active container component:

```js
// When hovering over a drop zone
onHover: (store) => (store.activeContainer.component.value = markRaw(ExampleOverlay)),

// When leaving the drop zone
onLeave: (store) => (store.activeContainer.component.value = null),
```

## Using markRaw for Component References

When setting component references in Vue, it's crucial to use `markRaw()` to prevent Vue from making the component reactive. This avoids console warnings and performance issues:

```js
// Correct - use markRaw
import { markRaw } from 'vue';
store.activeContainer.component.value = markRaw(ExampleOverlay);

// Incorrect - will cause warnings and performance issues
store.activeContainer.component.value = ExampleOverlay;
```

## Custom Overlay Positioning

The custom overlay uses the positioning data from `useDragContainer()` to correctly position itself:

```js
const { elementRef, pointerPosition } = useDragContainer();

const computedStyle = computed(() => ({
  transform: `translate3d(${
    (pointerPosition.current.value?.x ?? 0) -
    (pointerPosition.offset.pixel.value?.x ?? 0)
  }px, ${
    (pointerPosition.current.value?.y ?? 0) -
    (pointerPosition.offset.pixel.value?.y ?? 0)
  }px, 0)`,
  // other styles...
}));
```

This technique provides a fully customized drag experience that can adapt to different contexts during the drag operation, enhancing the user experience with rich visual feedback.
