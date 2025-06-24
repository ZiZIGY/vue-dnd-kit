<script setup>
import Example from '@examples/Disabled/Example.vue';
</script>

# Disabled Elements

This example demonstrates how to disable draggable elements and drop zones in your drag and drop interface, allowing you to control when users can interact with specific components.

## Overview

The Disabled Elements example shows how to use the `disabled` option with `useDraggable` and `useDroppable` composables to temporarily or conditionally prevent drag and drop operations.

<Example />

## Key Concepts

- Disabling draggable elements conditionally
- Disabling drop zones conditionally
- Providing visual feedback for disabled states
- Using reactive references to control disabled state

## Basic Usage

```vue
<script setup>
  import { useDroppable, useDraggable } from '@vue-dnd-kit/core';
  import { ref, shallowRef } from 'vue';

  const draggableDisabled = shallowRef(false);
  const droppableDisabled = shallowRef(false);

  const { elementRef, handleDragStart } = useDraggable({
    disabled: draggableDisabled,
  });

  const { elementRef: droppableElementRef } = useDroppable({
    disabled: droppableDisabled,
    events: {
      onDrop: () => alert('Item dropped!'),
    },
  });
</script>

<template>
  <div class="controls">
    <div class="control-group">
      <label>
        <input
          type="checkbox"
          v-model="draggableDisabled"
        />
        Disable draggable element
      </label>
    </div>
    <div class="control-group">
      <label>
        <input
          type="checkbox"
          v-model="droppableDisabled"
        />
        Disable drop zone
      </label>
    </div>
  </div>

  <div class="example-area">
    <div
      ref="elementRef"
      @pointerdown="handleDragStart"
      class="draggable-item"
      :class="{ disabled: draggableDisabled }"
    >
      Drag me to the zone
      <div class="status-badge">
        {{ draggableDisabled ? 'Disabled' : 'Active' }}
      </div>
    </div>

    <div
      ref="droppableElementRef"
      class="droppable-zone"
      :class="{ disabled: droppableDisabled }"
    >
      Drop zone
      <div class="status-badge">
        {{ droppableDisabled ? 'Disabled' : 'Active' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .controls {
    margin-bottom: 1.5rem;
    display: flex;
    gap: 1rem;
  }

  .draggable-item {
    padding: 1rem;
    background-color: #3eaf7c;
    color: white;
    border-radius: 6px;
    cursor: grab;
    user-select: none;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .draggable-item.disabled {
    background-color: #82c7a5;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .droppable-zone {
    padding: 2rem;
    background-color: #f3f4f6;
    border: 2px dashed #d1d5db;
    border-radius: 6px;
    min-width: 200px;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
  }

  .droppable-zone.disabled {
    background-color: #e5e7eb;
    border-color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .status-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    background-color: rgba(255, 255, 255, 0.2);
  }

  .droppable-zone .status-badge {
    background-color: rgba(0, 0, 0, 0.1);
    color: #4b5563;
  }
</style>
```

## Implementation Guide

When implementing disabled states for drag and drop elements:

1. Use reactive references to track disabled state:

   ```js
   const draggableDisabled = shallowRef(false);
   ```

2. Pass these references to the `disabled` option in composables:

   ```js
   const { elementRef } = useDraggable({
     disabled: draggableDisabled,
   });
   ```

3. Apply visual styling to indicate disabled state:

   ```html
   <div :class="{ disabled: draggableDisabled }">...</div>
   ```

4. Provide clear visual feedback to users about the current state

## Using Computed Properties for Reactivity

If you encounter reactivity issues with the `disabled` property, consider using a computed property:

```js
import { computed } from 'vue';

// Define your condition
const isReadOnly = ref(false);
const hasPermission = ref(false);

// Create a computed property that combines multiple conditions
const draggableDisabled = computed(() => {
  return isReadOnly.value || !hasPermission.value;
});

// Pass the computed property to the useDraggable composable
const { elementRef } = useDraggable({
  disabled: draggableDisabled,
});
```

This approach is particularly useful when:

- The disabled state depends on multiple conditions
- The disabled state needs to be derived from props or store values
- You need to ensure the disabled state always stays reactive to dependency changes

## Component Wrappers and Prop Passing

When creating reusable draggable components, you might need to handle the `disabled` property being passed as a prop. In these cases, using computed properties ensures proper reactivity:

```vue
<!-- Draggable.vue -->
<script setup>
  import { useDraggable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const props = defineProps({
    disabled: {
      type: Boolean,
      default: false,
    },
    // Other props...
  });

  // Create a computed property to ensure reactivity
  const isDisabled = computed(() => props.disabled);

  const { elementRef, handleDragStart } = useDraggable({
    disabled: isDisabled,
    // Other options...
  });
</script>

<template>
  <div
    ref="elementRef"
    @pointerdown="handleDragStart"
    :class="{ 'is-disabled': isDisabled }"
  >
    <slot></slot>
  </div>
</template>
```

This pattern is essential when:

- Building component libraries with draggable elements
- Creating wrapper components around the core functionality
- Ensuring props passed from parent components maintain their reactivity

Disabling elements is useful for implementing conditional drag and drop behavior based on application state, user permissions, or other business logic requirements.
