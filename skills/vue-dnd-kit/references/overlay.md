# The overlay (drag preview)

While dragging, a box teleported to `body` (`overlayTo`) follows the pointer, and the
item's own element stays in the list as the placeholder. On drop, the box flies to
the item's final slot (`dropAnimation`) and disappears.

## What the box shows

The first match wins:

1. The item's own `overlay` component (`makeSortableItem` / `makeDraggable` option).
2. Its list's or tree's `overlay` component.
3. The provider's `#overlay` slot. If it renders nothing (`v-if`), the next option applies.
4. **The default: a clone** of the dragged element. In a multi-drag, it is a column of clones or a stack with a count (see [multi-drag](multi-drag.md)).

`overlay: false` on `makeDraggable` disables the box: move the element yourself with
the returned `transform`.

## The default clone

The clone is taken synchronously at pickup. It is a deep copy, with form values,
canvases and the computed styles it would lose outside its list (inherited fonts,
colors, table cell widths…) inlined. Ids and `data-dnd-*` marks are stripped, and it is
`aria-hidden`. Table rows come wrapped in a table of their own. Ripples of UI kits
(Vuetify, Quasar, PrimeVue, Naive UI) are left out.

- Mark parts that shouldn't be copied with **`data-dnd-no-clone`** (a tooltip, a menu button, a badge).
- The clone shows the element as it is: no background is guessed. A row without one of its own (the list paints it: `<li>` in a white `<ul>`, `v-list-item`, table rows) gives a see-through clone. Give it the list's background with CSS; a scoped style works too, since the clone keeps the component's `data-v-*` attribute:

  ```css
  [data-dnd-overlay] .row { background: var(--surface); }
  ```

  Or give the row a background of its own. Icons and tiles meant to float stay transparent.

## A custom overlay component

```vue
<!-- CardOverlay.vue -->
<script setup lang="ts">
import type { OverlayProps } from '@vue-dnd-kit/core';
const props = defineProps<OverlayProps>();
// props: active, items, over, accepted, status, mode ('move' | 'copy' | 'swap' | 'insert')
</script>

<template>
  <!-- Fill the box: it resizes to the target slot and animates on drop. -->
  <div class="card-overlay" :class="{ refused: over && !accepted }" style="width: 100%; height: 100%">
    {{ (items[0].item as Task).title }}
    <small v-if="mode === 'copy'">+ copy</small>
    <span v-if="items.length > 1">{{ items.length }}</span>
  </div>
</template>
```

```ts
import { shallowRef } from 'vue';
import CardOverlay from './CardOverlay.vue';

makeSortableList(listRef, { items, overlay: CardOverlay });             // a value
makeSortableItem(el, { item: () => props.task, overlay: shallowRef(CardOverlay) });  // or a shallowRef
```

`items[i]` is a `DragItem`: `{ id, item (the list item, for sortable drags), data, type }`.

Provider slot (for every drag without its own component):

```vue
<DnDProvider>
  <Board />
  <template #overlay="{ items, mode, accepted }">
    <CardOverlay v-if="items[0].type.includes('card')" v-bind="{ items, mode, accepted }" />
  </template>
</DnDProvider>
```

Show the library's clone inside your own layout with `<DragPreview :id="entry.id" />`.

## Size: overlayFit

- `'slot'` (default): the box takes the size of the slot the item will land in. Over a
  list of wider cards it widens, and the drop needs no resize. It resizes around the
  pointer, which stays at the same fraction of the box. The content re-lays out at the
  new size and is never scaled.
- `'source'`: the box keeps the dragged element's size.

A fixed size on your component's root keeps that size inside the box.

## Styling the box

The box is `[data-dnd-overlay]` (`position: fixed`, `pointer-events: none`). Its value
says what it does: `dragging`, then `dropping` while it lands (or waits for an async
`onBeforeDrop`). Add a lifted look on your component or with CSS, and drop it as it lands:

```css
[data-dnd-overlay='dragging'] > * { box-shadow: 0 12px 24px -8px rgb(0 0 0 / 0.35); border-radius: 8px; }
[data-dnd-overlay] .row { background: white; } /* the clone of a row the list paints */
```

## Over another Vue app or a shadow root

`overlayTo` takes a selector or an element. Use it when the drag area lives in a
shadow root or a `<dialog>` on the top layer, and teleport the overlay there.
