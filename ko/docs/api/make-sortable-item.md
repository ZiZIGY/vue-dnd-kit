---
title: "makeSortableItem"
description: "정렬 가능한 리스트나 트리의 행을 등록합니다. 행은 드래그되고, 자리를 내주고, 제자리에 안착합니다."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/api/make-sortable-item"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableItem">



</api-signature>

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isPlaceholder, index } = makeSortableItem(el, { item: () => props.task, handle: '.grip' });
```

[정렬 가능한 리스트](https://zizigy.github.io/docs/guides/sortable-lists)를 참고하세요.

<example height="24rem" hint="그립으로 행을 드래그하세요. 체크박스는 그대로 동작합니다" name="todo-list">



</example>

## 옵션

<api-table name="SortableItemOptions">



</api-table>

## 반환값

<api-table name="SortableItemReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
