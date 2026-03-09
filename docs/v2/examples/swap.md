# Swap

Exchange items between two lists — useful for team assignments, role rotation, or any scenario where you want to trade positions rather than reorder.

<script setup>
import Example from '@examples-v2/Swap/Example.vue';
</script>

## Demo

<Example />

## Overview

**Swap** exchanges the dragged item with the one you hover over. Unlike sort, both items trade places — nothing shifts in between.

Use cases:
- **Team roster management** — move a developer from one sprint team to another, pushing someone back
- **Seat / role assignment** — trading seats in a classroom or conference
- **A/B comparison boards** — balance two groups by swapping members

## Core logic

The entire swap is driven by `event.helpers.suggestSwap()`:

```ts
function handleDrop(e: IDragEvent) {
  // Swap only makes sense when hovering over another item
  if (!e.hoveredDraggable) return;

  const r = e.helpers.suggestSwap();
  if (!r) return;

  const srcItems = e.draggedItems[0]?.items as Player[];

  // Always update the source list
  if (srcItems === teamAlpha.value) teamAlpha.value = r.sourceItems as Player[];
  else if (srcItems === teamBeta.value) teamBeta.value = r.sourceItems as Player[];

  // Cross-list swap: update the target list too
  if (!r.sameList) {
    const tgtItems = e.hoveredDraggable.items as Player[];
    if (tgtItems === teamAlpha.value) teamAlpha.value = r.targetItems as Player[];
    else if (tgtItems === teamBeta.value) teamBeta.value = r.targetItems as Player[];
  }
}
```

Key points:
- **Guard with `hoveredDraggable`** — swap has no meaning when dropping on an empty zone
- **`r.sameList`** — `true` when both items are in the same array (swap within a list)
- **`r.sourceItems` / `r.targetItems`** — the new arrays after the swap; apply both when cross-list

## Droppable setup

Each team list registers as a droppable, exposing its items via `payload`:

```ts
makeDroppable(listRef, {
  events: { onDrop: handleDrop },
}, () => teamAlpha.value);
```

## Draggable items

Items expose their position via payload. `isDragOver` drives the visual "swap target" highlight:

```vue
<script setup lang="ts">
  const { isDragging, isDragOver } = makeDraggable(itemRef, {}, () => [
    props.index,
    props.items,
  ]);

  // isDragOver is defined when another item is hovering over this one
  const isHovered = computed(() => isDragOver.value !== undefined);
</script>

<template>
  <div
    :class="{
      'is-dragging': isDragging,   // hide original while dragging
      'is-hovered': isHovered,     // highlight as swap target
    }"
  >
    <span v-if="isHovered">⇄</span>
    <slot />
  </div>
</template>
```

## Animations

```css
.swap-move {
  transition: all 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.swap-enter-active,
.swap-leave-active {
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.swap-enter-from,
.swap-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.swap-leave-active {
  position: absolute;
  width: 100%;
  pointer-events: none;
}
```

## Swap result shape

```ts
interface ISuggestSwapResult {
  sourceItems: unknown[];   // source list after swap
  targetItems: unknown[];   // target list after swap (same ref as source when sameList)
  sourceIndexes: number[];  // indexes of dragged items in source
  targetIndex: number;      // index of the hovered item (the other side of the swap)
  sameList: boolean;
}
```

## See also

- [Sorting Lists](/v2/examples/sorting-lists) — insert/reorder instead of swapping
- [Copy](/v2/examples/copy) — duplicate instead of swapping
- [makeDroppable](/v2/guide/core/make-droppable) — zone configuration

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Swap/Example.vue)
- [PlayerCard.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Swap/PlayerCard.vue)
- [TeamList.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Swap/TeamList.vue)
