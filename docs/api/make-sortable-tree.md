---
title: "makeSortableTree"
description: "Makes a container a sortable tree, rendered flat with depths — nesting by a sideways drag or by hovering a node."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/api/make-sortable-tree"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableTree">



</api-signature>

```ts
const root = useTemplateRef<HTMLElement>('root');
const { items } = makeSortableTree(root, { items: files, indentation: 20, collapsed });
```

Each row calls [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) with `id: () => node.key`.
See [Trees](https://zizigy.github.io/docs/guides/trees).

<example height="26rem" hint="Switch an option, then drag a row sideways" name="api-tree-options">



</example>

## Options

<api-table name="SortableTreeOptions">



</api-table>

## Returns

<api-table name="SortableTreeReturn">



</api-table>

## Flat nodes

<api-table name="FlatNode">



</api-table>

## Projection

<api-table name="TreeProjection">



</api-table>

<api-table name="TreeNesting">



</api-table>

## The drop event

<api-table name="SortableTreeDropEvent">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
