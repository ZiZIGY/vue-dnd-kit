---
title: "モディファイアと衝突判定"
description: "ドラッグ中のアイテムの行き先を変える関数と、その下のターゲットを選ぶ関数。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="モディファイアを切り替えてから、緑のトークンをドラッグしてみましょう" name="api-modifiers">



</example>

## モディファイア

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

モディファイアはドラッグのオフセットを受け取り、新しいオフセットを返します。実行順は次のとおりです：プロバイダーの `modifiers`、ドラッグエリアのもの、ドラッグ可能な要素自身のもの（またはそのリストのもの）、次にエリアの境界（`restrictToArea`）、最後に `axis` による固定。[軸、境界、グリッド](https://zizigy.github.io/docs/guides/constraints)を参照してください。

<api-signature names="restrictToVerticalAxis, restrictToHorizontalAxis, restrictToWindowEdges, restrictToParent, restrictToElement, restrictToFirstScrollableAncestor, snapToGrid, snapCenterToCursor">



</api-signature>

<api-table name="SnapToGridOptions">



</api-table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## 衝突判定

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

プロバイダーの `collision` がターゲットを選びます。最も良い候補が先頭に来ます。

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
