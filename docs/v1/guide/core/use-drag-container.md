# useDragContainer

`useDragContainer` is a core composable that allows registering a custom container where dragged elements will be displayed. This composable gives users complete freedom to customize how dragged elements appear during drag operations.

## API Reference

### Usage

```ts
const result = useDragContainer();
```

The `useDragContainer` composable doesn't accept any parameters.

### Props Support

The drag container component can accept props using `defineProps()`. This allows you to pass custom data and configuration to your container component:

```vue
<script setup lang="ts">
  import { useDragContainer } from '@vue-dnd-kit/core';

  // Define props for your container
  const props = defineProps<{
    theme?: 'light' | 'dark';
    animation?: 'fade' | 'slide';
    customData?: any;
  }>();

  const { elementRef, isDragging, draggingElements } = useDragContainer();
</script>

<template>
  <div
    v-if="isDragging"
    ref="elementRef"
    class="drag-container"
    :class="{
      'drag-container--light': theme === 'light',
      'drag-container--dark': theme === 'dark',
      'drag-container--fade': animation === 'fade',
      'drag-container--slide': animation === 'slide',
    }"
  >
    <!-- Your dragged elements will be rendered here -->
  </div>
</template>
```

### Reactive Props

For reactive props, pass them in their reactive state without calling `.value`. You can use `ref`, `reactive`, or `computed`:

```vue
<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useDraggable } from '@vue-dnd-kit/core';

  // Reactive state
  const currentTheme = ref('light');
  const isAnimationEnabled = ref(true);
  const userPreferences = ref({ fontSize: 14, color: 'blue' });

  // Computed props
  const containerStyle = computed(() => ({
    fontSize: userPreferences.value.fontSize + 'px',
    color: userPreferences.value.color,
  }));

  const { elementRef } = useDraggable({
    id: 'my-draggable',
    containerProps: {
      // Pass refs directly (without .value)
      theme: currentTheme,
      animation: isAnimationEnabled,

      // Pass computed values
      style: containerStyle,

      // Pass reactive objects
      preferences: userPreferences,

      // Static values
      staticProp: 'always-the-same',
    },
  });
</script>
```

### Using Props with Dragged Elements

You can access container props within your dragged elements by passing them through the `containerProps` option in `useDraggable`:

```vue
<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';

  const { elementRef } = useDraggable({
    id: 'my-draggable',
    containerProps: {
      theme: 'dark',
      animation: 'fade',
      customData: { userId: 123 },
    },
  });
</script>
```

### Return Value

`useDragContainer` returns an object with the following properties:

| Property         | Type                       | Description                                           |
| ---------------- | -------------------------- | ----------------------------------------------------- |
| elementRef       | `Ref<HTMLElement \| null>` | Template ref to attach to the container element       |
| draggingElements | `Map<Element, any>`        | Map of all currently dragged elements                 |
| pointerPosition  | `Object`                   | Current and initial pointer positions during dragging |
| isDragging       | `ComputedRef<boolean>`     | Whether a drag operation is currently active          |

#### pointerPosition Object

The `pointerPosition` object includes:

| Property       | Type                  | Description                                |
| -------------- | --------------------- | ------------------------------------------ |
| start          | `Ref<IPoint \| null>` | Starting position when drag began          |
| current        | `Ref<IPoint \| null>` | Current pointer position during dragging   |
| offset.percent | `Ref<IPoint \| null>` | Offset as percentage of element dimensions |
| offset.pixel   | `Ref<IPoint \| null>` | Offset in pixels                           |

## Important Notes

1. The `elementRef` must be bound to your container element in the template.

2. The container is automatically registered with the DnD system on mount and unregistered on unmount.

3. For proper positioning of dragged elements, use the values from `pointerPosition`.

4. If you create multiple drag containers, the most recently mounted one will be active.

5. Containers typically use `pointer-events: none` to prevent interfering with normal interactions.

6. To handle multi-select effectively, check `draggingElements.size` to determine how many elements are being dragged.

7. The container should typically be positioned fixed or absolute and cover the entire viewport to ensure dragged elements are visible anywhere.

8. For performance reasons, apply `will-change: transform` to elements that will move during dragging.

9. You may want to conditionally show the container only when `isDragging` is true to improve performance.

10. **Props Support**: Container components can accept props using `defineProps()` and access them within the component template and logic.

11. **Container Props**: Use the `containerProps` option in `useDraggable` to pass custom data to your container component.

12. **Reactive Props**: When passing reactive values (ref, reactive, computed), pass them directly without calling `.value`. Vue will automatically track reactivity.
