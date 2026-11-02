---
title: "이벤트"
description: "드래그 이벤트에 담기는 것(활성 드래그, 대상, 포인터, 항목의 위치)과 onBeforeDrop의 응답."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/api/events"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

모니터(`useDnDMonitor`), 프로바이더의 이벤트, droppable의 훅은 `DnDEvent`를 받고, `onDragEnd`는
`DnDEndEvent`를 받습니다. 정렬 가능한 리스트와 트리는 자체 드롭 이벤트
([`SortableDropEvent`](https://zizigy.github.io/docs/api/make-sortable-list#the-drop-event),
[`SortableTreeDropEvent`](https://zizigy.github.io/docs/api/make-sortable-tree#the-drop-event))를 자신의 `onBeforeDrop`과 `onDrop`에 넘깁니다.

<example height="31rem" hint="작업을 드래그한 뒤 이벤트를 골라 내용을 확인하세요" name="api-events">



</example>

## DnDEvent

<api-table name="DnDEvent">



</api-table>

## DnDEndEvent

<api-table name="DnDEndEvent">



</api-table>

## onBeforeDrop 응답

<api-table name="BeforeDropResult">



</api-table>

[드롭 결정하기](https://zizigy.github.io/docs/guides/drop-decisions)를 참고하세요.

## 활성 드래그

<api-table name="Active">



</api-table>

<api-table name="DragItem">



</api-table>

## 대상

<api-table name="Over">



</api-table>

## 출처

<api-table name="DragSource">



</api-table>

<api-table name="DragMode">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
