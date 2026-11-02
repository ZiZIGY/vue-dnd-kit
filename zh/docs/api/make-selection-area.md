---
title: "makeSelectionArea"
description: "选中它所碰到的可拖拽元素的选框——拖动其中一个，整个选中集合就会一起移动。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/make-selection-area"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeSelectionArea(
  target: MaybeElementRef,
  options?: SelectionAreaOptions,
): SelectionAreaReturn;
```

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

在区域的空白处按下会开始画选框；选框由你自己渲染。参见[多项拖拽与选择](https://zizigy.github.io/docs/guides/multi-drag)。

<example height="27rem" hint="在空白处画框，然后拖动一个选中的形状" name="api-selection-area">



</example>

## 选项

<api-table name="SelectionAreaOptions">



</api-table>

## 返回值

<api-table name="SelectionAreaReturn">



</api-table>

## 取值

<api-table name="SelectionStrategy">



</api-table>

<api-table name="SelectionModifier">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
