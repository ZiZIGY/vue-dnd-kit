---
title: "Eventos"
description: "Lo que llevan los eventos de arrastre — el arrastre activo, el destino, el puntero, dónde está el ítem — y lo que responde onBeforeDrop."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/api/events"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Los monitores (`useDnDMonitor`), los eventos del provider y los hooks de los droppables reciben un
`DnDEvent`; `onDragEnd` recibe un `DnDEndEvent`. Las listas y los árboles ordenables pasan sus
propios eventos de drop
([`SortableDropEvent`](https://zizigy.github.io/docs/api/make-sortable-list#the-drop-event),
[`SortableTreeDropEvent`](https://zizigy.github.io/docs/api/make-sortable-tree#the-drop-event)) a su `onBeforeDrop` y su
`onDrop`.

<example height="31rem" hint="Arrastra una tarea y luego elige un evento para leerlo" name="api-events">



</example>

## DnDEvent

<api-table name="DnDEvent">



</api-table>

## DnDEndEvent

<api-table name="DnDEndEvent">



</api-table>

## Respuestas de onBeforeDrop

<api-table name="BeforeDropResult">



</api-table>

Consulta [Decidir un drop](https://zizigy.github.io/docs/guides/drop-decisions).

## El arrastre activo

<api-table name="Active">



</api-table>

<api-table name="DragItem">



</api-table>

## El destino

<api-table name="Over">



</api-table>

## El origen

<api-table name="DragSource">



</api-table>

<api-table name="DragMode">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
