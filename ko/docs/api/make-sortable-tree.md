---
title: "makeSortableTree"
description: "컨테이너를 깊이와 함께 평평하게 렌더링되는 정렬 가능한 트리로 만듭니다. 옆으로 드래그하거나 노드 위에 머물러 중첩합니다."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/api/make-sortable-tree"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeSortableTree<T>(
  target: MaybeElementRef,
  options: SortableTreeOptions<T>,
): SortableTreeReturn<T>;
```

```ts
const root = useTemplateRef<HTMLElement>('root');
const { items } = makeSortableTree(root, { items: files, indentation: 20, collapsed });
```

`items`(`depth`가 있는 평평한 노드)를 렌더링하세요. 각 행은 `id: () => node.key`로
[`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item)을 호출합니다. [트리](https://zizigy.github.io/docs/guides/trees)를 참고하세요.

<example height="26rem" hint="옵션을 바꾼 뒤 행을 옆으로 드래그하세요" name="api-tree-options">



</example>

## 옵션

<api-table name="SortableTreeOptions">



</api-table>

## 반환값

<api-table name="SortableTreeReturn">



</api-table>

## 평평한 노드

<api-table name="FlatNode">



</api-table>

## 투영

<api-table name="TreeProjection">



</api-table>

<api-table name="TreeNesting">



</api-table>

## 드롭 이벤트

<api-table name="SortableTreeDropEvent">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
