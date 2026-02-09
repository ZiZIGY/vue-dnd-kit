# Grouping Drag and Drop Elements

This example demonstrates how to use groups to control which draggable elements can be dropped into specific drop zones.

<script setup>
import Example from '@examples/Groups/Example.vue';
</script>

## Overview

The Grouping example shows how to implement a group-based permission system for drag and drop interactions. By assigning groups to both draggable elements and drop zones, you can control which elements are allowed to be dropped where.

<Example />

## Key Concepts

- Using groups to define compatibility between draggable elements and drop zones
- Restricting drop zones to only accept specific draggable elements
- Assigning multiple groups to elements for more flexible permissions
- Visual feedback for compatible and incompatible drop zones
- Implementing drag and drop validation rules

## Example Code

### Draggable Component with Groups

```vue
<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';

  const { groups } = defineProps<{
    groups: string[];
  }>();

  const emit = defineEmits<{
    (e: 'end'): void;
  }>();

  const { elementRef, isDragging, handleDragStart } = useDraggable({
    groups,
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
    @pointerdown="handleDragStart"
  >
    drag me
  </div>
</template>

<style scoped>
  .draggable {
    padding: 1rem;
    border-radius: 6px;
    background-color: rgba(62, 175, 124);
    touch-action: none;
  }

  .is-dragging {
    opacity: 0.5;
  }
</style>
```

### Droppable Component with Groups

```vue
<script setup lang="ts">
  import { useDroppable } from '@vue-dnd-kit/core';

  const emit = defineEmits<{
    (e: 'drop'): void;
  }>();

  const { groups } = defineProps<{
    groups: string[];
  }>();

  const { elementRef, isOvered, isAllowed } = useDroppable({
    groups,
    events: {
      onDrop: () => emit('drop'),
    },
  });
</script>

<template>
  <div
    ref="elementRef"
    class="droppable"
    :class="{
      'is-overed': isOvered,
      'is-allowed': isAllowed,
    }"
  >
    <p>
      Group
      <kbd
        v-for="group in groups"
        :key="group"
      >
        {{ group }}
      </kbd>
    </p>

    <slot />
  </div>
</template>

<style scoped>
  .droppable {
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

  .is-allowed {
    background-color: rgba(62, 175, 124, 0.3);
  }

  kbd {
    background-color: #fafafa;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 0.2rem 0.4rem;
    font-size: 0.8rem;
    font-weight: 500;
    color: #333;
  }
</style>
```

### Main Example Component

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import Droppable from './Droppable.vue';
  import Draggable from './Draggable.vue';

  const dropped = ref<string | null>(null);
</script>

<template>
  <div class="container">
    <Draggable
      v-if="!dropped"
      :groups="['a']"
    />

    <div class="droppable-container">
      <Droppable
        :groups="['b']"
        @drop="dropped = 'b'"
      >
        <Draggable
          v-if="dropped === 'b'"
          :groups="['b']"
          @end="dropped = null"
        />
      </Droppable>

      <Droppable
        :groups="['a']"
        @drop="dropped = 'a'"
      >
        <Draggable
          v-if="dropped === 'a'"
          :groups="['a']"
          @end="dropped = null"
        />
      </Droppable>
    </div>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    gap: 1rem;
    flex-direction: column;
  }

  .droppable-container {
    display: flex;
    gap: 1rem;
    flex-direction: column;
  }
</style>
```

## How It Works

The grouping system works through a simple matching mechanism:

1. **Group Assignment**: Both draggable elements and drop zones are assigned one or more groups through the `groups` prop.

2. **Compatibility Check**: A draggable element can only be dropped into a drop zone if they share at least one group.

3. **Visual Feedback**: The library provides two reactive states for visual feedback:

   - `isOvered`: True when the draggable is hovering over the drop zone
   - `isAllowed`: True when the draggable is compatible with the drop zone (shares at least one group)

4. **State Management**: In this example, we're using a `dropped` ref to track where the draggable has been dropped, and conditionally render it in the appropriate drop zone.

## Group Matching Rules

The rules for group matching are straightforward:

- If a draggable has groups `['a']` and a droppable has groups `['a']`, they are compatible.
- If a draggable has groups `['a', 'b']` and a droppable has groups `['b', 'c']`, they are compatible because they share group 'b'.
- If a draggable has groups `['a']` and a droppable has groups `['b']`, they are incompatible.
- **Universal Compatibility**: If either the draggable or droppable has no groups (prop not specified or empty array `[]`), they are considered "universal" and compatible with any element. This means:
  - A draggable without groups can be dropped into any drop zone
  - A drop zone without groups can accept any draggable element

## Example Usage

Here's how to use groups in different scenarios:

```vue
<!-- Only items in both groups 'files' and 'images' can be dropped here -->
<Droppable :groups="['files', 'images']">
  Images Folder
</Droppable>

<!-- This file can be dropped into any drop zone that accepts 'documents' -->
<Draggable :groups="['documents']">
  Document.pdf
</Draggable>

<!-- This file can be dropped into drop zones that accept either 'images' or 'media' -->
<Draggable :groups="['images', 'media']">
  Photo.jpg
</Draggable>

<!-- Universal draggable - can be dropped anywhere (empty array or prop not specified) -->
<Draggable>
  Universal Item
</Draggable>

<!-- Universal drop zone - accepts any draggable element (empty array or prop not specified) -->
<Droppable>
  Universal Drop Zone
</Droppable>
```

## Practical Applications

The grouping feature is useful for:

- File management systems (restricting which file types can go in which folders)
- Component-based page builders (limiting which components can be placed in specific areas)
- Task management boards (controlling which types of tasks can go in which columns)
- Form builders (restricting which form elements can be used in different sections)
- Data visualization tools (controlling which data points can be associated with certain visualizations)
