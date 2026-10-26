# makeDraggable, makeDroppable, collisions, modifiers

Use these for anything that isn't a sortable list: free dragging, drop zones, a chess
board, a calendar, dropping a card into a folder, a trash can.

## makeDraggable

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ file: { id: string; kind: 'image' | 'doc' } }>();
const el = useTemplateRef<HTMLElement>('el');
const { isDragging, selected, transform } = makeDraggable(el, {
  id: () => props.file.id,         // default: useId() (new for every instance)
  data: () => props.file,          // anything; read back as active.data / items[i].data
  type: () => props.file.kind,     // matched by drop targets' `accept`
  handle: '.grip',                 // selector or element ref; only it starts the drag
  disabled: () => false,
  activation: { touch: { delay: 300 } },
  canDrag: (event) => !(event instanceof KeyboardEvent) || event.altKey,
  overlay: true,                   // true | false | a component (OverlayProps)
  modifiers: [],                   // applied after the provider's
  axis: 'y',                       // lock to one axis: 'x' | 'y' (after the modifiers)
  keyboard: 'pixels',              // 'pixels' (step px) | 'droppables' (jump between accepting targets)
  attributes: true,                // role/tabindex/aria-*; never overrides your own
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }"><span class="grip">⠿</span> {{ file.id }}</div>
</template>
```

Returns `{ id, isDragging, transform, selected }`.

- **`overlay: false`**: no overlay, so the element itself must move. Apply `transform`:
  `:style="transform && { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }"`.
- **Interactive children** (buttons, inputs, editable fields) don't start a pointer drag,
  so they keep working inside a draggable. With a `handle`, only the handle starts a
  drag, and a mouse drag starts from it at once (no 4px distance).
- **Keyboard drags** start from the focused draggable (or its handle), never from a
  button or field inside it.
- `selected` is a writable computed bound to the provider's selection (see [multi-drag](multi-drag.md)).

## makeDroppable

```ts
const zone = useTemplateRef<HTMLElement>('zone');
const { isOver, isAccepting, placement } = makeDroppable(zone, {
  id: 'trash',
  data: { role: 'trash' },
  accept: ['image', 'doc'],          // '*' | 'type' | string[] | ({ active, items, types }) => boolean
  acceptMode: 'all',                 // multi-drag: 'all' items must match, or 'some'
  priority: 0,                       // higher wins when targets overlap without nesting
  disabled: false,
  onDragEnter(e) {},
  onDragLeave(e) {},
  onBeforeDrop(e) { return true; },  // false rejects (items fly back); Key[] accepts a subset; may be async
  onDrop(e) {
    // e.active.ids, e.active.items[i].data, e.over, e.source?.remove()
  },
});
```

- `isAccepting`: something is being dragged and this target takes it (highlight valid zones).
- `placement`: `{ top, right, bottom, left }` halves of the target under the pointer
  (e.g. "drop before/after this card"). `null` when not hovered.
- **Untyped draggables fit any string rule.** Omitting `accept` (or `'*'`) takes everything.
- `onDrop` of a plain droppable is where *you* change your data. The library moves nothing.

### Removing items from a sortable list (trash zone)

A drag from a sortable list carries `e.source`. Call `e.source.remove()` in `onDrop` and
the list drops the items. Its `onDrop` runs with `to.index === -1`, and `e.result` has
the list without them.

```ts
makeDroppable(trash, { onDrop: (e) => e.source?.remove() });
```

### Drop into an item (folders, combining)

Put a droppable on (or inside) a sortable item's element. While the item's list would sort
the drag, the target counts only in the middle of the item (25–75% along the list's axis).
There the drop goes into the item and the list doesn't move. Near the edges the list
sorts as usual. A target whose `accept` refuses the drag is skipped, so the list sorts
over it. A target never receives its own drag.

```ts
// FolderRow.vue: a sortable row that also takes files
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.folder });
const { isOver } = makeDroppable(el, {
  accept: 'file',
  onDrop: (e) => {
    props.folder.children.push(...e.active.items.map((entry) => entry.item as File));
    e.source?.remove();   // take them out of the list they came from
  },
});
```

If the item is no longer shown after such a drop, the overlay shrinks into the target
instead of flying back.

## Collision detection

The provider's `collision` picks the target, and the best candidate comes first:

| Function | Picks |
| --- | --- |
| `pointerFirst` (default) | Targets under the pointer (hit-tested, so z-order and shadow roots count); when there are none, what the overlay overlaps most. |
| `pointerWithin` | Only targets under the pointer. |
| `rectIntersection` | Largest overlap with the overlay. |
| `closestCenter` | Closest center to the overlay's center. |
| `closestCorners` | Closest corners (good for kanban columns of different heights). |

Custom: `(args: { pointer, overlayRect, candidates, hits }) => Key[]`. Candidate rects are
already clipped by scroll containers and the viewport.

## Modifiers

Modifiers adjust the drag offset every frame. The provider's `modifiers` always run
first. After them run the dragged item's own `modifiers` (`makeDraggable` or
`makeSortableItem`), or, when the item has none, its list's or tree's.

```ts
import {
  restrictToVerticalAxis, restrictToHorizontalAxis,
  restrictToWindowEdges, restrictToParent, restrictToElement, restrictToFirstScrollableAncestor,
  snapToGrid, snapCenterToCursor,
} from '@vue-dnd-kit/core';

makeSortableList(listRef, { items, axis: 'y' });   // axis lock: the `axis` option (lists, trees, items, draggables)
makeDraggable(el, { modifiers: [restrictToElement(boardRef)] });
makeDraggable(el, { modifiers: [snapToGrid({ x: 32, y: 32, origin: 'container', smooth: true })] });
```

- `restrictToParent` keeps the overlay inside the sortable list, or for plain draggables
  inside the parent element.
- `snapToGrid(size)` takes a number or `{ x, y, origin: 'container' | 'delta', smooth }`.
  `smooth` glides the overlay between cells, while collision uses the snapped position at once.
- Custom: `({ transform, active, activeRect, overlayRect, origin, containerRect, windowRect, over }) => ({ x, y })`.
- **Axis lock:** prefer `axis: 'x' | 'y'` over `restrictToHorizontalAxis` /
  `restrictToVerticalAxis`. It runs after all modifiers, so the lock always holds. An
  item's own `axis` wins over its list's.
- Options read "when the drag starts" accept getters, so an axis lock can be toggled:
  `axis: () => (locked.value ? 'y' : undefined)`.
