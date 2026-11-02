---
title: "DragPreview 与浮层 props"
description: "被拖拽项的克隆，用于自行布局多个项的自定义浮层——以及浮层组件收到的 props。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/drag-preview"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="29rem" hint="选中几个图块，拖动其中一个。Alt 复制" name="api-drag-preview">



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

克隆在拿起时生成：抓起的项，以及按放置顺序与它相邻的其他项，数量为 provider 的 `overlayPreviews`（默认 5 个）。对于其他任何项，`DragPreview` 渲染它的默认插槽，或者什么都不渲染。放置时，每个预览飞向它自己对应的项；放置进某个区域（文件夹、回收站）时，预览依次进入该区域。参见[浮层指南](https://zizigy.github.io/docs/guides/overlay)。

<api-table name="DragPreviewProps">



</api-table>

## 浮层 props

浮层组件（可拖拽元素、可排序项、列表和树的 `overlay` 选项）和 provider 的 `#overlay` 插槽收到的内容。

<api-table name="OverlaySlotProps">



</api-table>

`OverlayProps` 是同一个类型，用于 `defineProps<OverlayProps>()`。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
