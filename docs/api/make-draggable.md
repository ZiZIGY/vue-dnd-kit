---
title: "makeDraggable"
description: "Makes an element draggable — free dragging, or into the drop targets that accept it."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/api/make-draggable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeDraggable">



</api-signature>

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isDragging } = makeDraggable(el, { id: 'card', type: 'card', data: { title } });
```

See [Drag and drop](https://zizigy.github.io/docs/guides/drag-and-drop). Sortable items are draggables too:
[`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) takes the same options and more.

<example height="22rem" hint="Drag each card. Let go, and it goes back" name="draggable">



</example>

## Options

<api-table name="DraggableOptions">



</api-table>

## Returns

<api-table name="DraggableReturn">



</api-table>

## Out of the page

What a `native` drag carries out of the page. See [files and other apps](https://zizigy.github.io/docs/guides/native#out-of-the-page).

<api-table name="NativeDragOptions">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
