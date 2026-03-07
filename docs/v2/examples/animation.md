# Drag Animation

Animate the drag preview and list items during drag-and-drop using [motion-v](https://motion.dev/vue).

<script setup>
import Example from '@examples-v2/Animation/Example.vue';
</script>

## Demo

<Example />

Drag any card to reorder the list. The preview pops in with a spring bounce; items slide smoothly into their new positions on drop.

## How it works

The example combines three animation layers:

1. **Preview pop-in/out** — `AnimatePresence` from `motion-v` wraps `DragPreview`, enabling spring animations both on mount (drag start) and unmount (drag end) via `:exit`.
2. **Ghost state** — the original card turns fully transparent (`opacity: 0`) while dragging, hiding the "source" behind the floating preview.
3. **List reorder** — Vue's `<TransitionGroup>` moves remaining cards into their new positions with a smooth `transform` transition on drop.

## Custom preview with spring animation

The key to animating both drag start and drag end is wrapping `DragPreview` in `AnimatePresence`. This allows motion-v to intercept the unmount (when dragging ends) and play the `:exit` animation before the element is removed from the DOM.

```vue
<!-- AnimatedPreview.vue -->
<script setup lang="ts">
  import { motion, AnimatePresence } from 'motion-v';
  import { DragPreview } from '@vue-dnd-kit/core';
</script>

<template>
  <AnimatePresence mode="popLayout">
    <DragPreview v-slot="{ draggingMap }">
      <motion.div
        v-for="[node, draggable] in draggingMap"
        :key="node"
        class="preview-wrapper"
        :initial="{ scale: 0.9, opacity: 0, rotate: -2 }"
        :animate="{ scale: 1.06, opacity: 1, rotate: 1.5 }"
        :exit="{ scale: 0.9, opacity: 0, rotate: -2 }"
        :transition="{ type: 'spring', stiffness: 480, damping: 26 }"
      >
        <component v-if="draggable.render" :is="draggable.render" />
        <component
          v-else
          :is="node.tagName"
          v-html="draggable.initialOuterHTML"
          :style="{
            width: draggable.initialRect.width + 'px',
            height: draggable.initialRect.height + 'px',
          }"
        />
      </motion.div>
    </DragPreview>
  </AnimatePresence>
</template>

<style scoped>
  .preview-wrapper {
    filter: drop-shadow(0 16px 40px rgba(0, 0, 0, 0.22));
  }
</style>
```

::: tip Why `AnimatePresence` with `mode="popLayout"`?
`DragPreview` internally uses `v-if` — when dragging ends, it unmounts. Without `AnimatePresence`, the `:exit` animation never plays because the element is removed immediately. `mode="popLayout"` also takes the exiting element out of flow so the list below can animate freely at the same time.
:::

::: tip Why `v-for` directly on `motion.div`?
`draggingMap` is a `Map<HTMLElement, DraggableEntity>`. Iterating with `v-for` on the animated element (rather than a wrapper) lets motion-v track each draggable item by its `:key` independently — important for multi-drag where several items may animate in at once.
:::

Register it via the `#preview` slot on `DnDProvider`:

```vue
<DnDProvider>
  <template #preview>
    <AnimatedPreview />
  </template>
</DnDProvider>
```

## Ghost effect on the dragged item

Hide the source element while its preview is floating:

```vue
<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{ index: number; items: any[] }>();

  const cardRef = useTemplateRef<HTMLElement>('cardRef');
  const { isDragging } = makeDraggable(cardRef, {}, () => [props.index, props.items]);
</script>

<template>
  <div ref="cardRef" :class="{ 'is-dragging': isDragging }">
    <slot />
  </div>
</template>

<style>
  .is-dragging { opacity: 0; }
</style>
```

## Smooth list reordering with `<TransitionGroup>`

Wrap the draggable list in `<TransitionGroup>` and handle `list-move` to animate items sliding into place after a drop:

```vue
<TransitionGroup name="list">
  <AnimatedCard v-for="(item, i) in items" :key="item.id" :index="i" :items="items" />
</TransitionGroup>
```

```css
.list-move {
  transition: transform 0.28s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.list-enter-active, .list-leave-active {
  transition: opacity 0.2s ease, transform 0.28s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(-12px); }
.list-leave-active { position: absolute; pointer-events: none; }
```

::: warning `position: absolute` on leave
`list-leave-active { position: absolute }` takes the leaving element out of flow so remaining items can immediately animate to their final positions without waiting for the leave transition to finish.
:::

## Drop handler

```ts
makeDroppable(
  zoneRef,
  {
    events: {
      onDrop(e) {
        const r = e.helpers.suggestSort('vertical');
        if (r) items.value = r.targetItems as Card[];
      },
    },
  },
  () => items.value
);
```

## See also

- [DragPreview](/v2/guide/core/drag-preview) — slot API and CSS customization.
- [Overlay Transition](/v2/examples/overlay-transition) — simpler enter/leave transition using `<Transition>`.
- [Sorting Lists](/v2/examples/sorting-lists) — sorting without custom animations.
