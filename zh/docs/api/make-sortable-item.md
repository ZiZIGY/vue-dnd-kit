---
title: "makeSortableItem"
description: "注册可排序列表或树的一行——它可以被拖拽、为其他项让出空间，并落到自己的位置上。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/make-sortable-item"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableItem">



</api-signature>

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isPlaceholder, index } = makeSortableItem(el, { item: () => props.task, handle: '.grip' });
```

参见[可排序列表](https://zizigy.github.io/docs/guides/sortable-lists)。

<example height="24rem" hint="通过手柄拖动一行：复选框照样可用" name="todo-list">



</example>

## 选项

<api-table name="SortableItemOptions">



</api-table>

## 返回值

<api-table name="SortableItemReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
