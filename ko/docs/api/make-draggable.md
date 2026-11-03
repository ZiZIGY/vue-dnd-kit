---
title: "makeDraggable"
description: "요소를 드래그할 수 있게 만듭니다. 자유롭게 드래그하거나, 그 요소를 받아들이는 드롭 대상으로 드래그할 수 있습니다."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/api/make-draggable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeDraggable">



</api-signature>

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isDragging } = makeDraggable(el, { id: 'card', type: 'card', data: { title } });
```

[드래그 앤 드롭](https://zizigy.github.io/docs/guides/drag-and-drop)을 참고하세요. 정렬 가능한 항목도 draggable입니다.
[`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item)은 같은 옵션에 몇 가지를 더 받습니다.

<example height="22rem" hint="각 카드를 드래그하세요. 놓으면 원래 자리로 돌아갑니다" name="draggable">



</example>

## 옵션

<api-table name="DraggableOptions">



</api-table>

## 반환값

<api-table name="DraggableReturn">



</api-table>

## 페이지 밖으로

`native` 드래그가 페이지 밖으로 가지고 나가는 것. [파일과 다른 앱](https://zizigy.github.io/docs/guides/native#out-of-the-page)을
참고하세요.

<api-table name="NativeDragOptions">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
