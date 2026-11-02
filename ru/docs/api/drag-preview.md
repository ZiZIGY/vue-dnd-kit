---
title: "DragPreview и пропсы оверлея"
description: "Клон перетаскиваемого элемента для своих оверлеев, которые сами раскладывают несколько элементов, — и пропсы, которые получают компоненты оверлея."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/drag-preview"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="29rem" hint="Выделите плитки, перетащите одну из них. Alt копирует" name="api-drag-preview">



</example>

## DragPreview

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

Клоны снимаются в момент захвата: со взятого элемента и с соседних с ним в порядке броска,
столько, сколько задаёт `overlayPreviews` провайдера (по умолчанию 5). Для любого другого
элемента `DragPreview` рендерит свой слот по умолчанию или ничего. При броске каждое превью
летит на свой элемент; при броске в зону (папку, корзину) превью уходят в неё одно за другим. См.
[руководство по оверлею](https://zizigy.github.io/docs/guides/overlay).

<api-table name="DragPreviewProps">



</api-table>

## Пропсы оверлея

Что получают компонент оверлея (опция `overlay` у перетаскиваемых элементов, элементов
сортируемых списков, списков и деревьев) и слот `#overlay` провайдера.

<api-table name="OverlaySlotProps">



</api-table>

`OverlayProps` — тот же тип, для `defineProps<OverlayProps>()`.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
