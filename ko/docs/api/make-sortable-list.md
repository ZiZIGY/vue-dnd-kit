---
title: "makeSortableList"
description: "컨테이너를 정렬 가능한 리스트로 만듭니다. 드래그하는 동안 순서가 바뀌는 초안을 제공하고, 드롭하면 원본에 기록합니다."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/api/make-sortable-list"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableList">



</api-signature>

```ts
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: tasks, group: 'board' });
```

리스트의 각 행은 [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item)을 호출합니다. [정렬 가능한 리스트](https://zizigy.github.io/docs/guides/sortable-lists)와
[항목을 공유하는 리스트](https://zizigy.github.io/docs/guides/shared-lists)를 참고하세요.

<example height="34rem" hint="옵션을 바꾼 뒤 타일을 드래그하세요" name="sortable-options">



</example>

## 옵션

<api-table name="SortableListOptions">



</api-table>

## 반환값

<api-table name="SortableListReturn">



</api-table>

## 그룹

<api-table name="SortableGroupOptions">



</api-table>

<api-table name="SortablePutContext">



</api-table>

## 드롭 이벤트

`onBeforeDrop`과 `onDrop`이 받는 것입니다.

<api-table name="SortableDropEvent">



</api-table>

## 인디케이터

`placeholder: 'indicator'` 모드에서 `indicator`에 담기는 값입니다.

<api-table name="SortableIndicator">



</api-table>

## 값

<api-table name="SortableItems">



</api-table>

<api-table name="SortableStrategy">



</api-table>

<api-table name="SortableBehavior">



</api-table>

<api-table name="SortablePlaceholder">



</api-table>

<api-table name="MultipleMode">



</api-table>

<api-table name="DropOutside">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
