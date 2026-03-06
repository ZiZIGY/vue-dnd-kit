# Sorting Lists

Sortable lists with Vue DnD Kit v2 using the new `DnDProvider`, `makeDraggable`, and `makeDroppable` API.

<script setup>
import Example from '@examples-v2/SortingLists/Example.vue';
</script>

## Demo

<Example />

## Overview

This example demonstrates:

1. **Internal sorting** — reorder items inside a list
2. **Cross-list transfers** — move items between two lists
3. **TransitionGroup animations** — smooth movement
4. **High-level helpers** — `event.helpers.suggestSort()` to avoid manual index math

## Droppable lists

Each list is a droppable zone with its items passed as payload. On drop we use `suggestSort('vertical')`:

```ts
import { makeDroppable } from '@vue-dnd-kit/core';
import type { IDragEvent } from '@vue-dnd-kit/core';

function applySort(e: IDragEvent) {
  const result = e.helpers.suggestSort('vertical');
  if (!result) return;

  const srcItems = e.draggedItems[0]?.items as Item[] | undefined;
  const tgtItems = (e.hoveredDraggable?.items ?? e.dropZone?.items) as
    | Item[]
    | undefined;

  if (!srcItems) return;

  // Update source list
  if (srcItems === firstColumn.value) {
    firstColumn.value = result.sourceItems as Item[];
  } else if (srcItems === secondColumn.value) {
    secondColumn.value = result.sourceItems as Item[];
  }

  // If moved to another list — update target list
  if (!result.sameList && tgtItems) {
    if (tgtItems === firstColumn.value) {
      firstColumn.value = result.targetItems as Item[];
    } else if (tgtItems === secondColumn.value) {
      secondColumn.value = result.targetItems as Item[];
    }
  }
}

makeDroppable(
  firstColumnRef,
  {
    events: {
      onDrop(e) {
        applySort(e);
      },
    },
  },
  () => firstColumn.value
);
```

Key points:

- `event.draggedItems` — all dragged items (supports multi-drag)
- `event.dropZone` / `event.hoveredDraggable` — where the cursor is
- `event.helpers.suggestSort('vertical')` — returns source/target arrays and indices

## Draggable items

List items only need `makeDraggable` bound to a ref:

```vue
<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  const { isDragging } = makeDraggable(itemRef);
</script>

<template>
  <div
    ref="itemRef"
    class="draggable"
    :class="{ 'draggable--dragging': isDragging }"
  >
    <slot />
  </div>
</template>
```

## Animations with `TransitionGroup`

Sorting animation is done purely via Vue transitions:

```vue
<TransitionGroup name="list">
  <DraggableItem
    v-for="item in firstColumn"
    :key="item.id"
  >
    {{ item.name }}
  </DraggableItem>
</TransitionGroup>
```

```css
.list-move {
  transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.list-enter-active,
.list-leave-active {
  transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.list-leave-active {
  position: absolute;
  pointer-events: none;
}
```

## Source

- [Sorting Lists example component](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/SortingLists/Example.vue)

## Best practices

- Always use **stable keys** (`item.id`) for list items
- Keep all **data updates inside `onDrop`** — UI only reacts to changed arrays
- Prefer helpers (`suggestSort`, `suggestSwap`, `suggestCopy`, `suggestRemove`) over manual index juggling
- For complex boards (Kanban, dashboards, trees), build on the same pattern: droppable columns + draggable items + helper-based operations
