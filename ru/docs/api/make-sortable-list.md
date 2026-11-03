---
title: "makeSortableList"
description: "Делает контейнер сортируемым списком — черновик перестраивается во время драга и записывается обратно при броске."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/make-sortable-list"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableList">



</api-signature>

```ts
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: tasks, group: 'board' });
```

Строки списка вызывают [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item). См.
[сортируемые списки](https://zizigy.github.io/docs/guides/sortable-lists) и
[списки с общими элементами](https://zizigy.github.io/docs/guides/shared-lists).

<example height="34rem" hint="Переключите опции и перетащите плитку" name="sortable-options">



</example>

## Опции

<api-table name="SortableListOptions">



</api-table>

## Возвращает

<api-table name="SortableListReturn">



</api-table>

## Группы

<api-table name="SortableGroupOptions">



</api-table>

<api-table name="SortablePutContext">



</api-table>

## Событие броска

Что получают `onBeforeDrop` и `onDrop`.

<api-table name="SortableDropEvent">



</api-table>

## Индикатор

Что содержит `indicator` в режиме `placeholder: 'indicator'`.

<api-table name="SortableIndicator">



</api-table>

## Значения

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
