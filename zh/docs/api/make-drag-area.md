---
title: "makeDragArea"
description: "为在某个元素内部开始的拖拽设定规则——轴、边界、网格、自动滚动、激活——全部在同一个应用级 provider 之下。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/make-drag-area"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeDragArea(
  target: MaybeElementRef,
  options?: DragAreaOptions,
): DragAreaReturn;
```

```ts
const board = useTemplateRef<HTMLElement>('board');
makeDragArea(board, { restrictToArea: true, modifiers: [snapToGrid(24)] });
```

区域嵌套时，最近的区域优先，但 `disabled` 例外，它会被内层区域继承。参见[轴、边界与网格](https://zizigy.github.io/docs/guides/constraints)。

区域内的标签遵循它的规则；区域外的那个可以自由拖动。

<example height="36rem" hint="切换区域的规则，然后拖动区域内的一个标签" name="api-drag-area">



</example>

## 选项

<api-table name="DragAreaOptions">



</api-table>

## 返回值

<api-table name="DragAreaReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
