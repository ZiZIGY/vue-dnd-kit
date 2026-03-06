# useDnDProvider

`useDnDProvider` returns the current DnD context (the same object that [DnDProvider](/v2/guide/core/dnd-provider) provides). Use it in any descendant of `DnDProvider` when you need access to overlay, pointer, state, entities, keyboard, or collision. Must be called inside a provider; otherwise the internal inject fails.

## Signature

```ts
useDnDProvider(): IDnDProviderExternal
```

Returns **`IDnDProviderExternal`** — the public provider API.

---

## Return value

| Property              | Type | Description |
|-----------------------|------|-------------|
| `state`               | `Ref<TDnDState \| undefined>` | Current phase: `'dragging'`, `'selecting'`, `'activating'`, `'pending'`, or `null` / `undefined`. |
| `pointer`             | `Ref<TPointerState \| undefined>` | Pointer state with `start`, `current`, and `offset` coordinates. |
| `entities`            | `Reactive<IEntities>` | Maps and sets: `draggableMap`, `droppableMap`, `draggingMap`, `selectedSet`, `visibleDraggableSet`, etc. |
| `keyboard`            | `{ keys, step, moveFaster }` | `keys.pressedKeys`, `keys.forDrag`, `forCancel`, `forDrop`, `forMove`, `forMoveFaster`; step sizes for keyboard drag. |
| `scrollPosition`      | `Reactive<ICoordinates>` | Current scroll position (`x`, `y`). Updated as the user scrolls. |
| `delay`               | `Reactive<IDelay>` | Activation delay progress: `{ progress: number, startTime: number }`. |
| `distanceProgress`    | `ComputedRef<number>` | Progress of distance-based activation (0–1). |
| `overlay`             | `{ ref, position, size, render, to }` | Overlay element ref, position (x/y), size (DOMRect), current render component, and teleport target. |
| `hovered`             | `IHovered` | `{ draggable: Map, droppable: Map }` — elements under cursor during drag (with their placement). |
| `collision`           | `{ run?, throttle }` | Custom collision detection function and throttle interval. |
| `autoScrollViewport`  | `ComputedRef<IAutoScrollOptions \| true \| false \| null \| undefined>` | Viewport auto-scroll config from the DnDProvider prop. |

---

## `overlay` detail

```ts
overlay: {
  ref: Ref<HTMLElement | null>;              // the mounted overlay DOM element
  position: ComputedRef<ICoordinates>;      // current x/y position (use for translate3d)
  size: Ref<DOMRect | null>;                // size of the overlay element (set by ResizeObserver)
  render: Ref<Component | undefined>;       // active render component (from makeDraggable's render option)
  to: WritableComputedRef<string | false | null | undefined>; // teleport target (from overlayTo prop)
}
```

`overlay.position` is the primary source of truth for positioning the drag ghost. Use it in custom overlay implementations:

```ts
const provider = useDnDProvider();
// overlay position as CSS variables
const style = computed(() => ({
  transform: `translate3d(${provider.overlay.position.value.x}px, ${provider.overlay.position.value.y}px, 0)`,
}));
```

---

## `TDnDState`

```ts
type TDnDState =
  | 'dragging'    // active drag
  | 'selecting'   // box selection in progress
  | 'activating'  // distance/delay threshold being evaluated
  | 'pending'     // awaiting async onDrop resolution
  | null
  | undefined;
```

---

## Example

```vue
<script setup lang="ts">
  import { useDnDProvider } from '@vue-dnd-kit/core';

  const provider = useDnDProvider();

  // React to drag state
  watchEffect(() => {
    if (provider.state.value === 'dragging') {
      console.log('dragging', provider.pointer.value?.current);
    }
  });
</script>
```

Reading overlay position in a custom overlay:

```vue
<script setup lang="ts">
  import { computed } from 'vue';
  import { useDnDProvider } from '@vue-dnd-kit/core';

  const provider = useDnDProvider();

  const style = computed(() => {
    const { x, y } = provider.overlay.position.value;
    return { transform: `translate3d(${x}px, ${y}px, 0)` };
  });
</script>

<template>
  <div v-if="provider.state.value === 'dragging'" :style="style" class="my-overlay">
    <component :is="provider.overlay.render.value" />
  </div>
</template>
```

---

## See also

- [DnDProvider](/v2/guide/core/dnd-provider) — setup and overlay slot.
- [makeDraggable](/v2/guide/core/make-draggable), [makeDroppable](/v2/guide/core/make-droppable) — use the same context via the provider.
- [makeAutoScroll](/v2/guide/core/make-auto-scroll) — uses `provider.state` and `provider.overlay.position` internally.
