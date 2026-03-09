# Copy

Duplicate items from a source catalog into a target canvas — source stays intact. Great for template builders, widget palettes, and any "pick from catalog" UI.

<script setup>
import Example from '@examples-v2/Copy/Example.vue';
</script>

## Demo

<Example />

Drag blocks from the **Blocks** catalog on the left into **Your Template** on the right. The catalog is never modified — only the template grows. Reorder items within the template freely.

## Overview

The copy pattern separates two zones:

- **Catalog** (source) — read-only palette of available items. Dragging from here clones the item.
- **Canvas** (target) — your composition. Items can be reordered by dragging within it.

Use cases:
- **Email / page template builder** — drag content blocks from a sidebar into a layout
- **Report composer** — add charts, tables, and metrics from a widget library
- **Form builder** — assemble form fields from a component palette

## Core logic

A single `handleDrop` discriminates between "copy from catalog" and "sort within canvas" by comparing array references:

```ts
function handleDrop(e: IDragEvent) {
  const srcItems = e.draggedItems[0]?.items as Block[] | undefined;
  const dropZoneItems = e.dropZone?.items as Block[] | undefined;

  const fromCatalog = srcItems === catalog.value;
  const fromTemplate = srcItems === template.value;
  const toTemplate = dropZoneItems === template.value;

  // Only react when the drop target is the template canvas.
  if (!toTemplate) return;

  if (fromCatalog) {
    // ── Dragging from catalog → copy into template ──────────────────────────
    const r = e.helpers.suggestCopy('vertical');
    if (!r) return;

    // Assign fresh IDs so each copy is independent
    const copies = (r.copiedItems as Block[]).map((b) => ({
      ...b,
      id: uid(),
      isPalette: false,
    }));

    // Rebuild template manually to avoid double-inserting targetItems
    const base = template.value;
    template.value = [
      ...base.slice(0, r.targetIndex),
      ...copies,
      ...base.slice(r.targetIndex),
    ];
    return;
  }

  if (fromTemplate) {
    // ── Dragging within template → sort ────────────────────────────────────
    const r = e.helpers.suggestSort('vertical');
    if (!r) return;
    template.value = r.sourceItems as Block[];
  }
}
```

Key points:
- **Identity check** (`===`) on `items` arrays is the correct way to tell zones apart — no `.find()` needed
- **Fresh IDs** — `suggestCopy` returns shallow copies from the original; always assign new IDs so they behave as independent entities
- **`r.targetIndex`** — the insertion point computed from the cursor position; use it to splice copies into the current `template` once (don't reuse `r.targetItems`).

## Droppable zones

Both the catalog and canvas register as droppables pointing to the same `handleDrop`:

In the Vue component, both zones are thin wrappers over `makeDroppable`, passing their `items` array and forwarding the `drop` event to the shared handler. For example, the canvas uses a `CopyDropZone` component:

```vue
<CopyDropZone
  class="panel-body panel-body--canvas"
  :items="template"
  @drop="handleDrop"
>
  <!-- template list -->
</CopyDropZone>
```

## Draggable items

Items expose their position via payload. When another item is dragged over them, `isDragOver` provides placement for the top/bottom indicator line — **except** for catalog (copy-only) items, where indicators are hidden so the palette is not shown as a sort target.

Use a **`copyOnly`** prop for blocks that are only meant to be dragged out (e.g. from the catalog). When `copyOnly` is true, placement is not shown and the item does not act as a drop target for reordering:

```vue
<script setup lang="ts">
  const props = defineProps<{
    index: number;
    items: Block[];
    block: Block;
    copyOnly?: boolean;
  }>();

  const { isDragging, isDragOver } = makeDraggable(itemRef, {}, () => [
    props.index,
    props.items,
  ]);

  const placement = computed(() =>
    props.copyOnly ? undefined : isDragOver.value
  );
</script>

<template>
  <div :class="{ 'is-dragging': isDragging }">
    <div v-if="placement?.top"  class="indicator indicator--top" />
    <div v-if="placement?.bottom" class="indicator indicator--bottom" />
    <slot />
  </div>
</template>
```

In the example, catalog blocks are rendered with `copy-only`; template blocks omit it so they show indicators and participate in sorting.

## Copy result shape

```ts
interface ISuggestCopyResult {
  targetItems: unknown[];  // target list after inserting copies (original items intact)
  copiedItems: unknown[];  // shallow copies of the dragged items
  targetIndex: number;     // insertion point
  mode: 'insert' | 'append' | 'prepend';
}
```

> The source list is **never modified** by `suggestCopy` — that's the whole point.

## Animations

Entry/exit animations with `TransitionGroup` give the copy action a satisfying feel:

```css
.list-move {
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.28s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.list-leave-active {
  position: absolute;
  width: 100%;
  pointer-events: none;
}
```

## See also

- [Sorting Lists](/v2/examples/sorting-lists) — reorder and transfer without copying
- [Swap](/v2/examples/swap) — exchange items instead of duplicating
- [makeDroppable](/v2/guide/core/make-droppable) — zone configuration

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Copy/Example.vue)
- [BlockItem.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Copy/BlockItem.vue)
- [CopyDropZone.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Copy/CopyDropZone.vue)
