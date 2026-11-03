---
title: "makeSortableList"
description: "Fait d'un conteneur une liste triable — un brouillon qui se réordonne pendant le glissement et qui est réécrit au dépôt."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/make-sortable-list"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableList">



</api-signature>

```ts
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: tasks, group: 'board' });
```

Ses lignes appellent [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item). Voir
[Listes triables](https://zizigy.github.io/docs/guides/sortable-lists) et [Listes qui partagent des items](https://zizigy.github.io/docs/guides/shared-lists).

<example height="34rem" hint="Changez les options, puis faites glisser une tuile" name="sortable-options">



</example>

## Options

<api-table name="SortableListOptions">



</api-table>

## Valeur de retour

<api-table name="SortableListReturn">



</api-table>

## Groupes

<api-table name="SortableGroupOptions">



</api-table>

<api-table name="SortablePutContext">



</api-table>

## L'événement de dépôt

Ce que reçoivent `onBeforeDrop` et `onDrop`.

<api-table name="SortableDropEvent">



</api-table>

## Indicateur

Ce que contient `indicator` en mode `placeholder: 'indicator'`.

<api-table name="SortableIndicator">



</api-table>

## Valeurs

<api-table name="SortableItems">



</api-table>

<api-table name="SortableStrategy">



</api-table>

<api-table name="SortableBehavior">



</api-table>

<api-table name="SortablePlaceholder">



</api-table>

<api-table name="MultipleMode">



</api-table>

<api-table name="DropOutside">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
