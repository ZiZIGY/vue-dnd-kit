---
title: "makeSortableItem"
description: "Registers a row of a sortable list or tree — it drags, makes room and lands in its slot."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/api/make-sortable-item"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableItem">



</api-signature>

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isPlaceholder, index } = makeSortableItem(el, { item: () => props.task, handle: '.grip' });
```

See [Sortable lists](https://zizigy.github.io/docs/guides/sortable-lists).

<example height="24rem" hint="Drag a row by its grip: the checkbox still works" name="todo-list">



</example>

## Options

<api-table name="SortableItemOptions">



</api-table>

## Returns

<api-table name="SortableItemReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
