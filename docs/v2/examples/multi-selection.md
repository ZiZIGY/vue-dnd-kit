# Multi Selection

Select multiple items — by clicking checkboxes or rubber-band drawing with `Ctrl` — then drag them all at once as a single batch.

<script setup>
import Example from '@examples-v2/MultiSelection/Example.vue';
</script>

## Demo

<Example />

**Three ways to select:**
1. Click a **checkbox** to toggle an individual item
2. Hold **Ctrl** and **drag** an empty area to rubber-band select all items the rect crosses
3. Mix both — checkboxes and rubber-band selections accumulate

Once items are selected, drag any one of them (by the **⠿ handle**) to reorder the whole selection.

## Checkbox selection

`makeDraggable` returns a `selected` writable computed ref. Bind it to a checkbox with `v-model`:

```vue
<script setup>
  const { isDragging, isDragOver, selected } = makeDraggable(
    itemRef,
    { dragHandle: '.handle' },
    () => [props.index, props.items]
  );
</script>

<template>
  <div ref="itemRef">
    <input v-model="selected" type="checkbox" />
    <span>{{ task.name }}</span>
    <button class="handle">⠿</button>
  </div>
</template>
```

Selecting an item adds it to the provider's selection set. Dragging any selected item automatically drags all selected items together.

## Rubber-band selection with `makeSelectionArea`

`makeSelectionArea` turns a container into a lasso zone. When the configured modifier key is held, a pointer-drag draws a selection rectangle and selects all draggable items inside it.

```ts
const { isSelecting, style } = makeSelectionArea(containerRef, {
  modifier: {
    keys: ['ControlLeft', 'ControlRight'],
    method: 'some',   // either Ctrl key triggers selection
  },
});
```

Render the selection rectangle using the returned `style`:

```vue
<div ref="containerRef" style="position: relative">
  <!-- Selection rectangle -->
  <div
    v-if="isSelecting"
    class="selection-rect"
    :style="style"
  />

  <TaskItem v-for="(task, i) in tasks" ... />
</div>
```

```css
.selection-rect {
  position: absolute;
  border: 1.5px solid var(--vp-c-brand-1);
  background-color: rgba(62, 175, 124, 0.1);
  pointer-events: none;
  z-index: 10;
}
```

::: tip Provider scope
`makeSelectionArea` must be called in a component that is a **descendant** of `<DnDProvider>` — not the same component that renders it. Both `makeSelectionArea` and `makeDroppable` use `inject` internally.
:::

## Multi-drag drop handler

`suggestSort` handles single and multi-drag identically — the returned `sourceItems` already has all selected items repositioned:

```ts
makeDroppable(
  listRef,
  {
    events: {
      onDrop(e) {
        const r = e.helpers.suggestSort('vertical');
        if (!r) return;
        tasks.value = r.sourceItems as Task[];
      },
    },
  },
  () => tasks.value
);
```

`e.draggedItems` contains one entry per dragged item, sorted by original index. You can read `e.draggedItems.length` in your overlay to show a count badge when multiple items are dragged.

## `modifier` options

| Field | Type | Description |
|---|---|---|
| `keys` | `string[]` | Key codes that activate selection (e.g. `'ControlLeft'`) |
| `method` | `'every'` \| `'some'` | `'every'` — all keys pressed; `'some'` — at least one |

Default is `{ keys: ['ControlLeft'], method: 'every' }`.

## See also

- [Drag Handle](/v2/examples/drag-handle) — restricting drag to a grip element
- [Sorting Lists](/v2/examples/sorting-lists) — multi-list transfer with multi-drag
- [makeDraggable](/v2/guide/core/make-draggable) — `selected` ref
- [makeSelectionArea](/v2/guide/core/make-selection-area) — full options reference
