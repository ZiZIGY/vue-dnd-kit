---
title: "makeDragArea"
description: "요소 안에서 시작하는 드래그의 규칙. 축, 경계, 그리드, 자동 스크롤, 활성화를 앱 전체에 하나뿐인 프로바이더 아래에서 지정합니다."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/api/make-drag-area"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeDragArea">



</api-signature>

```ts
const board = useTemplateRef<HTMLElement>('board');
makeDragArea(board, { restrictToArea: true, modifiers: [snapToGrid(24)] });
```

안쪽 영역은 `disabled`를 상속합니다. 그 밖의 규칙은 모두 가장 가까운 영역에서 가져옵니다.
[축, 경계, 그리드](https://zizigy.github.io/docs/guides/constraints)를 참고하세요.

영역 안의 칩은 영역의 규칙을 따르고, 영역 밖의 칩은 자유롭게 드래그됩니다.

<example height="36rem" hint="영역의 규칙을 바꾼 뒤 영역 안의 칩을 드래그하세요" name="api-drag-area">



</example>

## 옵션

<api-table name="DragAreaOptions">



</api-table>

## 반환값

<api-table name="DragAreaReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
