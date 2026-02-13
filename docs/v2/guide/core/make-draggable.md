# makeDraggable

`makeDraggable` turns an element into a draggable item. It must be used inside a [DnDProvider](/v2/guide/core/dnd-provider). Pass a template ref (or `useTemplateRef`) and optionally options and a payload.

## Signature

```ts
makeDraggable(ref, options?, payload?): {}
```

Two overloads:

- **`makeDraggable(ref)`** — no options, no payload.
- **`makeDraggable(ref, options?)`** — optional options object.
- **`makeDraggable(ref, payload)`** — if the second argument is a **function**, it is treated as the payload (options are empty).
- **`makeDraggable(ref, options, payload?)`** — options and optional payload.

**`ref`** must be a ref to an HTML element (or component root element). The element is registered on mount and unregistered on unmount. Native `dragstart` / `drag` / `dragend` are prevented so the browser doesn’t start its own drag.

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
| `placementMargins`| `IPlacementMargins`     | `{ top?, right?, bottom?, left? }` in pixels. Used when this element is also a droppable: defines the “center” zone for placement. |

---

## Payload

**`payload`** is an optional function that describes the item for drop handlers and reordering:

```ts
type TDraggablePayload<T = any, D = any> = () => [index, items, dropData?];
```

- **`index`** — index of this item in the list.
- **`items`** — the full list (array).
- **`dropData`** (optional) — extra data for the drop target.

The library calls this when a drag starts and passes the result to droppable `onDrop` and similar as `event.payload` (`{ index, items, dropData }`). Omit `payload` if you don’t need list/index or drop data (e.g. simple drag-to-zone).

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

Every event receives **`IDragEvent`**: `{ payload, provider }`. `payload` is the result of the dragging item’s `payload()` (if any); `provider` exposes shared state/pointer for advanced use.

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
      onSelfDragStart: (e) => console.log('drag start', e.payload),
      onSelfDragEnd: (e) => console.log('drag end', e.payload),
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
```

---

## See also

- [makeDroppable](/v2/guide/core/make-droppable) — drop zones and `onDrop` payload.
- [DnDProvider](/v2/guide/core/dnd-provider) — overlay and custom `render`.
