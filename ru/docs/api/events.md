---
title: "События"
description: "Что несут события драга — активный драг, цель, указатель, положение элемента — и что отвечает onBeforeDrop."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/events"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Мониторы (`useDnDMonitor`), события провайдера и хуки droppable получают `DnDEvent`;
`onDragEnd` получает `DnDEndEvent`. Сортируемые списки и деревья передают в свои `onBeforeDrop`
и `onDrop` собственные события броска
([`SortableDropEvent`](https://zizigy.github.io/docs/api/make-sortable-list#the-drop-event),
[`SortableTreeDropEvent`](https://zizigy.github.io/docs/api/make-sortable-tree#the-drop-event)).

<example height="31rem" hint="Перетащите задачу, затем выберите событие, чтобы его прочитать" name="api-events">



</example>

## DnDEvent

<api-table name="DnDEvent">



</api-table>

## DnDEndEvent

<api-table name="DnDEndEvent">



</api-table>

## Ответы onBeforeDrop

<api-table name="BeforeDropResult">



</api-table>

См. [решение о броске](https://zizigy.github.io/docs/guides/drop-decisions).

## Активный драг

<api-table name="Active">



</api-table>

<api-table name="DragItem">



</api-table>

## Цель

<api-table name="Over">



</api-table>

## Источник

<api-table name="DragSource">



</api-table>

<api-table name="DragMode">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
