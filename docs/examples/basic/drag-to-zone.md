<script setup>
import DragToZone from '@examples/DragToZone.vue';
</script>

# Drag to Zone

This example demonstrates how to create an element that can be dragged into a designated drop zone.

## Overview

The Drag to Zone example shows how to use both `useDraggable` and `useDroppable` composables together to create drag and drop interactions. When the draggable element is dropped onto the drop zone, a visual confirmation appears.

<DragToZone/>

## Key Concepts

- Creating a draggable element with `useDraggable`
- Defining a drop zone with `useDroppable`
- Handling drop events
- Providing visual feedback for user interactions

## Basic Usage

```vue
<script setup>
  import { useDraggable, useDroppable } from '@vue-dnd-kit/core';
  import { ref } from 'vue';

  const { elementRef, isDragging, handleDragStart } = useDraggable();

  const dropped = ref(false);

  const { elementRef: droppableRef, isOvered } = useDroppable({
    events: {
      onDrop: () => {
        dropped.value = true;
      },
    },
  });
</script>

<template>
  <div class="flex">
    <div
      v-if="!dropped"
      ref="elementRef"
      :class="{ dragging: isDragging }"
      class="draggable"
      @pointerdown="handleDragStart"
    >
      Drag me!
    </div>

    <div
      ref="droppableRef"
      :class="{ dropped, over: isOvered }"
      class="box"
    >
      {{ dropped ? 'Dropped!' : 'Drop here' }}
    </div>
  </div>
</template>

<style scoped>
  .flex {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
  }

  .draggable {
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background-color: #000;

    transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .box {
    transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    padding: 16px;
    border-radius: 8px;
    border: 2px solid transparent;
  }

  .dragging {
    opacity: 0;
    height: 0px;
  }

  .dropped {
    background-color: #000;
    color: #fff;
  }
  .over {
    border: 2px solid #000;
    color: #fff;
  }
</style>
```

## Next Steps

After mastering how to drag to a drop zone, you can explore:

- Creating sortable lists
- Multiple drop zones
- Conditional drop acceptance
- Custom drag overlays
