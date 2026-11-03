---
title: "makeSortableList"
description: "Macht einen Container zu einer sortierbaren Liste – ein Entwurf, der sich während des Ziehens neu ordnet und beim Drop zurückgeschrieben wird."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/api/make-sortable-list"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableList">



</api-signature>

```ts
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: tasks, group: 'board' });
```

Ihre Zeilen rufen [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) auf. Siehe
[Sortierbare Listen](https://zizigy.github.io/docs/guides/sortable-lists) und [Listen mit gemeinsamen Elementen](https://zizigy.github.io/docs/guides/shared-lists).

<example height="34rem" hint="Schalte die Optionen um, dann ziehe eine Kachel" name="sortable-options">



</example>

## Optionen

<api-table name="SortableListOptions">



</api-table>

## Rückgabe

<api-table name="SortableListReturn">



</api-table>

## Gruppen

<api-table name="SortableGroupOptions">



</api-table>

<api-table name="SortablePutContext">



</api-table>

## Das Drop-Event

Was `onBeforeDrop` und `onDrop` bekommen.

<api-table name="SortableDropEvent">



</api-table>

## Indikator

Was `indicator` im Modus `placeholder: 'indicator'` enthält.

<api-table name="SortableIndicator">



</api-table>

## Werte

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
