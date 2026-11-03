---
title: "makeDragArea"
description: "Des règles pour les glissements qui commencent à l'intérieur d'un élément — un axe, des limites, une grille, le défilement automatique, l'activation — sous un seul provider pour toute l'application."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/make-drag-area"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeDragArea">



</api-signature>

```ts
const board = useTemplateRef<HTMLElement>('board');
makeDragArea(board, { restrictToArea: true, modifiers: [snapToGrid(24)] });
```

Les zones intérieures héritent de `disabled` ; toutes les autres règles viennent de la zone la plus
proche. Voir [Axes, limites et grilles](https://zizigy.github.io/docs/guides/constraints).

Les pastilles à l'intérieur de la zone suivent ses règles ; celle qui est à l'extérieur glisse
librement.

<example height="36rem" hint="Changez les règles de la zone, puis faites glisser une pastille à l'intérieur" name="api-drag-area">



</example>

## Options

<api-table name="DragAreaOptions">



</api-table>

## Valeur de retour

<api-table name="DragAreaReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
