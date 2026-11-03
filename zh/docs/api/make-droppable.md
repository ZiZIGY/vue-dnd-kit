---
title: "makeDroppable"
description: "让元素成为放置目标，带有决定接收什么的规则和用于放置的钩子。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/make-droppable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeDroppable">



</api-signature>

```ts
const zone = useTemplateRef<HTMLElement>('zone');
const { isOver, isAccepting } = makeDroppable(zone, {
  accept: 'image',
  onDrop: (e) => move(e.active.id),
});
```

参见[拖放](https://zizigy.github.io/docs/guides/drag-and-drop)和[决定放置](https://zizigy.github.io/docs/guides/drop-decisions)。

<example height="26rem" hint="把文件放到接收它们的区域上" name="droppable">



</example>

## 选项

<api-table name="DroppableOptions">



</api-table>

## 返回值

<api-table name="DroppableReturn">



</api-table>

## 接收规则

<api-table name="AcceptRule">



</api-table>

<api-table name="AcceptContext">



</api-table>

<api-table name="AcceptMode">



</api-table>

## 来自页面之外

`external` 从来自页面之外的拖拽中接收什么，以及这类拖拽携带什么（`e.external`）。参见[文件与其他应用](https://zizigy.github.io/docs/guides/native)。

<api-table name="ExternalAccept">



</api-table>

<api-table name="ExternalData">



</api-table>

<api-table name="ExternalFile">



</api-table>

## 位置

<api-table name="Placement">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
