---
title: "makeDroppable"
description: "Fait d'un élément une cible de dépôt, avec des règles pour ce qu'elle accepte et des hooks pour le dépôt."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/make-droppable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeDroppable<TData = unknown>(
  target: MaybeElementRef,
  options?: DroppableOptions<TData>,
): DroppableReturn;
```

```ts
const zone = useTemplateRef<HTMLElement>('zone');
const { isOver, isAccepting } = makeDroppable(zone, {
  accept: 'image',
  onDrop: (e) => move(e.active.id),
});
```

Voir [Glisser-déposer](https://zizigy.github.io/docs/guides/drag-and-drop) et [Décider d'un dépôt](https://zizigy.github.io/docs/guides/drop-decisions).

<example height="26rem" hint="Déposez les fichiers sur les zones qui les acceptent" name="droppable">



</example>

## Options

<api-table name="DroppableOptions">



</api-table>

## Valeur de retour

<api-table name="DroppableReturn">



</api-table>

## Règles d'acceptation

<api-table name="AcceptRule">



</api-table>

<api-table name="AcceptContext">



</api-table>

<api-table name="AcceptMode">



</api-table>

## Depuis l'extérieur de la page

Ce que `external` accepte des glissements venus de l'extérieur de la page, et ce que transporte
un tel glissement (`e.external`). Voir [fichiers et autres applications](https://zizigy.github.io/docs/guides/native).

<api-table name="ExternalAccept">



</api-table>

<api-table name="ExternalData">



</api-table>

<api-table name="ExternalFile">



</api-table>

## Placement

<api-table name="Placement">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
