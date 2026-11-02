---
title: "makeDroppable"
description: "Makes an element a drop target, with rules for what it takes and hooks for the drop."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/api/make-droppable"
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

See [Drag and drop](https://zizigy.github.io/docs/guides/drag-and-drop) and [Deciding a drop](https://zizigy.github.io/docs/guides/drop-decisions).

<example height="26rem" hint="Drop the files on the zones that take them" name="droppable">



</example>

## Options

<api-table name="DroppableOptions">



</api-table>

## Returns

<api-table name="DroppableReturn">



</api-table>

## Accept rules

<api-table name="AcceptRule">



</api-table>

<api-table name="AcceptContext">



</api-table>

<api-table name="AcceptMode">



</api-table>

## From outside the page

What `external` takes from drags that come from outside the page, and what such a drag
carries (`e.external`). See [files and other apps](https://zizigy.github.io/docs/guides/native).

<api-table name="ExternalAccept">



</api-table>

<api-table name="ExternalData">



</api-table>

<api-table name="ExternalFile">



</api-table>

## Placement

<api-table name="Placement">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
