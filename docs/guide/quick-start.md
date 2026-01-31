# Quick Start

This guide will help you create your first drag and drop interface with Vue DnD Kit. We'll build a simple draggable element that can be moved around the screen.

## Prerequisites

Before you begin, make sure you have:

1. Installed Vue DnD Kit as described in the [Installation](/guide/installation) guide
2. Registered the Vue DnD Kit plugin in your main application file

## Basic Draggable Element

Let's start by creating a simple draggable element:

```vue
<script setup>
  import { useDraggable } from '@vue-dnd-kit/core';

  const { elementRef, isDragging, handleDragStart } = useDraggable({
    id: 'my-draggable',
  });
</script>

<template>
  <div
    ref="elementRef"
    :class="{ dragging: isDragging }"
    @pointerdown="handleDragStart"
  >
    Drag me!
  </div>
</template>

<style scoped>
  div {
    padding: 20px;
    background-color: #4caf50;
    color: white;
    border-radius: 4px;
    cursor: grab;
    user-select: none;
    width: 150px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .dragging {
    opacity: 0.8;
    cursor: grabbing;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
</style>
```

This creates a green box that you can drag around the screen. When dragging, it becomes slightly transparent and the shadow changes to indicate the dragging state.

## Creating a Drop Zone

Now, let's create a drop zone where our draggable element can be dropped:

```vue
<script setup>
  import { useDraggable, useDroppable } from '@vue-dnd-kit/core';

  const {
    elementRef: draggableRef,
    isDragging,
    handleDragStart,
  } = useDraggable({
    id: 'my-draggable',
  });

  const { elementRef: dropzoneRef, isOvered } = useDroppable({
    id: 'my-dropzone',
  });
</script>

<template>
  <div class="container">
    <div
      ref="draggableRef"
      :class="{ dragging: isDragging }"
      @pointerdown="handleDragStart"
    >
      Drag me to the drop zone!
    </div>

    <div
      ref="dropzoneRef"
      :class="{ over: isOvered }"
      class="dropzone"
    >
      Drop here
    </div>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    gap: 20px;
    padding: 20px;
  }

  div {
    padding: 20px;
    border-radius: 4px;
    user-select: none;
    text-align: center;
  }

  div[ref='draggableRef'] {
    background-color: #4caf50;
    color: white;
    cursor: grab;
    width: 150px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .dragging {
    opacity: 0.8;
    cursor: grabbing;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  .dropzone {
    background-color: #f5f5f5;
    border: 2px dashed #ccc;
    width: 200px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .over {
    background-color: #e0f7fa;
    border-color: #00bcd4;
  }
</style>
```

Now we have a draggable element and a drop zone. The drop zone changes its appearance when the draggable element is over it.

## Handling Drop Events

Let's enhance our example to handle drop events:

```vue
<script setup>
  import { ref } from 'vue';
  import { useDraggable, useDroppable } from '@vue-dnd-kit/core';

  const message = ref('Drag the item to the drop zone');
  const isDropped = ref(false);

  const {
    elementRef: draggableRef,
    isDragging,
    handleDragStart,
  } = useDraggable({
    id: 'my-draggable',
  });

  const { elementRef: dropzoneRef, isOvered } = useDroppable({
    id: 'my-dropzone',
    events: {
      onDrop: () => {
        message.value = 'Item dropped successfully!';
        isDropped.value = true;
        setTimeout(() => {
          message.value = 'Drag the item to the drop zone again';
          isDropped.value = false;
        }, 2000);
      },
    },
  });
</script>

<template>
  <div class="container">
    <p>{{ message }}</p>

    <div class="content">
      <div
        ref="draggableRef"
        class="draggable"
        :class="{ dragging: isDragging, dropped: isDropped }"
        @pointerdown="handleDragStart"
      >
        {{ isDropped ? '✓' : 'Drag me!' }}
      </div>

      <div
        ref="dropzoneRef"
        :class="{ over: isOvered, dropped: isDropped }"
        class="dropzone"
      >
        Drop here
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  .content {
    display: flex;
    gap: 30px;
    margin-top: 20px;
  }

  p {
    font-size: 16px;
    color: #333;
    margin-bottom: 20px;
  }

  .draggable {
    padding: 20px;
    background-color: #4caf50;
    color: white;
    border-radius: 4px;
    cursor: grab;
    user-select: none;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }

  .dragging {
    opacity: 0.8;
    cursor: grabbing;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  .dropzone {
    padding: 20px;
    background-color: #f5f5f5;
    border: 2px dashed #ccc;
    border-radius: 4px;
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .over {
    background-color: #e0f7fa;
    border-color: #00bcd4;
  }

  .dropped {
    background-color: #e8f5e9;
    border-color: #4caf50;
    color: #4caf50;
    font-weight: bold;
  }

  .dropped {
    background-color: #4caf50;
    color: white;
    font-size: 24px;
  }
</style>
```

This example adds:

- A message that updates based on the interaction state
- Visual feedback when an item is successfully dropped
- A reset mechanism to allow repeated interactions
