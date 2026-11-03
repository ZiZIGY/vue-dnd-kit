---
title: "모디파이어와 충돌 감지"
description: "드래그 중인 항목이 갈 위치를 바꾸는 함수와, 그 아래의 대상을 고르는 함수."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="모디파이어를 켜고 끈 뒤 초록색 토큰을 드래그하세요" name="api-modifiers">



</example>

## 모디파이어

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

모디파이어는 드래그의 오프셋을 받아 새 오프셋을 반환합니다. 실행 순서는 프로바이더의 `modifiers`,
드래그 영역의 `modifiers`, draggable 자체(또는 그 리스트)의 `modifiers`, 그다음 영역의
경계(`restrictToArea`), 마지막으로 `axis` 고정입니다. [축, 경계, 그리드](https://zizigy.github.io/docs/guides/constraints)를
참고하세요.

<api-signature names="restrictToVerticalAxis, restrictToHorizontalAxis, restrictToWindowEdges, restrictToParent, restrictToElement, restrictToFirstScrollableAncestor, snapToGrid, snapCenterToCursor">



</api-signature>

<api-table name="SnapToGridOptions">



</api-table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## 충돌 감지

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

프로바이더의 `collision`이 대상을 고릅니다. 가장 적합한 후보가 맨 앞에 옵니다.

<api-signature names="pointerFirst, pointerWithin, rectIntersection, closestCenter, closestCorners">



</api-signature>

<api-table name="CollisionDetection">



</api-table>

<api-table name="CollisionArgs">



</api-table>

<api-table name="CollisionCandidate">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
