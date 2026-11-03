---
title: "Modifier und Kollisionserkennung"
description: "Funktionen, die ändern, wohin das gezogene Element geht, und solche, die das Ziel darunter wählen."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="Schalte Modifier um, dann ziehe den grünen Token" name="api-modifiers">



</example>

## Modifier

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

Ein Modifier nimmt den Versatz des Drags entgegen und gibt einen neuen zurück. Sie laufen in
dieser Reihenfolge: die `modifiers` des Providers, die eines Drag-Bereichs, die eigenen des
ziehbaren Elements (oder die seiner Liste), dann die Grenzen des Bereichs (`restrictToArea`) und
zuletzt die `axis`-Sperre. Siehe [Achsen, Grenzen und Raster](https://zizigy.github.io/docs/guides/constraints).

<api-signature names="restrictToVerticalAxis, restrictToHorizontalAxis, restrictToWindowEdges, restrictToParent, restrictToElement, restrictToFirstScrollableAncestor, snapToGrid, snapCenterToCursor">



</api-signature>

<api-table name="SnapToGridOptions">



</api-table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## Kollisionserkennung

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

Die Option `collision` des Providers wählt das Ziel; der beste Kandidat kommt zuerst.

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
