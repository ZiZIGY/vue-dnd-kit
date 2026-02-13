# DnDProvider

`DnDProvider` is the root component for drag and drop. It provides the DnD context to all descendants and hosts the **drag overlay** (the element that follows the pointer while dragging). Everything that uses `makeDraggable`, `makeDroppable`, `makeSelectionArea`, or `makeConstraintArea` must live inside a single `DnDProvider`.

## One provider per context

**Use exactly one `DnDProvider` per DnD context.** That can be:

- **One for the whole application** — wrap the root (e.g. `App.vue`) and place the provider as high as possible, or
- **One per page (or route)** — mount a provider in the layout or in each page component so that only the current page has an active DnD context. When the user navigates away, the provider unmounts and its listeners are removed.

In both cases, **do not nest** multiple providers on the same page: only one provider should be active at a time.

`DnDProvider` registers **global event listeners** on `document`:

- `pointerdown` — to start drag or selection
- `pointerup` / `pointermove` — during drag
- `keydown` / `keyup` — keyboard drag (Enter/Space, arrows, Escape)
- `blur` — to clear keyboard state
- `scroll` (capture) — to update positions on scroll

Because of that, **do not nest** multiple providers on the same screen: each would attach its own document listeners, which can lead to double handling, focus conflicts, or unpredictable behavior. One provider per context (app or page), one active DnD scope at a time.

## Basic usage

```vue
<template>
  <DnDProvider>
    <YourApp />
  </DnDProvider>
</template>

<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';
</script>
```

`DnDProvider` renders:

1. Its default slot — your app content.
2. A **fixed overlay container** (position fixed, full viewport, `pointer-events: none`) that stays on top. Inside this container the **overlay** is rendered: the visual that follows the cursor while dragging.

## Overlay: default and custom

While dragging, the library shows an overlay (a clone or custom component that tracks the pointer). That overlay is rendered inside the provider’s fixed container.

### Default overlay

If you don’t use the `overlay` slot, the provider uses **DefaultOverlay**:

- When `state === 'dragging'`, it renders a single wrapper positioned with `transform: translate3d(x, y, 0)` (coordinates come from the provider).
- For each dragged item it either:
  - Renders the **custom component** you passed as `render` in `makeDraggable`, or
  - **Clones the dragged node**: same tag, `innerHTML`, and size (`initialRect.width` / `height`) so it looks like the original element.

So by default you get a simple “ghost” that follows the cursor. You can customize the look per draggable via `makeDraggable`’s `render` option.

### Overlay slot

You can take full control of the overlay with the `#overlay` slot. The slot receives `{ overlay }` — the **component** that should be rendered in the overlay container (either the current draggable’s `render` component or the default overlay component).

```vue
<DnDProvider>
  <YourApp />

  <template #overlay="{ overlay }">
    <component :is="overlay" />
  </template>
</DnDProvider>
```

The default implementation is exactly that: render `<component :is="overlay" />` inside the fixed container. You can replace it to wrap the overlay in extra markup, add animations, or change how the overlay component is used; the library still provides `overlay` (and the overlay component itself reads context via `useDnDProvider()` for position and dragging state).

## How it fits together

- **DnDProvider** mounts, sets up shared state and observers, and registers document listeners. It `provide`s the DnD context and renders the overlay container.
- **DefaultOverlay** (used when you don’t use the slot) subscribes to that context, shows when `state === 'dragging'`, and for each dragging entity renders either its custom `render` component or a DOM clone.
- **makeDraggable** / **makeDroppable** / etc. inject the same context and register their elements with the provider’s state. They don’t register document listeners themselves; the single provider does that.

So: one `DnDProvider` at the app root, no nested providers, and optionally a custom `#overlay` slot if you need a different overlay container or behavior.
