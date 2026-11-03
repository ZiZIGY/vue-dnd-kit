---
title: "makeSortableList"
description: "让容器成为可排序列表——一份拖拽时重新排序的草稿，在放置时写回。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/make-sortable-list"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableList">



</api-signature>

```ts
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: tasks, group: 'board' });
```

列表的行调用 [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item)。参见[可排序列表](https://zizigy.github.io/docs/guides/sortable-lists)和[共享项的列表](https://zizigy.github.io/docs/guides/shared-lists)。

<example height="34rem" hint="切换选项，然后拖动一个图块" name="sortable-options">



</example>

## 选项

<api-table name="SortableListOptions">



</api-table>

## 返回值

<api-table name="SortableListReturn">



</api-table>

## 分组

<api-table name="SortableGroupOptions">



</api-table>

<api-table name="SortablePutContext">



</api-table>

## 放置事件

`onBeforeDrop` 和 `onDrop` 收到的内容。

<api-table name="SortableDropEvent">



</api-table>

## 指示器

`placeholder: 'indicator'` 模式下 `indicator` 包含的内容。

<api-table name="SortableIndicator">



</api-table>

## 取值

<api-table name="SortableItems">



</api-table>

<api-table name="SortableStrategy">



</api-table>

<api-table name="SortableBehavior">



</api-table>

<api-table name="SortablePlaceholder">



</api-table>

<api-table name="MultipleMode">



</api-table>

<api-table name="DropOutside">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
