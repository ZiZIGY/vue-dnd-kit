---
title: "makeDraggable"
description: "Macht ein Element ziehbar – frei oder in die Drop-Ziele, die es annehmen."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/api/make-draggable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeDraggable<TData = unknown>(
  target: MaybeElementRef,
  options?: DraggableOptions<TData>,
): DraggableReturn;
```

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isDragging } = makeDraggable(el, { id: 'card', type: 'card', data: { title } });
```

Siehe [Drag and Drop](https://zizigy.github.io/docs/guides/drag-and-drop). Auch sortierbare Elemente sind ziehbare
Elemente: [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) nimmt dieselben Optionen und mehr.

<example height="22rem" hint="Ziehe jede Karte. Lass los, und sie kehrt zurück" name="draggable">



</example>

## Optionen

<api-table name="DraggableOptions">



</api-table>

## Rückgabe

<api-table name="DraggableReturn">



</api-table>

## Aus der Seite hinaus

Was ein `native`-Drag aus der Seite hinausträgt. Siehe [Dateien und andere Apps](https://zizigy.github.io/docs/guides/native#out-of-the-page).

<api-table name="NativeDragOptions">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
