# makeDroppable

`makeDroppable` turns an element into a drop zone. It must be used inside a [DnDProvider](/v2/guide/core/dnd-provider). Pass a template ref (or `useTemplateRef`) and optionally options and a payload. Draggable items can be dropped onto this zone when their `groups` match.

## Signature

```ts
makeDroppable(ref, options?, payload?): IMakeDroppableReturnType
```

Overloads:

- **`makeDroppable(ref)`** — no options, no payload.
- **`makeDroppable(ref, options?)`** — optional options object.
- **`makeDroppable(ref, payload)`** — if the second argument is a **function**, it is treated as the payload (options are empty).
- **`makeDroppable(ref, options, payload?)`** — options and optional payload.

**`ref`** must be a ref to an HTML element (or component root element). The element is registered on mount and unregistered on unmount.

---

## Return value

| Property    | Type                            | Description |
|------------|----------------------------------|-------------|
| `isAllowed`| `ComputedRef<boolean>`          | `true` when this zone is a valid drop target (visible, not disabled, groups match with currently dragging items). |
| `isDragOver`| `ComputedRef<IPlacement \| undefined>` | When an item is dragged over this zone: placement flags `{ top, right, bottom, left, center }`. `undefined` when not hovered. Use for drop highlight and placement indicators. |

---

## Options

Extends **base options** (shared with draggable/selection/constraint):

| Option      | Type                      | Description                                        |
|------------|----------------------------|----------------------------------------------------|
| `disabled` | `boolean \| Ref<boolean>`  | When true, the zone does not accept drops.         |
| `groups`   | `string[] \| Ref<string[]>`| Groups for matching with draggables (same group = can drop). |

**Droppable-specific options:**

| Option   | Type               | Description |
|----------|--------------------|-------------|
| `events` | `IDroppableEvents` | Callbacks: `onEnter`, `onDrop`, `onLeave`. See [Events](#events). |

---

## Payload

**`payload`** is an optional function that returns the zone's items array — needed for the `suggestSort` / `suggestSwap` / `suggestCopy` helpers:

```ts
type TDroppablePayload<T = any> = () => T[];
```

The library calls this when building **`event.dropZone`**:

```ts
interface IDropZoneContext<T = unknown> {
  items: T[];
  placement: IPlacement | undefined; // cursor position relative to the zone
  data?: unknown;                     // custom data from the `data` option
}
```

For arbitrary custom data, use the **`data`** option:

```ts
makeDroppable(ref, { data: () => myColumn })
// → event.dropZone.data === myColumn
```

---

## Events

`events` can include:

| Callback   | Description |
|-----------|-------------|
| `onEnter` | Cursor enters this drop zone during drag. |
| `onDrop`  | Item is dropped on this zone. Can return `Promise`; rejection triggers cancel flow. |
| `onLeave` | Cursor leaves this drop zone during drag. |

Every event receives the same **`IDragEvent`** as in makeDraggable:

- **`draggedItems`** — all dragged items (for multi-drag).
- **`dropZone`** — context of this zone (`items`, `placement`, `data`).
- **`hoveredDraggable`** — hovered element inside the zone (if any).
- **`helpers`** — low-level array ops + high-level `suggestSort` / `suggestSwap` / `suggestCopy` / `suggestRemove` presets.
- **`provider`** — access to provider state.

---

## Example

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';

  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');
  const zoneItems = ref<string[]>([]);

  makeDroppable(zoneRef, {
    events: {
      onEnter: (e) => console.log('enter', e.dropZone),
      onDrop: (e) => {
        // e.draggedItems → what we're dragging
        // e.dropZone     → where we're dropping
        // e.helpers.suggestSort() → ready-made sort result
      },
      onLeave: (e) => console.log('leave', e.dropZone),
    },
  }, () => [zoneItems.value, { id: 'main-zone' }]);
</script>

<template>
  <div ref="zoneRef" class="drop-zone">Drop here</div>
</template>
```

Without payload:

```ts
makeDroppable(zoneRef, {
  events: { onDrop: (e) => console.log('dropped', e.draggedItems) },
});
```

Using return values (e.g. for drop highlight):

```vue
<script setup lang="ts">
  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');
  const { isDragOver, isAllowed } = makeDroppable(zoneRef, { ... });
</script>

<template>
  <div
    ref="zoneRef"
    :class="{
      'ring-2 ring-primary': isDragOver && isAllowed,
      'bg-muted': isDragOver?.center,
    }"
  >
    Drop here
  </div>
</template>
```

---

## See also

- [makeDraggable](/v2/guide/core/make-draggable) — payload shape and `event.draggedItems`.
- [DnDProvider](/v2/guide/core/dnd-provider) — provider and groups.
