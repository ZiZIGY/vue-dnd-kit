---
title: "makeSortableItem"
description: "注册可排序列表或树的一行——它可以被拖拽、为其他项让出空间，并落到自己的位置上。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/make-sortable-item"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeSortableItem<TData = unknown>(
  target: MaybeElementRef,
  options: SortableItemOptions<TData>,
): SortableItemReturn;
```

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isPlaceholder, index } = makeSortableItem(el, { item: () => props.task, handle: '.grip' });
```

在行组件中调用它，行组件渲染在列表的元素内部（同一个组件创建了多个列表时，行加入包住它的最内层列表）。用 `item`（以列表的 `getKey` 生成 key，默认为 `item.id`）或 `id` 来标识这一行。参见[可排序列表](https://zizigy.github.io/docs/guides/sortable-lists)。

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
