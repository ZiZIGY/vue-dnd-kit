# Overlay Transition

Animate the drag preview with a pop-in / pop-out effect when dragging starts and ends. There are two approaches: a global CSS class or a custom preview component.

<script setup>
import Example from '@examples-v2/OverlayTransition/Example.vue';
</script>

## Demo

<Example />

The preview pops in with a spring scale when dragging starts and fades out when dropped.

## Approach 1 — Global CSS on `.dnd-kit-preview`

The simplest way. The preview content div has the class `dnd-kit-preview` which you can target globally:

```css
/* Add to your global stylesheet */
.dnd-kit-preview {
  /* Smooth cursor-following movement */
  transition: transform 0.06s linear;
}
```

::: warning Position vs movement
`transition: transform` makes the preview lag behind the cursor. Use it only if the effect is intentional (e.g. a slight spring feel). For responsive dragging, leave `transform` without a transition.
:::

## Approach 2 — Custom preview component with `<Transition>`

Create a custom preview component that wraps the dragging content in Vue's `<Transition>`. Use separate CSS `scale` and `opacity` properties so they don't conflict with the `transform: translate3d(x, y, 0)` that tracks the cursor position.

```vue
<!-- TransitionOverlay.vue -->
<script setup lang="ts">
  import { DragPreview } from '@vue-dnd-kit/core';
</script>

<template>
  <Transition name="preview-pop" appear>
    <DragPreview />
  </Transition>
</template>

<style>
  /* Use `scale` (not `transform`) to avoid conflict with the translate */
  .preview-pop-enter-active {
    transition: opacity 0.15s ease, scale 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .preview-pop-leave-active {
    transition: opacity 0.1s ease, scale 0.1s ease;
  }
  .preview-pop-enter-from,
  .preview-pop-leave-to {
    opacity: 0;
    scale: 0.85;
  }
</style>
```

Register it via the `#preview` slot on `DnDProvider`:

```vue
<DnDProvider>
  <template #preview>
    <TransitionOverlay />
  </template>
</DnDProvider>
```

::: tip `scale` vs `transform`
CSS `scale` is a standalone property (Chrome 104+, Firefox 72+, Safari 14.1+). It composes with `transform` independently, so the cursor-tracking `transform: translate3d(...)` and the animation `scale` don't overwrite each other.
:::

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/OverlayTransition/Example.vue)
- [TransitionOverlay.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/OverlayTransition/TransitionOverlay.vue)
- [Item.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/OverlayTransition/Item.vue)

## See also

- [Custom Overlay per Draggable](/v2/examples/custom-overlay) — per-item render component
- [Changing Overlay](/v2/examples/changing-overlay) — swap preview per drop zone
- [DnDProvider](/v2/guide/core/dnd-provider) — `#preview` slot
