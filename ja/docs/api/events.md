---
title: "イベント"
description: "ドラッグイベントが持つもの（アクティブなドラッグ、ターゲット、ポインター、アイテムの位置）と、onBeforeDrop が返せるもの。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/api/events"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

モニター（`useDnDMonitor`）、プロバイダーのイベント、ドロップゾーンのフックは `DnDEvent` を受け取り、`onDragEnd` は `DnDEndEvent` を受け取ります。並べ替え可能なリストとツリーは、独自のドロップイベント（[`SortableDropEvent`](https://zizigy.github.io/docs/api/make-sortable-list#the-drop-event)、[`SortableTreeDropEvent`](https://zizigy.github.io/docs/api/make-sortable-tree#the-drop-event)）を自身の `onBeforeDrop` と `onDrop` に渡します。

<example height="31rem" hint="タスクをドラッグしてから、イベントを選んで中身を読んでみましょう" name="api-events">



</example>

## DnDEvent

<api-table name="DnDEvent">



</api-table>

## DnDEndEvent

<api-table name="DnDEndEvent">



</api-table>

## onBeforeDrop の返り値

<api-table name="BeforeDropResult">



</api-table>

[ドロップの判断](https://zizigy.github.io/docs/guides/drop-decisions)を参照してください。

## アクティブなドラッグ

<api-table name="Active">



</api-table>

<api-table name="DragItem">



</api-table>

## ターゲット

<api-table name="Over">



</api-table>

## ソース

<api-table name="DragSource">



</api-table>

<api-table name="DragMode">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
