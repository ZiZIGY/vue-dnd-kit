---
title: "makeSortableList"
description: "Makes a container a sortable list — a draft that reorders while you drag, written back on drop."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/api/make-sortable-list"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableList">



</api-signature>

```ts
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: tasks, group: 'board' });
```

Its rows call [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item). See
[Sortable lists](https://zizigy.github.io/docs/guides/sortable-lists) and [Lists that share items](https://zizigy.github.io/docs/guides/shared-lists).

<example height="34rem" hint="Switch the options, then drag a tile" name="sortable-options">



</example>

## Options

<api-table name="SortableListOptions">



</api-table>

## Returns

<api-table name="SortableListReturn">



</api-table>

## Groups

<api-table name="SortableGroupOptions">



</api-table>

<api-table name="SortablePutContext">



</api-table>

## The drop event

What `onBeforeDrop` and `onDrop` get.

<api-table name="SortableDropEvent">



</api-table>

## Indicator

What `indicator` holds in `placeholder: 'indicator'` mode.

<api-table name="SortableIndicator">



</api-table>

## Values

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
