---
title: "事件"
description: "拖拽事件携带什么——当前拖拽、目标、指针、项的位置——以及 onBeforeDrop 可以返回什么。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/events"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

监听器（`useDnDMonitor`）、provider 的事件和 droppable 的钩子会收到 `DnDEvent`；`onDragEnd` 收到 `DnDEndEvent`。可排序列表和树会把它们自己的放置事件（[`SortableDropEvent`](https://zizigy.github.io/docs/api/make-sortable-list#the-drop-event)、[`SortableTreeDropEvent`](https://zizigy.github.io/docs/api/make-sortable-tree#the-drop-event)）传给各自的 `onBeforeDrop` 和 `onDrop`。

<example height="31rem" hint="拖动一个任务，然后选择一个事件来查看它" name="api-events">



</example>

## DnDEvent

<api-table name="DnDEvent">



</api-table>

## DnDEndEvent

<api-table name="DnDEndEvent">



</api-table>

## onBeforeDrop 的返回值

<api-table name="BeforeDropResult">



</api-table>

参见[决定放置](https://zizigy.github.io/docs/guides/drop-decisions)。

## 当前拖拽

<api-table name="Active">



</api-table>

<api-table name="DragItem">



</api-table>

## 目标

<api-table name="Over">



</api-table>

## 来源

<api-table name="DragSource">



</api-table>

<api-table name="DragMode">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
