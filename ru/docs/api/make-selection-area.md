---
title: "makeSelectionArea"
description: "Рамка выделения, которая выделяет перетаскиваемые элементы, которых касается, — потащите один из них, и поедет всё выделение."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/make-selection-area"
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

Нажатие на пустом месте области начинает рамку. См.
[мульти-драг и выделение](https://zizigy.github.io/docs/guides/multi-drag).

<example height="27rem" hint="Нарисуйте рамку на пустом месте, затем перетащите выделенную фигуру" name="api-selection-area">



</example>

## Опции

<api-table name="SelectionAreaOptions">



</api-table>

## Возвращает

<api-table name="SelectionAreaReturn">



</api-table>

## Значения

<api-table name="SelectionStrategy">



</api-table>

<api-table name="SelectionModifier">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
