---
title: "makeSortableList"
description: "Convierte un contenedor en una lista ordenable — un borrador que se reordena mientras arrastras y que se escribe al soltar."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/api/make-sortable-list"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableList">



</api-signature>

```ts
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: tasks, group: 'board' });
```

Sus filas llaman a [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item). Consulta
[Listas ordenables](https://zizigy.github.io/docs/guides/sortable-lists) y [Listas que comparten ítems](https://zizigy.github.io/docs/guides/shared-lists).

<example height="34rem" hint="Cambia las opciones y luego arrastra una baldosa" name="sortable-options">



</example>

## Opciones

<api-table name="SortableListOptions">



</api-table>

## Valor devuelto

<api-table name="SortableListReturn">



</api-table>

## Grupos

<api-table name="SortableGroupOptions">



</api-table>

<api-table name="SortablePutContext">



</api-table>

## El evento de drop

Lo que reciben `onBeforeDrop` y `onDrop`.

<api-table name="SortableDropEvent">



</api-table>

## Indicador

Lo que contiene `indicator` en el modo `placeholder: 'indicator'`.

<api-table name="SortableIndicator">



</api-table>

## Valores

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
