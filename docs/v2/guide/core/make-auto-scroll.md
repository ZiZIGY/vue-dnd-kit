# makeAutoScroll

`makeAutoScroll` enables automatic scrolling of a **specific scrollable container** when the drag overlay approaches its edges during a drag. It must be used inside a [DnDProvider](/v2/guide/core/dnd-provider).

::: tip Viewport vs container scroll
For **viewport** (window) auto-scroll, use the `autoScrollViewport` prop on [DnDProvider](/v2/guide/core/dnd-provider) instead. `makeAutoScroll` is for scrolling an individual DOM element (overflow container, custom scroll area, etc.).
:::

## Signature

```ts
makeAutoScroll(
  container: Ref<HTMLElement | null>,
  options?: IAutoScrollOptions
): { isScrolling: ShallowRef<boolean> }
```

- **`container`** — ref to the scrollable element. Auto-scroll activates when the overlay's center point is near the edges of this element.
- **`options`** — optional configuration. See [Options](#options).

---

## Return value

| Property      | Type                   | Description |
|--------------|------------------------|-------------|
| `isScrolling`| `ShallowRef<boolean>`  | `true` while the container is actively being scrolled by auto-scroll. |

---

## Options

```ts
interface IAutoScrollOptions {
  threshold?: number | IPlacementMargins;
  speed?: number;
  disabled?: boolean;
}
```

| Option      | Type                               | Default    | Description |
|------------|-------------------------------------|------------|-------------|
| `threshold` | `number \| IPlacementMargins`      | `~50`      | Distance from the container edge (in pixels) at which scrolling begins. A number applies the same threshold to all sides. Use `{ top?, right?, bottom?, left? }` for per-side control. |
| `speed`     | `number`                           | `1`        | Scroll speed multiplier. Higher values scroll faster when the overlay is near the edge. |
| `disabled`  | `boolean`                          | `false`    | Disable auto-scroll without removing the composable. |

---

## How it works

- Auto-scroll starts when `provider.state === 'dragging'` and stops when dragging ends.
- The scroll target point is the **center of the overlay** (`overlay.position + overlay.size / 2`). If `overlay.size` is not yet available, the overlay position itself is used.
- The closer the overlay center is to the container edge (within `threshold`), the faster the scroll.

---

## Example

Basic usage with a scrollable list:

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { makeAutoScroll } from '@vue-dnd-kit/core';

  const listRef = ref<HTMLElement | null>(null);

  const { isScrolling } = makeAutoScroll(listRef, {
    threshold: 60,
    speed: 1.5,
  });
</script>

<template>
  <div
    ref="listRef"
    class="overflow-y-auto h-64"
    :class="{ 'scroll-active': isScrolling }"
  >
    <!-- draggable items -->
  </div>
</template>
```

Per-side thresholds (larger at top/bottom, disabled at sides):

```ts
makeAutoScroll(listRef, {
  threshold: { top: 80, bottom: 80, left: 0, right: 0 },
  speed: 2,
});
```

---

## See also

- [DnDProvider](/v2/guide/core/dnd-provider) — `autoScrollViewport` prop for viewport scroll.
- [useDnDProvider](/v2/guide/core/use-dnd-provider) — access `provider.overlay.position` and `provider.state`.
