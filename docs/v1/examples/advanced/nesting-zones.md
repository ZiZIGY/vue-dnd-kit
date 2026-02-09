# Nested Drop Zones

This example demonstrates how to create nested drop zones, where draggable elements can be dropped into hierarchical containers.

<script setup>
import Example from '@examples/NestingZones/Example.vue';
</script>

## Overview

The Nested Drop Zones example shows how to implement a hierarchy of drop zones, each capable of receiving draggable elements. This pattern is useful for building interfaces like folder structures, nested components, or any UI that requires hierarchical organization.

<Example />

## Key Concepts

- Creating nested drop zones with appropriate event handling
- Managing state to track where elements are dropped
- Propagating drop events through component hierarchy
- Visual feedback for active drop zones
- Conditional rendering based on drop state

## Example Code

### Draggable Component

```vue
<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';

  const emit = defineEmits<{
    (e: 'end'): void;
  }>();

  const { elementRef, isDragging } = useDraggable({
    events: {
      onEnd: () => emit('end'),
    },
  });
</script>

<template>
  <div
    ref="elementRef"
    class="draggable"
    :class="{ 'is-dragging': isDragging }"
  >
    drop me in any zone
  </div>
</template>

<style scoped>
  .draggable {
    padding: 1rem;
    border-radius: 6px;
    background-color: rgba(62, 175, 124);
  }

  .is-dragging {
    opacity: 0.5;
  }
</style>
```

### Drop Zone Component

```vue
<script setup lang="ts">
  import { useDroppable } from '@vue-dnd-kit/core';

  const emit = defineEmits<{
    (e: 'drop'): void;
  }>();

  const { elementRef, isOvered } = useDroppable({
    events: {
      onDrop: () => emit('drop'),
    },
  });
</script>

<template>
  <div
    ref="elementRef"
    class="zone"
    :class="{ 'is-overed': isOvered }"
  >
    <slot />
  </div>
</template>

<style scoped>
  .zone {
    width: 100%;
    height: 100%;
    padding: 1rem;
    border: 1px dashed rgba(62, 175, 124, 0.3);
    border-radius: 6px;
    background-color: rgba(62, 175, 124, 0.1);
  }

  .is-overed {
    background-color: rgba(62, 175, 124, 0.2);
  }
</style>
```

### Main Example Component

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import Zone from './Zone.vue';
  import Draggable from './Draggable.vue';

  // Track which zone the draggable is currently in
  const droppedId = ref<number>(0);
</script>

<template>
  <div class="container">
    <Draggable
      v-if="droppedId === 0"
      @end="droppedId = 0"
    />

    <Zone @drop="droppedId = 1">
      first zone
      <Draggable
        v-if="droppedId === 1"
        @end="droppedId = 0"
      />

      <Zone @drop="droppedId = 2">
        second zone

        <Draggable
          v-if="droppedId === 2"
          @end="droppedId = 0"
        />

        <Zone @drop="droppedId = 3">
          third zone

          <Draggable
            v-if="droppedId === 3"
            @end="droppedId = 0"
          />
        </Zone>
      </Zone>
    </Zone>
  </div>
</template>
```

## How It Works

This example demonstrates several important concepts:

1. **Nested Drop Zones**: Each drop zone can contain other drop zones, creating a hierarchy.
2. **Event Propagation**: When a draggable is dropped, the zone emits a `drop` event that the parent component can listen for.
3. **State Management**: The `droppedId` ref tracks which zone currently contains the draggable element.
4. **Conditional Rendering**: The draggable is rendered inside the zone where it was last dropped using `v-if` directives.
5. **Reset Mechanism**: When dragging ends, the draggable element emits an `end` event that resets its position to the initial state.

## Handling Drop Events

The key to this implementation is how drop events are handled:

```vue
<Zone @drop="droppedId = 1">
  first zone
  <Draggable
    v-if="droppedId === 1"
    @end="droppedId = 0"
  />
  <!-- More nested zones -->
</Zone>
```

Each zone has an associated ID. When a drop occurs in that zone, the `droppedId` is updated to match, which causes the draggable to render inside that zone.

## Event Handling Pattern

Note how we're using events to communicate between components:

1. The **Drop Zone** emits a `drop` event when something is dropped into it:

   ```js
   events: {
     onDrop: () => emit('drop'),
   }
   ```

2. The **Draggable** emits an `end` event when dragging ends:

   ```js
   events: {
     onEnd: () => emit('end'),
   }
   ```

This pattern allows for clean communication between components without tight coupling.

## Practical Applications

This nested drop zones pattern is useful for:

- File and folder management interfaces
- Organization charts or hierarchical data visualization
- Content management systems
- Visual programming interfaces
- Component-based page builders
