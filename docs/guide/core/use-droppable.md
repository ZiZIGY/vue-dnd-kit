# useDroppable

`useDroppable` is a core composable that creates a drop zone where draggable elements can be dropped. It manages drop zone registration, hover states, and determines which draggable elements are allowed to be dropped.

## API Reference

### Options

```ts
useDroppable(options?: IUseDropOptions)
```

The `options` object can include the following properties:

| Property | Type               | Description                                 | Required |
| -------- | ------------------ | ------------------------------------------- | -------- |
| id       | `string \| number` | Unique identifier for the drop zone         | No       |
| groups   | `string[]`         | Groups this drop zone accepts               | No       |
| events   | `Object`           | Event handlers (see Events section)         | No       |
| data     | `Object`           | Custom data to associate with the drop zone | No       |

#### Events Object

| Event   | Type                                               | Description                                     |
| ------- | -------------------------------------------------- | ----------------------------------------------- |
| onHover | `(store: IDnDStore, payload: IDnDPayload) => void` | Called when a draggable hovers over this zone   |
| onLeave | `(store: IDnDStore, payload: IDnDPayload) => void` | Called when a draggable leaves this zone        |
| onDrop  | `(store: IDnDStore, payload: IDnDPayload) => void` | Called when a draggable is dropped in this zone |

All event handlers receive the entire drag and drop store and a payload object as parameters, giving you access to all current drag state.

#### Payload Object

The `payload` parameter provides access to all dragging elements:

| Property | Type                 | Description                         |
| -------- | -------------------- | ----------------------------------- |
| items    | `IDraggingElement[]` | Array of all elements being dragged |

#### Data Object

| Property | Type    | Description                                       |
| -------- | ------- | ------------------------------------------------- |
| source   | `any[]` | Array reference this drop zone is associated with |
| [key]    | `any`   | Any additional custom data                        |

### Return Value

`useDroppable` returns an object with the following properties:

| Property   | Type                       | Description                                               |
| ---------- | -------------------------- | --------------------------------------------------------- |
| elementRef | `Ref<HTMLElement \| null>` | Template ref to attach to the drop zone element           |
| isOvered   | `ComputedRef<boolean>`     | Whether a compatible draggable is hovering over this zone |
| isAllowed  | `ComputedRef<boolean>`     | Whether the current draggable can be dropped in this zone |

## Handling Drop Events

The most common pattern for handling drops is to use the `onDrop` event handler with the `DnDOperations` utility:

```ts
const { elementRef } = useDroppable({
  groups: ['items'],
  data: {
    source: targetArray,
  },
  events: {
    onDrop: (store, payload) => {
      // Access dragged elements from payload
      const draggedItem = payload.items[0];
      console.log('Dropped item data:', draggedItem.data);

      // Apply the drag operation to update arrays
      DnDOperations.applyMove(store);

      // Or use other operations like:
      // DnDOperations.applyTransfer(store);
    },
  },
});
```

## Groups

The grouping system determines which draggable elements can interact with this drop zone. The drop zone will only accept draggable elements that share at least one group with it.

```ts
// A drop zone that accepts elements from the 'documents' group
const { elementRef } = useDroppable({
  groups: ['documents'],
});

// A drop zone that accepts elements from multiple groups
const { elementRef } = useDroppable({
  groups: ['images', 'media', 'files'],
});
```

## Styling Drop Zones

You can use the reactive state to apply visual feedback:

```html
<div
  ref="elementRef"
  class="drop-zone"
  :class="{
    'drop-zone--active': isOvered,
    'drop-zone--valid': isAllowed
  }"
>
  Drop items here
</div>
```

## Event Handling with Payload

The payload parameter makes it easier to access the dragged elements:

```ts
const { elementRef } = useDroppable({
  groups: ['tasks'],
  events: {
    onDrop: (store, payload) => {
      // Access the first dragged element
      const draggedTask = payload.items[0].data.task;

      // Apply the transfer and update your state
      DnDOperations.applyTransfer(store);
      taskStore.moveTask(draggedTask, targetColumn.id);
    },
    onHover: (store, payload) => {
      // You can also use payload in hover events
      const hoveredItems = payload.items;
      console.log(`Hovering ${hoveredItems.length} items`);
    },
  },
});
```

## Important Notes

1. The `elementRef` must be bound to your drop zone element in the template.
2. All event handlers receive the complete drag and drop store and a payload object as parameters.
3. The `isOvered` computed value is true only when a compatible draggable (one that shares at least one group) is over the zone.
4. If groups don't match, neither `isOvered` nor `isAllowed` will be true, even if a draggable is physically over the zone.
5. When multiple drop zones overlap, only the topmost one will receive events.
6. To ensure proper reactivity, especially for dynamic content, wrap the `data` property in a `computed()`:

```ts
import { computed } from 'vue';

const { elementRef } = useDroppable({
  groups: ['items'],
  data: computed(() => ({
    source: targetArray,
    // other data properties
  })),
});
```
