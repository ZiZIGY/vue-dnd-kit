---
title: "Events"
description: "What drag events carry — the active drag, the target, the pointer, where the item is — and what onBeforeDrop answers."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/api/events"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Monitors (`useDnDMonitor`), the provider's events and droppables' hooks get a `DnDEvent`;
`onDragEnd` gets a `DnDEndEvent`. Sortable lists and trees pass their own drop events
([`SortableDropEvent`](https://zizigy.github.io/docs/api/make-sortable-list#the-drop-event),
[`SortableTreeDropEvent`](https://zizigy.github.io/docs/api/make-sortable-tree#the-drop-event)) to their `onBeforeDrop` and `onDrop`.

<example height="31rem" hint="Drag a task, then pick an event to read it" name="api-events">



</example>

## DnDEvent

<api-table name="DnDEvent">



</api-table>

## DnDEndEvent

<api-table name="DnDEndEvent">



</api-table>

## onBeforeDrop answers

<api-table name="BeforeDropResult">



</api-table>

See [Deciding a drop](https://zizigy.github.io/docs/guides/drop-decisions).

## The active drag

<api-table name="Active">



</api-table>

<api-table name="DragItem">



</api-table>

## The target

<api-table name="Over">



</api-table>

## The source

<api-table name="DragSource">



</api-table>

<api-table name="DragMode">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
