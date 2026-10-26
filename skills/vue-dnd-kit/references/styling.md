# Styling drag states

The library styles almost nothing itself. State comes from the composables' returned
refs and from a few `data-dnd-*` attributes.

## Default styles

With `defaultStyles` (on by default), zero-specificity CSS (`:where()`) is injected once
per document, so any rule of yours overrides it:

```css
:where([data-dnd-placeholder]) { opacity: 0.4; }                 /* the slot a dragged item lands in */
:where([data-dnd-dragging]:not(html)) { opacity: 0.4; }          /* multi-drag 'gaps': left behind */
:where(html[data-dnd-dragging], html[data-dnd-dragging] *) { user-select: none !important; overflow-anchor: none !important; }
:where(html[data-dnd-dragging="pointer"], html[data-dnd-dragging="pointer"] *) { cursor: grabbing !important; }
```

`:default-styles="false"` turns them off.

## Attributes

| Attribute | On | When |
| --- | --- | --- |
| `data-dnd-placeholder` | sortable item | It is the slot a dragged item will land in (`isPlaceholder`). |
| `data-dnd-dragging` | sortable item | Dragged but left in place (multi-drag `'gaps'`). |
| `data-dnd-dragging="pointer" \| "keyboard"` | `<html>` | For the whole drag. |
| `data-dnd-overlay` | overlay box | Always (the box is `position: fixed`, `pointer-events: none`). |
| `data-dnd-leaving` | leave copies of `animate` | While an item that left fades out. |
| `data-dnd-no-clone` | **you** set it | Leaves that element out of the overlay clone. |

## Returned state

```ts
// makeSortableItem
const { isDragging, isPlaceholder, selected, indicator, index } = makeSortableItem(el, …);
// makeSortableList / makeSortableTree
const { isOver, isAccepting, indicator, activeKey } = makeSortableList(listRef, …);
// makeDraggable / makeDroppable
const { isDragging, selected, transform } = makeDraggable(el, …);
const { isOver, isAccepting, placement } = makeDroppable(zone, …);
// anywhere
const { status, active, over } = useDnD();
```

Typical styling:

```vue
<li ref="el" :class="{ hole: isPlaceholder, selected }">…</li>
<ul ref="list" :class="{ 'can-drop': isAccepting, over: isOver }">…</ul>
```

```css
.hole { opacity: 1; background: repeating-linear-gradient(45deg, #eee 0 6px, #f8f8f8 6px 12px); }
.hole > * { visibility: hidden; }          /* show an empty slot instead of a faded copy */
.can-drop { outline: 2px dashed #93c5fd; }
.over { background: #eff6ff; }
html[data-dnd-dragging] .drag-hint { display: block; }
```

## Refused targets

`over.accepted` (from `useDnD()`, or `accepted` in overlay props) is `false` over a
target that refuses the drag. Use it to tint the overlay red. Droppables only report
`isOver` while they accept the drag.

## Cursor

`cursor: grab` on draggable items is yours to add. While dragging, the grabbing cursor is
set for the whole document.
