---
title: "Eventos"
description: "O que os eventos de arraste trazem — o arraste ativo, o alvo, o ponteiro, onde o item está — e o que o onBeforeDrop responde."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/api/events"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Os monitores (`useDnDMonitor`), os eventos do provider e os hooks dos droppables recebem um
`DnDEvent`; `onDragEnd` recebe um `DnDEndEvent`. As listas e árvores ordenáveis passam os seus
próprios eventos de drop
([`SortableDropEvent`](https://zizigy.github.io/docs/api/make-sortable-list#the-drop-event),
[`SortableTreeDropEvent`](https://zizigy.github.io/docs/api/make-sortable-tree#the-drop-event)) para o `onBeforeDrop` e o `onDrop` delas.

<example height="31rem" hint="Arraste uma tarefa, depois escolha um evento para lê-lo" name="api-events">



</example>

## DnDEvent

<api-table name="DnDEvent">



</api-table>

## DnDEndEvent

<api-table name="DnDEndEvent">



</api-table>

## Respostas do onBeforeDrop

<api-table name="BeforeDropResult">



</api-table>

Veja [Decidindo um drop](https://zizigy.github.io/docs/guides/drop-decisions).

## O arraste ativo

<api-table name="Active">



</api-table>

<api-table name="DragItem">



</api-table>

## O alvo

<api-table name="Over">



</api-table>

## A origem

<api-table name="DragSource">



</api-table>

<api-table name="DragMode">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
