---
title: "修饰器与碰撞检测"
description: "改变被拖拽项去向的函数，以及选出它下方目标的函数。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="切换修饰器，然后拖动绿色的方块" name="api-modifiers">



</example>

## 修饰器

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

修饰器接收拖拽的偏移量，并返回一个新的偏移量。它们按顺序运行：provider 的 `modifiers`、拖拽区域的、可拖拽元素自己的（或其列表的），然后是区域的边界（`restrictToArea`），最后是 `axis` 锁定。参见[轴、边界与网格](https://zizigy.github.io/docs/guides/constraints)。

<api-signature names="restrictToVerticalAxis, restrictToHorizontalAxis, restrictToWindowEdges, restrictToParent, restrictToElement, restrictToFirstScrollableAncestor, snapToGrid, snapCenterToCursor">



</api-signature>

<api-table name="SnapToGridOptions">



</api-table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## 碰撞检测

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

provider 的 `collision` 负责选出目标；最佳候选排在最前。

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
