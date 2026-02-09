# useDraggable

`useDraggable` is a core composable that transforms an element into a draggable item. It handles all the drag state management, events, and DOM interactions necessary for drag operations.

## API Reference

### Options

```ts
useDraggable(options?: IUseDragOptions)
```

The `options` object can include the following properties:

| Property       | Type                      | Description                                     | Required |
| -------------- | ------------------------- | ----------------------------------------------- | -------- |
| id             | `string \| number`        | Unique identifier for the draggable element     | No       |
| groups         | `string[]`                | Groups this draggable belongs to                | No       |
| disabled       | `boolean \| Ref<boolean>` | Whether dragging is disabled                    | No       |
| events         | `Object`                  | Event handlers (see Events section)             | No       |
| data           | `Object`                  | Custom data to associate with draggable element | No       |
| keyboard       | `Object`                  | Keyboard navigation configuration               | No       |
| container      | `Component`               | Custom overlay component                        | No       |
| layer          | `Component \| null`       | Custom layer component                          | No       |
| containerProps | `Record<string, any>`     | Props to pass to the drag container component   | No       |
| sensor         | `Object`                  | Custom sensor configuration                     | No       |

#### Events Object

| Event   | Type                                               | Description                             |
| ------- | -------------------------------------------------- | --------------------------------------- |
| onStart | `(store: IDnDStore, payload: IDnDPayload) => void` | Called when drag operation starts       |
| onMove  | `(store: IDnDStore, payload: IDnDPayload) => void` | Called when draggable element is moving |
| onHover | `(store: IDnDStore, payload: IDnDPayload) => void` | Called when hovering over a target      |
| onLeave | `(store: IDnDStore, payload: IDnDPayload) => void` | Called when leaving a target            |
| onEnd   | `(store: IDnDStore, payload: IDnDPayload) => void` | Called when drag operation ends         |

All event handlers receive the entire drag and drop store and a payload object as parameters.

#### Payload Object

The `payload` parameter provides access to all dragging elements:

| Property | Type                 | Description                         |
| -------- | -------------------- | ----------------------------------- |
| items    | `IDraggingElement[]` | Array of all elements being dragged |

#### Data Object

| Property | Type     | Description                                |
| -------- | -------- | ------------------------------------------ |
| source   | `any[]`  | Array reference holding the draggable item |
| index    | `number` | Index of the item in the source array      |
| [key]    | `any`    | Any additional custom data                 |

#### Keyboard Object

| Property | Type     | Description                                   |
| -------- | -------- | --------------------------------------------- |
| moveStep | `number` | Pixels to move when using keyboard navigation |

### Container Props

The `containerProps` option allows you to pass custom data and configuration to your drag container component. This is useful for customizing the appearance and behavior of the container during drag operations:

```ts
import { ref, computed } from 'vue';

const currentTheme = ref('dark');
const animationType = ref('fade');

const { elementRef } = useDraggable({
  id: 'my-draggable',
  containerProps: {
    // Static values
    theme: 'light',
    animation: 'slide',

    // Reactive values (pass refs directly)
    currentTheme: currentTheme,
    animationType: animationType,

    // Computed values
    style: computed(() => ({
      backgroundColor: currentTheme.value === 'dark' ? '#333' : '#fff',
      transition:
        animationType.value === 'fade' ? 'opacity 0.3s' : 'transform 0.3s',
    })),

    // Custom data
    customData: {
      userId: 123,
      itemType: 'task',
    },
  },
});
```

**Important**: When passing reactive values (ref, reactive, computed), pass them directly without calling `.value`. Vue will automatically track reactivity.

### Return Value

`useDraggable` returns an object with the following properties:

| Property        | Type                       | Description                                                           |
| --------------- | -------------------------- | --------------------------------------------------------------------- |
| elementRef      | `Ref<HTMLElement \| null>` | Template ref to attach to the draggable element                       |
| isDragging      | `ComputedRef<boolean>`     | Whether this element is currently being dragged                       |
| isOvered        | `ComputedRef<boolean>`     | Whether this element is being hovered over by a draggable             |
| isAllowed       | `ComputedRef<boolean>`     | Whether the current draggable can be dropped on this element          |
| isLazyAllowed   | `ComputedRef<boolean>`     | Similar to isAllowed, but only updates when hovering over the element |
| pointerPosition | `Object`                   | Current and initial pointer positions                                 |
| handleDragStart | `Function`                 | Function to start the drag operation                                  |
| id              | `string \| number`         | Unique identifier for this draggable                                  |

## Event Handling with Payload

You can use the payload parameter to easily access the dragged elements:

```ts
const { elementRef } = useDraggable({
  id: 'my-draggable',
  data: computed(() => ({
    task: props.task,
  })),
  containerProps: {
    theme: 'dark',
    animation: 'fade',
  },
  events: {
    onStart: (store, payload) => {
      // Access the first dragged element (most common scenario)
      const draggedElement = payload.items[0];
      console.log('Started dragging:', draggedElement.data);
    },
    onEnd: (store, payload) => {
      console.log('Number of items dragged:', payload.items.length);
    },
  },
});
```

### Drag Start

To initiate dragging, bind the `handleDragStart` function to the appropriate event:

```html
<div
  ref="elementRef"
  @pointerdown="handleDragStart"
>
  Drag me
</div>
```

For nested elements, use the `.self` modifier to prevent drag initiation from child elements:

```html
<div
  ref="elementRef"
  @pointerdown.self="handleDragStart"
>
  <span>This won't trigger drag</span>
  <div>Neither will this</div>
</div>
```

### Custom Drag Handles

Alternatively, you can implement custom drag handles for more explicit control:

```html
<div ref="elementRef">
  <div
    class="drag-handle"
    @pointerdown="handleDragStart"
  >
    :: Drag here
  </div>
  <div class="content">
    <!-- Content that doesn't trigger dragging -->
  </div>
</div>
```

### Keyboard Support

To support keyboard-based dragging (for accessibility), you can bind to keyboard events:

```html
<div
  ref="elementRef"
  @pointerdown.self="handleDragStart"
  @keydown.space.self="handleDragStart"
  tabindex="0"
>
  Drag me with mouse or space key
</div>
```

The `.self` modifier works similarly with keyboard events, preventing nested focusable elements from triggering drag operations.

You can customize which keys trigger drag operations by changing the key modifier (e.g., `.enter`, `.space`).

## Groups

The grouping system determines which drop zones a draggable element can interact with. Only drop zones that share at least one group with the draggable element will accept it.

```ts
// A draggable that belongs to the 'fruits' group
const { elementRef } = useDraggable({
  groups: ['fruits'],
});

// A draggable that belongs to multiple groups
const { elementRef } = useDraggable({
  groups: ['documents', 'images'],
});
```

## Important Notes

1. The `elementRef` must be bound to your draggable element in the template.
2. All event handlers receive the complete drag and drop store and a payload object as parameters.
3. For more precise control over drag triggers, use Vue's event modifiers (`.self`, `.stop`, etc.).
4. Always add `tabindex="0"` to draggable elements when implementing keyboard support.
5. Use the `isDragging` computed value to apply visual feedback during drag operations.
6. The `isLazyAllowed` property is useful for optimizing performance with complex validation logic, as it only updates when hovering:

```html
<div
  ref="elementRef"
  class="draggable"
  :class="{
    'draggable--dragging': isDragging,
    'draggable--allowed': isLazyAllowed // Only updates on hover
  }"
  @pointerdown="handleDragStart"
>
  Drag me
</div>
```

7. To ensure proper reactivity, especially for dynamic content, wrap the `data` property in a `computed()`:

## Handling Reactivity Issues

If you're encountering reactivity problems with dynamic properties like `disabled` or `data`, wrap them in a `computed()` property:

```ts
import { computed, ref } from 'vue';

const isDragDisabled = ref(false);

const { elementRef } = useDraggable({
  id: 'my-draggable',
  disabled: computed(() => isDragDisabled.value),
  data: computed(() => ({
    source: itemsArray,
    index: props.itemIndex,
    task: props.task,
    status: currentStatus.value,
  })),
  containerProps: {
    theme: computed(() => currentTheme.value),
    animation: computed(() => animationType.value),
  },
});
```

This ensures Vue correctly tracks dependencies and updates the draggable behavior when your reactive values change.

8. **Container Props**: Use the `containerProps` option to pass custom data and configuration to your drag container component. This allows for dynamic customization of the container during drag operations.
