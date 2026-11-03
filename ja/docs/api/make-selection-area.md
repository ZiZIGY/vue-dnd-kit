---
title: "makeSelectionArea"
description: "触れたドラッグ可能な要素を選択する選択枠。その 1 つをドラッグすると、選択全体が一緒に移動します。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/api/make-selection-area"
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

エリアの空いている場所を押すと選択枠が始まります。[マルチドラッグと選択](https://zizigy.github.io/docs/guides/multi-drag)を参照してください。

<example height="27rem" hint="空いている場所に枠を描いてから、選択した図形をドラッグしてみましょう" name="api-selection-area">



</example>

## オプション

<api-table name="SelectionAreaOptions">



</api-table>

## 返り値

<api-table name="SelectionAreaReturn">



</api-table>

## 値

<api-table name="SelectionStrategy">



</api-table>

<api-table name="SelectionModifier">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
