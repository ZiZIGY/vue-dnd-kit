---
title: "makeDroppable"
description: "Macht ein Element zu einem Drop-Ziel, mit Regeln dafür, was es annimmt, und Hooks für den Drop."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/api/make-droppable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeDroppable<TData = unknown>(
  target: MaybeElementRef,
  options?: DroppableOptions<TData>,
): DroppableReturn;
```

```ts
const zone = useTemplateRef<HTMLElement>('zone');
const { isOver, isAccepting } = makeDroppable(zone, {
  accept: 'image',
  onDrop: (e) => move(e.active.id),
});
```

Siehe [Drag and Drop](https://zizigy.github.io/docs/guides/drag-and-drop) und [Über einen Drop entscheiden](https://zizigy.github.io/docs/guides/drop-decisions).

<example height="26rem" hint="Lege die Dateien auf den Zonen ab, die sie annehmen" name="droppable">



</example>

## Optionen

<api-table name="DroppableOptions">



</api-table>

## Rückgabe

<api-table name="DroppableReturn">



</api-table>

## Annahmeregeln

<api-table name="AcceptRule">



</api-table>

<api-table name="AcceptContext">



</api-table>

<api-table name="AcceptMode">



</api-table>

## Von außerhalb der Seite

Was `external` von Drags annimmt, die von außerhalb der Seite kommen, und was ein solcher Drag
trägt (`e.external`). Siehe [Dateien und andere Apps](https://zizigy.github.io/docs/guides/native).

<api-table name="ExternalAccept">



</api-table>

<api-table name="ExternalData">



</api-table>

<api-table name="ExternalFile">



</api-table>

## Platzierung

<api-table name="Placement">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
