---
title: "DragPreview and overlay props"
description: "The clone of a dragged item, for custom overlays that lay out several items themselves — and the props overlay components get."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/api/drag-preview"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="29rem" hint="Select tiles, drag one of them. Alt copies" name="api-drag-preview">



</example>

## DragPreview

<api-signature name="DragPreview">



</api-signature>

```vue [StackOverlay.vue]
<script setup lang="ts">
import { DragPreview, type DragItem } from '@vue-dnd-kit/core';

defineProps<{ items: DragItem[] }>();
</script>

<template>
  <div class="stack">
    <DragPreview v-for="item in items.slice(0, 3)" :id="item.id" :key="item.id" />
  </div>
</template>
```

Clones are taken at pickup, of the grabbed item and of the others next to it in drop order,
as many as the provider's `overlayPreviews` (5 by default). For any other item `DragPreview`
renders its default slot, or nothing. On drop each preview flies to its own item; dropped
into a zone (a folder, a trash can), the previews go in one after another. See
[the overlay guide](https://zizigy.github.io/docs/guides/overlay).

<api-table name="DragPreviewProps">



</api-table>

## Overlay props

What an overlay component (the `overlay` option of draggables, sortable items, lists and
trees) and the provider's `#overlay` slot get.

<api-table name="OverlaySlotProps">



</api-table>

<api-table name="OverlayProps">



</api-table>

<api-table name="DropDestination">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
