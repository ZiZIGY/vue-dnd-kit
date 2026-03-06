# makeSnappedOverlayPosition

`makeSnappedOverlayPosition` returns a computed ref of grid-snapped overlay coordinates. The library always tracks raw pointer coordinates internally — this utility maps them to the nearest grid point for display purposes only. Use it in custom overlay components to achieve a "snap to grid" visual effect.

## Signature

```ts
makeSnappedOverlayPosition(
  position: ComputedRef<ICoordinates>,
  options?: TSnapOverlayOptions
): ComputedRef<ICoordinates>
```

- **`position`** — the raw overlay position. Typically `provider.overlay.position` from `useDnDProvider()`.
- **`options`** — grid configuration. See [Options](#options).

---

## Return value

`ComputedRef<ICoordinates>` — snapped `{ x, y }` coordinates. Re-computed whenever `position` changes.

```ts
interface ICoordinates {
  x: number;
  y: number;
}
```

---

## Options

`TSnapOverlayOptions` is a discriminated union — use either `grid` (uniform) **or** `gridX` + `gridY` (per-axis):

```ts
type TSnapOverlayOptions =
  | { grid: number } // uniform snap on both axes
  | { gridX: number; gridY: number }; // independent snap per axis
```

| Option  | Type     | Description                                                           |
| ------- | -------- | --------------------------------------------------------------------- |
| `grid`  | `number` | Snap step in pixels applied to both x and y.                          |
| `gridX` | `number` | Snap step in pixels for the x axis only. Must be paired with `gridY`. |
| `gridY` | `number` | Snap step in pixels for the y axis only. Must be paired with `gridX`. |

If `options` is omitted, coordinates pass through unchanged (step = 1, no snapping).

---

## How it works

Each axis is independently rounded to the nearest multiple of its step:

```ts
snappedX = Math.round(x / stepX) * stepX;
snappedY = Math.round(y / stepY) * stepY;
```

The raw position stored in the provider is **not modified** — only the returned computed ref reflects snapped values. This means drop logic, sensors, and placement calculations continue to use the precise pointer position.

---

## Example

Uniform 20px grid snap:

```vue
<script setup lang="ts">
  import { computed } from 'vue';
  import {
    useDnDProvider,
    makeSnappedOverlayPosition,
  } from '@vue-dnd-kit/core';

  const provider = useDnDProvider();

  const snappedPosition = makeSnappedOverlayPosition(
    provider.overlay.position,
    { grid: 20 }
  );

  const overlayStyle = computed(() => ({
    transform: `translate3d(${snappedPosition.value.x}px, ${snappedPosition.value.y}px, 0)`,
  }));
</script>

<template>
  <div
    v-if="provider.state.value === 'dragging'"
    :style="overlayStyle"
  >
    <component :is="provider.overlay.render.value" />
  </div>
</template>
```

Asymmetric grid (horizontal 40px, vertical 20px):

```ts
const snappedPosition = makeSnappedOverlayPosition(provider.overlay.position, {
  gridX: 40,
  gridY: 20,
});
```

Typically used inside the `#overlay` slot of `DnDProvider`:

```vue
<DnDProvider>
  <YourApp />

  <template #overlay="{ overlay }">
    <SnappedOverlay :overlay="overlay" />
  </template>
</DnDProvider>
```

```vue
<!-- SnappedOverlay.vue -->
<script setup lang="ts">
  import { type Component, computed } from 'vue';
  import {
    useDnDProvider,
    makeSnappedOverlayPosition,
  } from '@vue-dnd-kit/core';

  defineProps<{ overlay: Component }>();

  const provider = useDnDProvider();
  const pos = makeSnappedOverlayPosition(provider.overlay.position, {
    grid: 20,
  });

  const style = computed(() => ({
    transform: `translate3d(${pos.value.x}px, ${pos.value.y}px, 0)`,
    position: 'fixed' as const,
    top: 0,
    left: 0,
    pointerEvents: 'none' as const,
  }));
</script>

<template>
  <div :style="style">
    <component :is="overlay" />
  </div>
</template>
```

---

## See also

- [DnDProvider](/v2/guide/core/dnd-provider) — `#overlay` slot for custom overlay rendering.
- [useDnDProvider](/v2/guide/core/use-dnd-provider) — `overlay.position` source.
