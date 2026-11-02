---
title: "makeDroppable"
description: "요소를 드롭 대상으로 만듭니다. 무엇을 받아들일지 정하는 규칙과 드롭을 위한 훅이 있습니다."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/api/make-droppable"
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

[드래그 앤 드롭](https://zizigy.github.io/docs/guides/drag-and-drop)과 [드롭 결정하기](https://zizigy.github.io/docs/guides/drop-decisions)를
참고하세요.

<example height="26rem" hint="파일을 받아 주는 영역에 놓으세요" name="droppable">



</example>

## 옵션

<api-table name="DroppableOptions">



</api-table>

## 반환값

<api-table name="DroppableReturn">



</api-table>

## accept 규칙

<api-table name="AcceptRule">



</api-table>

<api-table name="AcceptContext">



</api-table>

<api-table name="AcceptMode">



</api-table>

## 페이지 밖에서

페이지 밖에서 오는 드래그에서 `external`이 받는 것, 그리고 그런 드래그가 담고 있는 것(`e.external`).
[파일과 다른 앱](https://zizigy.github.io/docs/guides/native)을 참고하세요.

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
