---
title: "Модификаторы и коллизии"
description: "Функции, которые меняют, куда идёт перетаскиваемый элемент, и функции, которые выбирают цель под ним."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="Переключайте модификаторы, затем перетащите зелёный токен" name="api-modifiers">



</example>

## Модификаторы

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

Модификатор принимает смещение драга и возвращает новое. Модификаторы выполняются по порядку:
`modifiers` провайдера, области перетаскивания, собственные модификаторы перетаскиваемого
элемента (или его списка), затем границы области (`restrictToArea`) и последней — фиксация
`axis`. См. [оси, границы и сетки](https://zizigy.github.io/docs/guides/constraints).

<api-signature names="restrictToVerticalAxis, restrictToHorizontalAxis, restrictToWindowEdges, restrictToParent, restrictToElement, restrictToFirstScrollableAncestor, snapToGrid, snapCenterToCursor">



</api-signature>

<api-table name="SnapToGridOptions">



</api-table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## Определение коллизий

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

`collision` провайдера выбирает цель; лучший кандидат идёт первым.

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
