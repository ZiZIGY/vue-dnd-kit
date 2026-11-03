---
title: "Modificateurs et collision"
description: "Les fonctions qui changent l'endroit où va l'item glissé, et celles qui choisissent la cible en dessous."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="Activez ou désactivez des modificateurs, puis faites glisser le jeton vert" name="api-modifiers">



</example>

## Modificateurs

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

Un modificateur prend le décalage du glissement et en renvoie un nouveau. Ils s'exécutent dans
l'ordre : les `modifiers` du provider, ceux d'une zone de glissement, ceux propres à l'élément
déplaçable (ou ceux de sa liste), puis les limites de la zone (`restrictToArea`), et le verrouillage
d'`axis` en dernier. Voir [Axes, limites et grilles](https://zizigy.github.io/docs/guides/constraints).

<api-signature names="restrictToVerticalAxis, restrictToHorizontalAxis, restrictToWindowEdges, restrictToParent, restrictToElement, restrictToFirstScrollableAncestor, snapToGrid, snapCenterToCursor">



</api-signature>

<api-table name="SnapToGridOptions">



</api-table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## Détection de collision

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

La `collision` du provider choisit la cible ; le meilleur candidat vient en premier.

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
