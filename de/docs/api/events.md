---
title: "Events"
description: "Was Drag-Events enthalten – den aktiven Drag, das Ziel, den Zeiger, wo sich das Element befindet – und was onBeforeDrop antwortet."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/api/events"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Monitore (`useDnDMonitor`), die Events des Providers und die Hooks von Drop-Zonen bekommen ein
`DnDEvent`; `onDragEnd` bekommt ein `DnDEndEvent`. Sortierbare Listen und Bäume übergeben eigene
Drop-Events ([`SortableDropEvent`](https://zizigy.github.io/docs/api/make-sortable-list#the-drop-event),
[`SortableTreeDropEvent`](https://zizigy.github.io/docs/api/make-sortable-tree#the-drop-event)) an ihre `onBeforeDrop` und `onDrop`.

<example height="31rem" hint="Ziehe eine Aufgabe, dann wähle ein Event aus, um es zu lesen" name="api-events">



</example>

## DnDEvent

<api-table name="DnDEvent">



</api-table>

## DnDEndEvent

<api-table name="DnDEndEvent">



</api-table>

## Antworten von onBeforeDrop

<api-table name="BeforeDropResult">



</api-table>

Siehe [Über einen Drop entscheiden](https://zizigy.github.io/docs/guides/drop-decisions).

## Der aktive Drag

<api-table name="Active">



</api-table>

<api-table name="DragItem">



</api-table>

## Das Ziel

<api-table name="Over">



</api-table>

## Die Quelle

<api-table name="DragSource">



</api-table>

<api-table name="DragMode">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
