# useDraggable

`useDraggable` is a core composable that transforms an element into a draggable item. It handles all the drag state management, events, and DOM interactions necessary for drag operations.

## API Reference

### Options

```ts
useDraggable(options?: IUseDragOptions)
```

The `options` object can include the following properties:

| Property  | Type                | Description                                     | Required |
| --------- | ------------------- | ----------------------------------------------- | -------- |
| id        | `string \| number`  | Unique identifier for the draggable element     | No       |
| groups    | `string[]`          | Groups this draggable belongs to                | No       |
| events    | `Object`            | Event handlers (see Events section)             | No       |
| data      | `Object`            | Custom data to associate with draggable element | No       |
| keyboard  | `Object`            | Keyboard navigation configuration               | No       |
| container | `Component`         | Custom overlay component                        | No       |
| layer     | `Component \| null` | Custom layer component                          | No       |
| sensor    | `Object`            | Custom sensor configuration                     | No       |

#### Events Object

| Event   | Type                         | Description                             |
| ------- | ---------------------------- | --------------------------------------- |
| onStart | `(store: IDnDStore) => void` | Called when drag operation starts       |
| onMove  | `(store: IDnDStore) => void` | Called when draggable element is moving |
| onHover | `(store: IDnDStore) => void` | Called when hovering over a target      |
| onLeave | `(store: IDnDStore) => void` | Called when leaving a target            |
| onEnd   | `(store: IDnDStore) => void` | Called when drag operation ends         |

All event handlers receive the entire drag and drop store as a parameter, giving you access to all current drag state.

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

### Return Value

`useDraggable` returns an object with the following properties:

| Property        | Type                       | Description                                                  |
| --------------- | -------------------------- | ------------------------------------------------------------ |
| elementRef      | `Ref<HTMLElement \| null>` | Template ref to attach to the draggable element              |
| isDragging      | `ComputedRef<boolean>`     | Whether this element is currently being dragged              |
| isOvered        | `ComputedRef<boolean>`     | Whether this element is being hovered over by a draggable    |
| isAllowed       | `ComputedRef<boolean>`     | Whether the current draggable can be dropped on this element |
| pointerPosition | `Object`                   | Current and initial pointer positions                        |
| handleDragStart | `Function`                 | Function to start the drag operation                         |
| id              | `string \| number`         | Unique identifier for this draggable                         |

## Event Handling

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
2. All event handlers receive the complete drag and drop store as a parameter.
3. For more precise control over drag triggers, use Vue's event modifiers (`.self`, `.stop`, etc.).
4. Always add `tabindex="0"` to draggable elements when implementing keyboard support.
5. Use the `isDragging` computed value to apply visual feedback during drag operations.
6. To ensure proper reactivity, especially for dynamic content, wrap the `data` property in a `computed()`:

```ts
import { computed } from 'vue';

const { elementRef } = useDraggable({
  groups: ['items'],
  data: computed(() => ({
    source: myArray,
    index: myIndex,
    // other data properties
  })),
});
```
