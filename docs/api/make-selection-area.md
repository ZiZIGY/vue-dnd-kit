---
title: "makeSelectionArea"
description: "A rubber band that selects the draggables it touches — drag one of them and the whole selection travels."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/api/make-selection-area"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSelectionArea">



</api-signature>

```vue
<script setup lang="ts">
const area = useTemplateRef<HTMLElement>('area');
const { isSelecting, style } = makeSelectionArea(area);
</script>

<template>
  <div ref="area" class="area">
    <!-- items -->
    <div v-if="isSelecting" class="band" :style="style" />
  </div>
</template>
```

A press on the empty space of the area starts the band. See
[Multi-drag and selection](https://zizigy.github.io/docs/guides/multi-drag).

<example height="27rem" hint="Draw a box on the empty space, then drag a selected shape" name="api-selection-area">



</example>

## Options

<api-table name="SelectionAreaOptions">



</api-table>

## Returns

<api-table name="SelectionAreaReturn">



</api-table>

## Values

<api-table name="SelectionStrategy">



</api-table>

<api-table name="SelectionModifier">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
