# DragPreview

`DragPreview` is the built-in component that renders the floating element following the cursor while dragging. It is exported from `@vue-dnd-kit/core` and used by `DnDProvider` by default. You can use it directly in your own preview wrappers (e.g. to add transitions or custom markup around it).

## Import

```ts
import { DragPreview } from '@vue-dnd-kit/core';
```

## Behavior

- Renders only when `state === 'dragging'` (has `v-if` internally — safe to use inside `<Transition>`).
- Positions itself via `transform: translate3d(x, y, 0)` sourced from `preview.position`.
- After mounting, updates `preview.size` with its real `DOMRect` so the position calculation uses the actual preview dimensions.
- Has class `dnd-kit-preview` — override styles with CSS targeting that class.

## Default slot

The default slot renders each dragged item. For each entry in `entities.draggingMap`:

- If the draggable registered a `render` component → renders `<component :is="draggable.render" />`.
- Otherwise → clones the original node: same tag, `v-html` of `initialOuterHTML`, fixed `width`/`height` from `initialRect`.

The slot exposes `{ draggingMap }` if you want to render the items yourself:

```vue
<DragPreview v-slot="{ draggingMap }">
  <div v-for="[node, draggable] in draggingMap" :key="node">
    {{ draggable.initialOuterHTML }}
  </div>
</DragPreview>
```

## Props

| Prop   | Type                                 | Default     | Description                                                                                                                          |
| ------ | ------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `grid` | `number \| { x: number; y: number }` | `undefined` | Snap the preview position to a grid. Pass a `number` for a uniform grid on both axes, or `{ x, y }` for independent per-axis control. |

## Grid snapping

Use the `grid` prop to snap the floating preview to a pixel grid:

```vue
<!-- Snap to 20px grid on both axes -->
<DragPreview :grid="20" />

<!-- Independent per-axis grid -->
<DragPreview :grid="{ x: 20, y: 40 }" />
```

::: tip
Grid snapping affects only the **visual position** of the preview — the underlying pointer coordinates and drop logic remain unchanged.
:::

## Basic usage — inside `#preview` slot

```vue
<DnDProvider>
  <template #preview>
    <DragPreview />
  </template>
</DnDProvider>
```

This is equivalent to the default behavior when no `#preview` slot is used.

## With transition

Wrap `DragPreview` in Vue's `<Transition>`. Because `DragPreview` has `v-if` on its root element, Vue's transition hooks fire correctly on drag start/end:

```vue
<!-- TransitionPreview.vue -->
<script setup lang="ts">
  import { DragPreview } from '@vue-dnd-kit/core';
</script>

<template>
  <Transition name="pop" appear>
    <DragPreview />
  </Transition>
</template>

<style>
  /* Use standalone `scale`/`opacity` — do NOT animate `transform`
     (it is already used for cursor tracking) */
  .pop-enter-active {
    transition: opacity 0.15s ease, scale 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .pop-leave-active {
    transition: opacity 0.1s ease, scale 0.1s ease;
  }
  .pop-enter-from,
  .pop-leave-to {
    opacity: 0;
    scale: 0.85;
  }
</style>
```

Register via the `#preview` slot:

```vue
<DnDProvider>
  <template #preview>
    <TransitionPreview />
  </template>
</DnDProvider>
```

## CSS customization

`DragPreview` adds the class `dnd-kit-preview` to its root element. Default styles:

```css
.dnd-kit-preview {
  transform-origin: 0 0;
  will-change: transform;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}
```

::: warning Do not animate `transform`
Adding `transition: transform` will make the preview trail behind the cursor. To animate enter/exit, use `scale` and `opacity` instead (standalone CSS properties that compose with `transform` independently).
:::

## `preview.size`

`DragPreview` writes to `provider.preview.size` (a `ShallowRef<DOMRect>`) whenever it mounts or its slot content changes. The position calculation reads this value to correctly offset the preview from the cursor. If you build a fully custom preview component **without** using `DragPreview`, update `preview.size` yourself:

```ts
import { useTemplateRef, watch } from 'vue';
import { useDnDProvider } from '@vue-dnd-kit/core';

const { preview } = useDnDProvider();
const ref = useTemplateRef('myRef');

watch(() => ref.value, () => {
  const rect = ref.value?.getBoundingClientRect();
  if (rect) preview.size.value = rect;
});
```

## See also

- [DnDProvider](/v2/guide/core/dnd-provider) — `#preview` slot and `previewTo` prop.
- [useDnDProvider](/v2/guide/core/use-dnd-provider) — `preview.position`, `preview.size`, `preview.render`.
- [Overlay Transition](/v2/examples/overlay-transition) — wrapping `DragPreview` with `<Transition>`.
- [Changing Overlay](/v2/examples/changing-overlay) — replacing the preview per drop zone.
