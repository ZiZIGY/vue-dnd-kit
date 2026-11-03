---
title: "Modificadores e colisão"
description: "Funções que mudam para onde vai o item arrastado, e as que escolhem o alvo sob ele."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="Ligue ou desligue modificadores, depois arraste a ficha verde" name="api-modifiers">



</example>

## Modificadores

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

Um modificador recebe o deslocamento do arraste e retorna um novo. Eles rodam em ordem: os
`modifiers` do provider, os de uma área de arraste, os do próprio draggable (ou da lista dele),
depois os limites da área (`restrictToArea`), e a trava de `axis` por último. Veja
[Eixos, limites e grades](https://zizigy.github.io/docs/guides/constraints).

<api-signature names="restrictToVerticalAxis, restrictToHorizontalAxis, restrictToWindowEdges, restrictToParent, restrictToElement, restrictToFirstScrollableAncestor, snapToGrid, snapCenterToCursor">



</api-signature>

<api-table name="SnapToGridOptions">



</api-table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## Detecção de colisão

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

O `collision` do provider escolhe o alvo; o melhor candidato vem primeiro.

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
