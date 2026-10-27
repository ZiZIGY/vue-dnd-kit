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
  onBeforeDrop(e) { return 'accept'; }, // 'reject' (or false): items fly back; Key[]: a subset; 'continue': the drag goes on; may be async
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

### Leaving an item where it was dropped (a board, a canvas)

Every event has `position`: the dragged box's top-left corner in `over`, from its padding
edge and with its scroll, i.e. the `left`/`top` that put an absolutely positioned item
where it was dropped. `null` over nothing. Don't compute it from `active.rect` and `delta`
(that misses the target's border and scroll).

```ts
makeDroppable(board, { id: 'board' });
useDnDMonitor({
  onDragEnd({ active, over, position }) {
    const note = notes.value.find((item) => item.id === active.id);
    if (!note || over?.id !== 'board' || !position) return;
    note.x = Math.round(position.x);
    note.y = Math.round(position.y);
  },
});
```

### Removing items from a sortable list (trash zone)

A drag from a sortable list carries `e.source`. Call `e.source.remove()` in `onDrop` and
the list drops the items. Its `onDrop` runs with `to.index === -1`, and `e.result` has
the list without them.

```ts
makeDroppable(trash, { onDrop: (e) => e.source?.remove() });
```

With the keyboard, an arrow past the end of the lists takes the item on to the next drop
target that way (the trash), and the opposite arrow brings it back to its slot.

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

Modifiers adjust the drag offset every frame. Their result moves the overlay and is also
the point where targets are looked for, so a list sorts by the locked or snapped position.
They run in this order:

1. the provider's `modifiers`;
2. the `modifiers` of the drag area the drag started in (`makeDragArea`, below);
3. the dragged item's own `modifiers` (`makeDraggable` or `makeSortableItem`), or, when it
   has none, its list's or tree's;
4. the area's `restrictToArea`;
5. the axis lock (`axis`).

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

## Drag areas: makeDragArea

Rules for the drags that **start inside** an element: plain draggables and sortable items
alike. Use one app-wide `DnDProvider`, and give a board, a canvas or a feed its own rules
without a provider of its own. (A nested provider would also isolate the items: they
could never leave it.) It replaces v2's `makeConstraintArea` and `makeAutoScroll`.

```ts
const board = useTemplateRef<HTMLElement>('board');
const { isDragging, isAutoScrolling } = makeDragArea(board, {
  modifiers: [snapToGrid(20)],     // after the provider's, before the draggable's own
  restrictToArea: true,            // the drags stay inside the area
  axis: 'y',                       // a draggable's own axis (or its list's) wins
  autoScroll: { maxSpeed: 15 },    // this container's auto-scroll (false: off)
  activation: { touch: { delay: 400 } }, // per pointer kind; a draggable's own wins
  disabled: () => readOnly.value,  // no drag starts here (nor in areas inside)
});
```

- The closest area wins when areas are nested. `disabled` is the exception: it is inherited.
- Every option takes a value, a ref or a getter, and is read when a press or a drag starts.
- `autoScroll` applies to the area's scroll container (the element or its closest
  scrollable ancestor) for any drag that scrolls it.
- `isDragging`: a drag that started in this area runs. `isAutoScrolling`: auto-scroll is
  moving the area's container.
- Collision detection, keyboard keys and announcements stay provider-wide.
