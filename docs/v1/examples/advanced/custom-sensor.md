# Custom Collision Sensor

This example demonstrates how to implement a custom collision detection sensor to change how draggable elements interact with drop zones.

<script setup>
import Example from '@examples/CustomSensor/Example.vue';
</script>

## Overview

The default collision detection algorithm in Vue DnD Kit is powerful and works well for most scenarios, but sometimes you might need more specialized behavior. This example shows how to replace the default collision detection with a custom implementation using the browser's native `document.elementsFromPoint()` method.

<Example />

## How It Works

When you implement a custom sensor, you're replacing the library's default algorithm for determining which elements are potential drop targets. The library will still handle validating these targets and managing the drag state.

In this example, we use `document.elementsFromPoint()` which returns all elements at the current pointer position, stacked from top to bottom. This provides a simple way to detect elements that are directly under the pointer, rather than using the more complex geometric calculations in the default algorithm.

## Example Code

```vue
<script lang="ts" setup>
  import { useDraggable, useDroppable } from '@vue-dnd-kit/core';

  const { elementRef, handleDragStart, isDragging } = useDraggable({
    sensor: {
      setup: (store) => {
        // Get current pointer position from the store
        const x = store.pointerPosition.current.value?.x ?? 0;
        const y = store.pointerPosition.current.value?.y ?? 0;

        // Use the browser's native method to get all elements at the pointer position
        const elements = document.elementsFromPoint(x, y);

        // Return all elements at that position (the library will handle filtering)
        return elements.length > 0 ? elements : null;
      },
    },
  });

  const { elementRef: droppableRef, isAllowed } = useDroppable({
    events: {
      onDrop: () => alert('dropped'),
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
      Drag me
    </div>

    <div
      ref="droppableRef"
      class="droppable"
      :class="{ 'is-allowed': isAllowed }"
    >
      Drop zone
    </div>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    gap: 1rem;
    padding: 2rem;
  }

  .draggable-item {
    padding: 1rem;
    background-color: #3eaf7c;
    color: white;
    border-radius: 4px;
    cursor: move;
    touch-action: none;
    user-select: none;
  }

  .is-dragging {
    opacity: 0.5;
  }

  .droppable {
    padding: 2rem;
    background-color: #f1f1f1;
    border: 2px dashed #ccc;
    border-radius: 4px;
    flex: 1;
    text-align: center;
  }

  .is-allowed {
    border-color: #3eaf7c;
    background-color: rgba(62, 175, 124, 0.1);
  }
</style>
```

## Key Implementation Details

### Custom Sensor Setup

The heart of the implementation is within the `sensor.setup` function:

```js
sensor: {
  setup: (store) => {
    // Get current pointer position from the store
    const x = store.pointerPosition.current.value?.x ?? 0;
    const y = store.pointerPosition.current.value?.y ?? 0;

    // Use the browser's native method to get all elements at the pointer position
    const elements = document.elementsFromPoint(x, y);

    // Return all elements at that position
    return elements.length > 0 ? elements : null;
  },
}
```

This function:

1. Retrieves the current pointer position from the store
2. Uses the browser's `document.elementsFromPoint()` to get all elements at that position
3. Returns the elements array if it's not empty, or null otherwise

### What Happens Next

After your custom sensor returns elements:

1. The library will filter out elements that aren't registered as droppable zones
2. It will check group compatibility between the draggable and droppable elements
3. It will handle the appropriate visual feedback (hover states, etc.)
4. It will trigger the appropriate events when the drop occurs

## Additional Considerations

### Performance Optimization

For performance reasons, you might want to throttle your sensor function to limit how often it runs:

```js
sensor: {
  setup: (store) => {
    // Your custom detection logic
    // ...
  },
  throttle: 50 // Run at most every 50ms
}
```

### Custom Collision Logic

You could implement more advanced collision detection logic such as:

- Distance-based detection (detecting elements within a certain radius)
- Direction-based detection (only detecting elements in the direction of movement)
- Grid-based snapping (snapping to a virtual grid)
- Semantic-based detection (using data attributes to determine compatibility)

## Practical Applications

Custom sensors are useful for:

- Creating specialized UI patterns that need different collision behavior
- Implementing grid-based layouts where elements should snap to grid positions
- Creating distance-based interactions where proximity matters more than overlap
- Building accessible interfaces with specialized collision detection for keyboard navigation
- Optimizing performance for specific scenarios where the default algorithm is too intensive

## Conclusion

Custom collision sensors give you fine-grained control over how draggable elements interact with drop zones. While the default algorithm works well for most cases, implementing your own sensor allows you to create unique and specialized drag and drop experiences.
