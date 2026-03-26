# useDnDProvider

`useDnDProvider` returns the current DnD context (the same object that [DnDProvider](/v2/guide/core/dnd-provider) provides). Use it in any descendant of `DnDProvider` when you need access to preview, pointer, state, entities, keyboard, or collision. Must be called inside a provider; otherwise the internal inject fails.

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
| `preview`             | `{ ref, position, size, render, to }` | Preview container ref, position (x/y), size (DOMRect), current render component, and teleport target. |
| `hovered`             | `IHovered` | `{ draggable: Map, droppable: Map }` — elements under cursor during drag (with their placement). |
| `collision`           | `{ throttle }` | Collision detection throttle interval (`Ref<number>`). |
| `autoScrollViewport`  | `ComputedRef<IAutoScrollOptions \| true \| false \| null \| undefined>` | Viewport auto-scroll config from the DnDProvider prop. |

---

## `preview` detail

```ts
preview: {
  ref: Ref<HTMLElement | null>;              // the mounted preview DOM element
  position: ComputedRef<ICoordinates>;      // current x/y position (use for translate3d)
  size: ShallowRef<DOMRect>;               // size of the preview element (updated by DragPreview on mount/change)
  render: Ref<Component | undefined>;       // active render component (from makeDraggable's render option)
  to: WritableComputedRef<string | false | null | undefined>; // teleport target (from previewTo prop)
}
```

`preview.position` is the primary source of truth for positioning the drag ghost. Use it in custom preview implementations:

```ts
const provider = useDnDProvider();
// preview position as CSS variables
const style = computed(() => ({
  transform: `translate3d(${provider.preview.position.value.x}px, ${provider.preview.position.value.y}px, 0)`,
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

Reading preview position in a custom preview:

```vue
<script setup lang="ts">
  import { computed } from 'vue';
  import { useDnDProvider } from '@vue-dnd-kit/core';

  const provider = useDnDProvider();

  const style = computed(() => {
    const { x, y } = provider.preview.position.value;
    return { transform: `translate3d(${x}px, ${y}px, 0)` };
  });
</script>

<template>
  <div v-if="provider.state.value === 'dragging'" :style="style" class="my-preview">
    <component :is="provider.preview.render.value" />
  </div>
</template>
```

---

---

## `injectionKey` — advanced use only

`injectionKey` is the Vue injection key under which `DnDProvider` stores its context. It is exported from the public API but **should not be used in normal application code** — `useDnDProvider` covers all typical needs.

Typical use cases:

- Bridging a separately mounted Vue app (e.g. inside a shadow root) into the same DnD context
- Building custom integrations that need direct access to the internal provider
- Exploring or debugging what the library holds at runtime

Example — sharing context with a shadow root app:

```ts
import { inject, createApp, h } from 'vue';
import { injectionKey } from '@vue-dnd-kit/core';

// Inside a component that is a descendant of DnDProvider:
const outerProvider = inject(injectionKey);

onMounted(() => {
  const shadow = host.attachShadow({ mode: 'open' });
  const container = document.createElement('div');
  shadow.appendChild(container);

  // Share the outer provider with the inner app — no DnDProvider wrapper needed
  createApp({ render: () => h(YourComponent) })
    .provide(injectionKey, outerProvider)
    .mount(container);
});
```

Elements inside the shadow root will register into the same `draggableMap` / `droppableMap` as the outer app and participate in the same drag sessions.

> **Do not** use `injectionKey` + `inject` as a replacement for `useDnDProvider`. The value behind the key is an internal type — its shape is not part of the public API contract and may change between minor versions.

---

## See also

- [DnDProvider](/v2/guide/core/dnd-provider) — setup and preview slot.
- [makeDraggable](/v2/guide/core/make-draggable), [makeDroppable](/v2/guide/core/make-droppable) — use the same context via the provider.
- [makeAutoScroll](/v2/guide/core/make-auto-scroll) — uses `provider.state` and `provider.preview.position` internally.
