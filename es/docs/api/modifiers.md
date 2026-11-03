---
title: "Modificadores y colisión"
description: "Las funciones que cambian adónde va el ítem arrastrado, y las que eligen el destino que tiene debajo."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="Activa o desactiva modificadores y luego arrastra la ficha verde" name="api-modifiers">



</example>

## Modificadores

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

Un modificador recibe el desplazamiento del arrastre y devuelve uno nuevo. Se ejecutan en orden:
los `modifiers` del provider, los de un área de arrastre, los propios del elemento arrastrable (o
los de su lista), luego los límites del área (`restrictToArea`) y, al final, el bloqueo de `axis`.
Consulta [Ejes, límites y cuadrículas](https://zizigy.github.io/docs/guides/constraints).

<api-signature names="restrictToVerticalAxis, restrictToHorizontalAxis, restrictToWindowEdges, restrictToParent, restrictToElement, restrictToFirstScrollableAncestor, snapToGrid, snapCenterToCursor">



</api-signature>

<api-table name="SnapToGridOptions">



</api-table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## Detección de colisiones

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

La `collision` del provider elige el destino; el mejor candidato va primero.

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
