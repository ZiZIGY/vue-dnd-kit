---
title: "makeDraggable"
description: "让元素可拖拽——自由拖拽，或拖进接收它的放置目标。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/make-draggable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeDraggable">



</api-signature>

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isDragging } = makeDraggable(el, { id: 'card', type: 'card', data: { title } });
```

参见[拖放](https://zizigy.github.io/docs/guides/drag-and-drop)。可排序项也是可拖拽元素：[`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) 接受相同的选项，并且还有更多。

<example height="22rem" hint="逐个拖动卡片。松开后，它会回到原处" name="draggable">



</example>

## 选项

<api-table name="DraggableOptions">



</api-table>

## 返回值

<api-table name="DraggableReturn">



</api-table>

## 拖出页面

`native` 拖拽把什么带出页面。参见[文件与其他应用](https://zizigy.github.io/docs/guides/native#out-of-the-page)。

<api-table name="NativeDragOptions">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
