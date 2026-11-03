---
title: "makeSelectionArea"
description: "Ein Auswahlrahmen, der die ziehbaren Elemente auswählt, die er berührt – ziehe eines davon, und die ganze Auswahl bewegt sich mit."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/api/make-selection-area"
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

Ein Druck auf eine leere Stelle des Bereichs startet den Rahmen. Siehe
[Multi-Drag und Auswahl](https://zizigy.github.io/docs/guides/multi-drag).

<example height="27rem" hint="Ziehe einen Rahmen auf der freien Fläche auf, dann ziehe eine ausgewählte Form" name="api-selection-area">



</example>

## Optionen

<api-table name="SelectionAreaOptions">



</api-table>

## Rückgabe

<api-table name="SelectionAreaReturn">



</api-table>

## Werte

<api-table name="SelectionStrategy">



</api-table>

<api-table name="SelectionModifier">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
