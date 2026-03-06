# makeDraggable

`makeDraggable` turns an element into a draggable item. It must be used inside a [DnDProvider](/v2/guide/core/dnd-provider). Pass a template ref (or `useTemplateRef`) and optionally options and a payload.

## Signature

```ts
makeDraggable(ref, options?, payload?): IMakeDraggableReturnType
```

Overloads:

- **`makeDraggable(ref)`** — no options, no payload.
- **`makeDraggable(ref, options?)`** — optional options object.
- **`makeDraggable(ref, payload)`** — if the second argument is a **function**, it is treated as the payload (options are empty).
- **`makeDraggable(ref, options, payload?)`** — options and optional payload.

**`ref`** must be a ref to an HTML element (or component root element). The element is registered on mount and unregistered on unmount. Native `dragstart` / `drag` / `dragend` are prevented so the browser doesn't start its own drag.

---

## Return value

| Property     | Type                          | Description |
|-------------|--------------------------------|-------------|
| `selected`   | `WritableComputedRef<boolean>` | Whether this element is in the current selection. Can be read and written (e.g. for checkboxes). |
| `isDragging`| `ComputedRef<boolean>`         | `true` while this element is being dragged. |
| `isAllowed` | `ComputedRef<boolean>`         | `true` when this element is a valid drag target (visible, not disabled, groups match with currently dragging items). |
| `isDragOver`| `ComputedRef<IPlacement \| undefined>` | When another item is dragged over this one: placement flags `{ top, right, bottom, left, center }`. `undefined` when not hovered. Use for sort indicators and drop preview. |

---

## Options

Extends **base options** (shared with droppable/selection/constraint):

| Option      | Type                    | Description                                      |
|------------|--------------------------|--------------------------------------------------|
| `disabled` | `boolean \| Ref<boolean>` | When true, the element is not draggable.         |
| `groups`   | `string[] \| Ref<string[]>` | Groups for matching with droppables (same group = can drop). |

**Draggable-specific options:**

| Option             | Type                    | Description |
|--------------------|-------------------------|-------------|
| `dragHandle`       | `string \| Ref<string>` | CSS selector for the handle. Only pointer events on this descendant start a drag. If omitted, the whole element is the handle. |
| `modifier`        | `{ keys: string[], method: 'every' \| 'some' }` or refs | Key(s) that must be pressed to allow drag (e.g. `['AltLeft']` with `method: 'every'`). |
| `activation`      | `IDragActivationOptions` | When drag starts: **distance** (pixels or `{ x, y, condition }`) and/or **delay** (ms). See [Activation](#activation). |
| `events`          | `IDraggableEvents`      | Callbacks for drag lifecycle and hover. See [Events](#events). |
| `render`           | `Component`             | Custom Vue component used in the overlay instead of cloning the node. |
| `placementMargins`| `IPlacementMargins`     | `{ top?, right?, bottom?, left? }` in pixels. Used when this element is also a droppable: defines the "center" zone for placement. |

---

## Payload

**`payload`** is an optional function that describes the item position and source list — needed for the `suggestSort` / `suggestSwap` / `suggestCopy` helpers:

```ts
type TDraggablePayload<T = any> = () => [index: number, items: T[]];
```

- **`index`** — index of this item in the list.
- **`items`** — the full list (array).

The library calls this when building **`event.draggedItems`**:

```ts
interface IDragItem<T = unknown> {
  index: number;   // position in items
  item: T;         // the actual data: items[index]
  items: T[];      // reference to the source array
  data?: unknown;  // custom data from the `data` option
}
```

For arbitrary custom data (without a list), use the **`data`** option instead:

```ts
makeDraggable(ref, { data: () => myCard })
// → event.draggedItems[0].data === myCard
```

You can combine both — `payload` for the helpers, `data` for custom metadata.

---

## Activation

`activation` controls when a pointer down becomes a drag:

- **`distance`** — movement threshold in pixels. Can be a number (same for x and y), or `{ x?, y?, condition? }`. **`condition`**: `'any'` = drag if either axis exceeds, `'both'` = both must exceed.
- **`delay`** — time in ms the pointer must be down before drag starts.

Use these to avoid accidental drags (e.g. require 5px move or 200ms hold).

---

## Events

`events` can include:

**On the dragged element itself (this draggable):**

- `onSelfDragStart` — drag started (this element is being dragged).
- `onSelfDragMove` — drag move.
- `onSelfDragEnd` — drag ended (dropped or cancelled).
- `onSelfDragCancel` — drag cancelled (e.g. Escape).

**When another element is dragged over this one** (this draggable is under the cursor):

- `onDragStart`, `onDragMove`, `onDragEnd`, `onDragCancel`.
- `onHover` — cursor entered this draggable.
- `onLeave` — cursor left this draggable.

Every event receives **`IDragEvent`**:

```ts
interface IDragEvent<DragT = unknown, ZoneT = unknown> {
  draggedItems: IDragItem<DragT>[];              // all dragged items (multi-drag)
  dropZone: IDropZoneContext<ZoneT> | undefined; // zone under cursor (items + placement + data)
  hoveredDraggable: IHoveredDraggableContext | undefined; // hovered draggable inside the zone
  helpers: IHelpers;                             // low-level array ops + high-level suggest* presets
  provider: IDnDProviderExternal;                // access to provider state (pointer, state, etc.)
}
```

For simple cases you only need `event.draggedItems`, `event.dropZone`, and for sorting, `event.hoveredDraggable`. Use `event.helpers.suggestSort()` to compute new array state without writing sort logic manually.

---

## Example

```vue
<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  makeDraggable(itemRef, {
    dragHandle: '.handle',
    activation: { distance: 5 },
    events: {
      onSelfDragStart: (e) => console.log('drag start', e.draggedItems),
      onSelfDragEnd: (e) => console.log('drag end', e.draggedItems),
    },
  });
</script>

<template>
  <div ref="itemRef" tabindex="0">
    <span class="handle">⋮⋮</span>
    <span>Item</span>
  </div>
</template>
```

With payload (for lists / drop handlers that need index and items):

```ts
const items = ref([1, 2, 3]);
makeDraggable(itemRef, { dragHandle: '.handle' }, () => [0, items.value]);

// later in onDrop:
// e.draggedItems[0].index, e.draggedItems[0].item, e.draggedItems[0].items
```

Using return values (e.g. for styling and sort indicators):

```vue
<script setup lang="ts">
  const itemRef = useTemplateRef<HTMLElement>('itemRef');
  const { isDragging, isDragOver, selected } = makeDraggable(itemRef, { ... });
</script>

<template>
  <div
    ref="itemRef"
    :class="{
      'opacity-50': isDragging,
      'border-t-2': isDragOver?.top,
      'border-b-2': isDragOver?.bottom,
    }"
  >
    Item
  </div>
</template>
```

---

## See also

- [makeDroppable](/v2/guide/core/make-droppable) — drop zones and `onDrop` payload.
- [DnDProvider](/v2/guide/core/dnd-provider) — overlay and custom `render`.
