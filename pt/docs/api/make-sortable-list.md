---
title: "makeSortableList"
description: "Torna um contêiner uma lista ordenável — um rascunho que se reordena enquanto você arrasta, gravado de volta no drop."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/api/make-sortable-list"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableList">



</api-signature>

```ts
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: tasks, group: 'board' });
```

As linhas dela chamam [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item). Veja
[Listas ordenáveis](https://zizigy.github.io/docs/guides/sortable-lists) e [Listas que compartilham itens](https://zizigy.github.io/docs/guides/shared-lists).

<example height="34rem" hint="Troque as opções, depois arraste um bloco" name="sortable-options">



</example>

## Opções

<api-table name="SortableListOptions">



</api-table>

## Retorno

<api-table name="SortableListReturn">



</api-table>

## Grupos

<api-table name="SortableGroupOptions">



</api-table>

<api-table name="SortablePutContext">



</api-table>

## O evento de drop

O que `onBeforeDrop` e `onDrop` recebem.

<api-table name="SortableDropEvent">



</api-table>

## Indicador

O que `indicator` contém no modo `placeholder: 'indicator'`.

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
