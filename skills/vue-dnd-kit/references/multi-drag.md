# Multi-drag and selection

Each provider has one selection: a reactive set of ids. Dragging a **selected** item
drags every selected item, with the grabbed one first. Dragging an unselected item drags
only that item. The library doesn't decide how users select (click recipes are yours),
and it never clears the selection by itself. Selection survives unmounts, such as rows
of a virtual list.

## Selecting

```ts
// Row component
const { selected } = makeSortableItem(el, { item: () => props.task });   // or makeDraggable
const onClick = (event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey) selected.value = !selected.value;   // Ctrl/Cmd+click
};
```

```ts
// Anywhere under the provider
const { selection } = useDnD();
selection.has(id); selection.add(a, b); selection.delete(a); selection.toggle(id, force?);
selection.set(ids); selection.clear(); selection.ids;   // ReadonlySet<Key>
```

Clear it after a drop if your UX wants that: `useDnDMonitor({ onDragEnd: () => selection.clear() })`.

## Rubber-band selection: makeSelectionArea

```vue
<script setup lang="ts">
const areaRef = useTemplateRef<HTMLElement>('area');
const { isSelecting, style } = makeSelectionArea(areaRef, {
  strategy: 'toggle',                       // 'toggle' (flip crossed items) | 'select' (only items inside)
  modifier: { keys: ['Shift'], method: 'every' },   // optional: keys that must be held
  accept: 'photo',                          // which draggables it selects (an accept rule)
  onSelected: (ids) => {},
});
</script>

<template>
  <!-- The area needs a non-static position: the band is absolutely positioned in it. -->
  <div ref="area" style="position: relative; overflow: auto">
    <PhotoGrid />
    <div v-if="isSelecting" class="band" :style="style" />
  </div>
</template>
```

A press on empty space in the area draws the band. A press on a draggable drags it.
The band stays anchored to the content when the area or the page scrolls.
`useDnD().status` is `'selecting'` while the band is drawn.

## How the other items behave: `multiple`

Set on the list where the drag starts (`makeSortableList({ multiple })`), default `'group'`:

| Mode | While dragging | Default overlay |
| --- | --- | --- |
| `'group'` | The other selected items leave their places and travel with the grabbed one as adjacent placeholders, so the list already shows the result. | Up to `overlayPreviews` (default 5) dragged items in a column along the list (a row in horizontal lists), `+N` at each end for those past it; in grids, a pile behind the grabbed item with the whole count. |
| `'gaps'` | The others stay where they are (marked `data-dnd-dragging`) until the drop. | Same column (pile in grids). |
| `'stack'` | The others fly into the overlay. | The grabbed item with a count. |

On drop the items land together at the target index, in the order they had. In
`'group'` and `'gaps'` the default overlay's previews each fly to their own slot.

Plain draggables (`makeDraggable`) in a multi-drag: the default overlay is a pile (the
grabbed one on top of the others, the count). Its clones fly back to their items on a
cancel. Into a zone (a folder, a trash can: the items no longer shown after the drop), every
clone of the overlay (pile, column, `DragPreview`s) goes in one after another, the box
last. `<DnDProvider overlay-previews="all">` clones every rendered dragged item at pickup
(default 5); the clones are taken in one batch, but each costs reading its styles.

## Custom overlay for several items

Overlay components and the provider's `#overlay` slot get `items` (every dragged item,
the grabbed one first). Use `DragPreview` to render the library's clone of any of them:

```vue
<!-- StackOverlay.vue -->
<script setup lang="ts">
import { DragPreview, type OverlayProps } from '@vue-dnd-kit/core';
defineProps<OverlayProps>();
</script>

<template>
  <div class="stack" style="position: relative; width: 100%; height: 100%">
    <DragPreview
      v-for="(entry, i) in items.slice(0, 3).reverse()"
      :key="entry.id"
      :id="entry.id"
      :style="{ position: 'absolute', inset: 0, transform: `rotate(${i * 4}deg)` }"
    >
      <!-- Fallback when this item has no clone (past overlayPreviews, or not rendered). -->
      <div class="card">{{ entry.id }}</div>
    </DragPreview>
    <span v-if="items.length > 1" class="badge">{{ items.length }}</span>
  </div>
</template>
```

Clones are taken at pickup: the grabbed item and the others next to it in drop order, as
many as `overlayPreviews` (if they are rendered). Others render `DragPreview`'s default
slot. In `'group'` and `'gaps'` modes, each preview lands on its own slot on drop, undoing
transforms on the way; into a zone, the previews go in one after another.

## Trees

Selected nodes move as one block, each with its subtree. See [tree](tree.md#multi-drag-in-trees).
