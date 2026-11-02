---
title: "Événements"
description: "Ce que transportent les événements de glissement — le glissement actif, la cible, le pointeur, la position de l'item — et ce que répond onBeforeDrop."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/events"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Les moniteurs (`useDnDMonitor`), les événements du provider et les hooks des droppables reçoivent un
`DnDEvent` ; `onDragEnd` reçoit un `DnDEndEvent`. Les listes et les arbres triables passent leurs
propres événements de dépôt
([`SortableDropEvent`](https://zizigy.github.io/docs/api/make-sortable-list#the-drop-event),
[`SortableTreeDropEvent`](https://zizigy.github.io/docs/api/make-sortable-tree#the-drop-event)) à leurs `onBeforeDrop` et
`onDrop`.

<example height="31rem" hint="Faites glisser une tâche, puis choisissez un événement pour le lire" name="api-events">



</example>

## DnDEvent

<api-table name="DnDEvent">



</api-table>

## DnDEndEvent

<api-table name="DnDEndEvent">



</api-table>

## Réponses d'onBeforeDrop

<api-table name="BeforeDropResult">



</api-table>

Voir [Décider d'un dépôt](https://zizigy.github.io/docs/guides/drop-decisions).

## Le glissement actif

<api-table name="Active">



</api-table>

<api-table name="DragItem">



</api-table>

## La cible

<api-table name="Over">



</api-table>

## La source

<api-table name="DragSource">



</api-table>

<api-table name="DragMode">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
