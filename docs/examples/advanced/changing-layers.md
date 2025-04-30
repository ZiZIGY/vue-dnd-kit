# Custom Draggable Layers

This example demonstrates how to customize the appearance of draggable elements by providing custom layer components, allowing for rich visual representations during drag operations.

<script setup>
import Example from '@examples/ChangingLayers/Example.vue';
</script>

## Overview

The Custom Draggable Layers example shows how to replace the default appearance of dragged elements with completely custom Vue components. The library natively supports layers without requiring a custom overlay container - simply pass your layer component to the `useDraggable` composable.

<Example />

## Key Concepts

- Creating custom layer components for draggable elements
- Using the `layer` prop to specify custom representations
- Native layer support without needing a custom container
- Using `markRaw` to optimize performance when passing component references

## Example Code

### Draggable Component with Layer Support

```vue
<script setup lang="ts">
  import { useDraggable, useSelection } from '@vue-dnd-kit/core';
  import { type Component } from 'vue';

  const { layer } = defineProps<{
    layer?: Component;
  }>();

  // The layer will be used automatically by the default container
  const { elementRef, handleDragStart } = useDraggable({
    layer,
  });

  const { handleToggleSelect, isSelected } = useSelection(elementRef);
</script>

<template>
  <div
    ref="elementRef"
    class="draggable"
  >
    <div class="draggable-actions">
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
        :checked="isSelected"
        type="checkbox"
        @change="handleToggleSelect"
      />
    </div>
    <slot />
  </div>
</template>
```

### Custom Layer Component

```vue
<script setup lang="ts">
  import { TLayerProps } from '@vue-dnd-kit/core';

  const props = defineProps<TLayerProps>();
</script>

<template>
  <div>
    <img
      src="https://raw.githubusercontent.com/ZiZiGY/vue-dnd-kit/master/public/logo.svg"
      alt="logo"
    />
    {{ props.id }}
  </div>
</template>
```

### Example Usage

```vue
<script setup lang="ts">
  import { markRaw } from 'vue';
  import Draggable from './Draggable.vue';
  import Layer from './Layer.vue';
</script>

<template>
  <div class="example-container">
    <Draggable> im default </Draggable>
    <Draggable :layer="markRaw(Layer)"> im with custom layer </Draggable>
  </div>
</template>

<style scoped>
  .example-container {
    display: flex;
    gap: 12px;
    flex-direction: column;
  }
</style>
```

## How It Works

Vue DnD Kit provides native support for custom layers:

1. **Built-in Support**: The library natively renders your custom layers without requiring a custom overlay container
2. **Component Props**: Your layer component receives useful props like `id` through the `TLayerProps` interface
3. **Default Fallback**: Without a custom layer, the dragged element uses its original HTML
4. **Multiple Items**: Each draggable can have its own custom layer for different visual representations

## Using markRaw for Component References

When passing component references to the `layer` prop, always use `markRaw()` to prevent Vue from making the component reactive:

```js
// Correct - use markRaw
import { markRaw } from 'vue';
import CustomLayer from './CustomLayer.vue';

<Draggable :layer="markRaw(CustomLayer)">
  Default content
</Draggable>

// Incorrect - will cause warnings and performance issues
<Draggable :layer="CustomLayer">
  Default content
</Draggable>
```

## Working with Custom Containers

If you decide to use a custom overlay container, you'll need to handle layers yourself. Here's a simple example of how you might implement this:

```vue
<!-- CustomOverlayContainer.vue -->
<script setup>
  import { useDragContainer } from '@vue-dnd-kit/core';

  const { elementRef, pointerPosition, draggingElements } = useDragContainer();

  // Your positioning logic here
  const computedStyle = computed(() => ({
    // Transform, position, etc.
  }));
</script>

<template>
  <div
    ref="elementRef"
    :style="computedStyle"
  >
    <template v-for="[_, element] in draggingElements">
      <!-- Render the custom layer if available -->
      <component
        v-if="element.layer"
        :is="element.layer"
        :id="element.id"
      />
      <!-- Fallback to the original HTML -->
      <div
        v-else
        v-html="element.initialHTML"
      ></div>
    </template>
  </div>
</template>
```

This technique gives you complete control over how your dragged elements appear, allowing for rich, contextual visual feedback during drag operations.
