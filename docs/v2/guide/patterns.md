# Patterns & Concepts

Common patterns and frequently misunderstood concepts.

## `items` vs `data` — two different payloads

These are separate options on `makeDraggable` / `makeDroppable` with different purposes:

| | `items` (3rd argument) | `data` option |
|---|---|---|
| **Purpose** | Identifies which array this element belongs to — used by `suggestSort`, `suggestSwap`, etc. | Custom payload for your app logic (read via `e.draggedItems[0].data`) |
| **Type** | `() => [index, array]` for draggables, `() => array` for droppables | `() => any` |
| **Used by helpers** | Yes | No |

```ts
// items = [index, siblings] — required for suggestSort to work
makeDraggable(ref, { data: () => ({ id: 'card-1', priority: 'high' }) }, () => [i, list]);

// In drop handler:
const r = e.helpers.suggestSort('vertical'); // uses items
const id = (e.draggedItems[0].data as { id: string }).id; // uses data
```

## `hoveredDraggable?.items ?? dropZone?.items`

When deciding *which* array is the drop target, always prefer `hoveredDraggable`:

```ts
const tgtArr = e.hoveredDraggable?.items ?? e.dropZone?.items;
```

- **`hoveredDraggable`** — the draggable element currently under the cursor. Its `items` is the sibling array it belongs to → sorting among peers.
- **`dropZone`** — the droppable zone that received the drop. Its `items` is the zone's own array → dropping into a zone (e.g. a folder, a kanban column).

If the cursor is over an item inside a zone, *both* are set. Preferring `hoveredDraggable` makes the pointer position decide where the dragged item lands, not just which zone it entered.

## Identity checks instead of searching

When you have multiple lists, never use `find` or `indexOf` to figure out which list an item came from. Use reference equality (`===`) instead:

```ts
// ✅ O(1) — direct identity check
const srcItems = e.draggedItems[0]?.items as Item[];
if (srcItems === listA.value) listA.value = r.sourceItems as Item[];
else if (srcItems === listB.value) listB.value = r.sourceItems as Item[];

// ❌ O(n) — unnecessary search
const foundIn = [listA, listB].find(l => l.value.some(x => x === dragged));
```

This works because `items` is the exact array reference you passed to `makeDraggable`.

## `sameList` — don't apply twice

`suggestSort` / `suggestCopy` returns `sameList: boolean`. When sorting within the same list, `sourceItems` and `targetItems` are the same result array — only update once:

```ts
const r = e.helpers.suggestSort('vertical');
if (!r) return;

applyToList(srcArr, r.sourceItems); // always update source
if (!r.sameList) {
  applyToList(tgtArr, r.targetItems); // only update target when different lists
}
```

If you apply both unconditionally when `sameList` is `true`, the second write overwrites the first with an identical array — harmless but wasteful.

## Kanban: discriminating column moves vs card moves

A kanban board has two layers of draggables: columns and cards. Both share the same drop handler. Distinguish them via `items`:

```ts
function handleDrop(e: IDragEvent) {
  const srcItems = e.draggedItems[0]?.items as unknown[];

  if (srcItems === columns.value) {
    // Dragging a column — reorder columns horizontally
    const r = e.helpers.suggestSort('horizontal');
    if (r) columns.value = r.sourceItems as Column[];
    return;
  }

  // Dragging a card
  if (e.hoveredDraggable?.items === columns.value) return; // hovering column header — ignore

  const r = e.helpers.suggestSort('vertical');
  if (!r) return;

  // Find which columns are involved using identity checks
  const srcCol = columns.value.find(c => c.cards === srcItems)!;
  const tgtItems = e.hoveredDraggable?.items ?? e.dropZone?.items;
  const tgtCol = columns.value.find(c => c.cards === tgtItems)!;
  if (!srcCol || !tgtCol) return;

  srcCol.cards = r.sourceItems as Card[];
  if (!r.sameList) tgtCol.cards = r.targetItems as Card[];
}
```

## `suggestSort` result fields

```ts
interface ISuggestSortResult {
  sourceItems: unknown[];   // source list with dragged item(s) removed
  targetItems: unknown[];   // target list with dragged item(s) inserted
  draggedItems: unknown[];  // the dragged item(s)
  sourceIndexes: number[];  // original indexes of dragged items
  targetIndex: number;      // index where items were inserted
  mode: 'before' | 'after'; // insertion side
  sameList: boolean;        // source and target are the same array
}
```

`sourceItems` and `targetItems` are new arrays — assign them to replace your reactive refs.

## Reactive `disabled`

`disabled` accepts a plain boolean or a `Ref<boolean>`. Use a ref to toggle dynamically:

```ts
const isLocked = ref(false);

makeDroppable(zoneRef, { disabled: isLocked });

// Later:
isLocked.value = true; // zone stops accepting drops immediately
```

## Component must be a child of `<DnDProvider>`

`makeDraggable` and `makeDroppable` use `inject` internally. They must be called inside a component that is **rendered as a descendant** of `<DnDProvider>` — not in the same component that renders `<DnDProvider>`.

```vue
<!-- ❌ Wrong — makeDraggable and DnDProvider in the same component -->
<script setup>
makeDraggable(ref, ...); // inject will fail
</script>
<template>
  <DnDProvider>
    <div ref="ref" />
  </DnDProvider>
</template>

<!-- ✅ Correct — split into parent + child -->
<!-- Parent.vue -->
<template>
  <DnDProvider>
    <DraggableItem />
  </DnDProvider>
</template>

<!-- DraggableItem.vue -->
<script setup>
makeDraggable(ref, ...); // inject works — this component is a child of DnDProvider
</script>
```

## Multi-drag: `e.draggedItems` is an array

When using `makeSelectionArea` for multi-select, `e.draggedItems` contains all selected items. `suggestSort` handles them as a batch:

```ts
const r = e.helpers.suggestSort('vertical');
// r.sourceItems = source list with ALL dragged items removed
// r.targetItems = target list with ALL dragged items inserted at once
// r.sourceIndexes = original indexes of all dragged items
```

No special handling needed — `suggestSort` already accounts for multi-drag.

## `render` vs overlay customization

These are separate concerns:

| | `render` in `makeDraggable` | Custom preview (`DnDProvider` `#preview` slot) |
|---|---|---|
| **Scope** | Per-draggable — controls how *this item* looks when dragged | Global — controls the entire floating container for all drags |
| **When to use** | Different items need different drag appearances | Custom animation, backdrop blur, different positioning |
| **Access to drag data** | Via `useDnDProvider().entities.draggingMap` | Same |

Use `render` for per-item visual differences. Use a custom overlay for layout/animation of the container itself. See [Custom Render per Draggable](/v2/examples/custom-render) and [Changing Overlay](/v2/examples/changing-overlay).
