# Styling drag states

The library styles almost nothing itself. State comes from the composables' returned
refs and from a few `data-dnd-*` attributes.

## Default styles

Zero-specificity CSS (`:where()`) is injected once per document, first in `<head>`, so any
rule of yours overrides it. Two parts:

```css
/* The looks (`defaultStyles`, on by default), in the cascade layer `vue-dnd-kit`, declared
   before any other, so layered CSS (Tailwind v4 utilities like
   `data-[dnd-placeholder]:opacity-100`, UI kits) overrides them too. */
@layer vue-dnd-kit {
  :where([data-dnd-placeholder]) { opacity: 0.4; }               /* the slot a dragged item lands in */
  :where([data-dnd-dragging]:not(html)) { opacity: 0.4; }        /* multi-drag 'gaps': left behind */
}
/* The behaviour: always injected. No text selection and no scroll anchoring while dragging
   (virtual lists rely on it), the drag cursor, no iOS link callout on a long press. */
:where(html[data-dnd-dragging], html[data-dnd-dragging] *) { user-select: none !important; overflow-anchor: none !important; }
:where(html[data-dnd-dragging="pointer"], html[data-dnd-dragging="pointer"] *) { cursor: var(--dnd-cursor, grabbing) !important; -webkit-touch-callout: none !important; }
```

`:default-styles="false"` drops only the looks. `--dnd-cursor` is the grabbed element's own
cursor (a `cursor: move` on a row stays during its drag), else `grabbing`.

## Attributes

| Attribute | On | When |
| --- | --- | --- |
| `data-dnd-placeholder` | sortable item | It is the slot a dragged item will land in (`isPlaceholder`). `="into"` while the drop goes into a drop target inside an item (a folder row). |
| `data-dnd-dragging` | sortable item | Dragged but left in place (multi-drag `'gaps'`). |
| `data-dnd-dragging="pointer" \| "keyboard"` | `<html>` | For the whole drag. |
| `data-dnd-overlay="dragging" \| "dropping"` | overlay box | Always (`position: fixed`, `pointer-events: none`): `dropping` while it lands or an async `onBeforeDrop` waits. The clone inside keeps the element's classes: style it with `[data-dnd-overlay] .row` (a descendant selector: the clone sits in `[data-dnd-overlay-content]`, not right under the box). |
| `data-dnd-overlay-content` | inside the overlay box | What the overlay shows; the provider's `overlayClass` goes on it. |
| `data-dnd-leaving` | leave copies of `animateChanges` | While an item that left fades out. |
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
target that refuses the drag. Use it to tint the overlay red. A droppable's `isOver` is
true over it whether it accepts or not: `isOver && !isAccepting` is a refusal (while a
drag runs).

## Cursor

`cursor: grab` on draggable items is yours to add. While dragging, the grabbed element's
cursor (or `grabbing` when it has none of its own) is set for the whole document.
