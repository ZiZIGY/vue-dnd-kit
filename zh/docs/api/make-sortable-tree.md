---
title: "makeSortableTree"
description: "让容器成为可排序树，以带深度的扁平形式渲染——通过横向拖动或悬停在节点上来嵌套。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/make-sortable-tree"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeSortableTree<T>(
  target: MaybeElementRef,
  options: SortableTreeOptions<T>,
): SortableTreeReturn<T>;
```

```ts
const root = useTemplateRef<HTMLElement>('root');
const { items } = makeSortableTree(root, { items: files, indentation: 20, collapsed });
```

渲染 `items`（带有 `depth` 的扁平节点）；每一行都以 `id: () => node.key` 调用 [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item)。参见[树](https://zizigy.github.io/docs/guides/trees)。

<example height="26rem" hint="切换一个选项，然后横向拖动一行" name="api-tree-options">



</example>

## 选项

<api-table name="SortableTreeOptions">



</api-table>

## 返回值

<api-table name="SortableTreeReturn">



</api-table>

## 扁平节点

<api-table name="FlatNode">



</api-table>

## 投影

<api-table name="TreeProjection">



</api-table>

<api-table name="TreeNesting">



</api-table>

## 放置事件

<api-table name="SortableTreeDropEvent">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
