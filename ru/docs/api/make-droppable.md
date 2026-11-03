---
title: "makeDroppable"
description: "Делает элемент целью — с правилами, что она принимает, и хуками для броска."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/make-droppable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeDroppable">



</api-signature>

```ts
const zone = useTemplateRef<HTMLElement>('zone');
const { isOver, isAccepting } = makeDroppable(zone, {
  accept: 'image',
  onDrop: (e) => move(e.active.id),
});
```

См. [drag and drop](https://zizigy.github.io/docs/guides/drag-and-drop) и [решение о броске](https://zizigy.github.io/docs/guides/drop-decisions).

<example height="26rem" hint="Бросайте файлы в зоны, которые их принимают" name="droppable">



</example>

## Опции

<api-table name="DroppableOptions">



</api-table>

## Возвращает

<api-table name="DroppableReturn">



</api-table>

## Правила accept

<api-table name="AcceptRule">



</api-table>

<api-table name="AcceptContext">



</api-table>

<api-table name="AcceptMode">



</api-table>

## Извне страницы

Что `external` принимает от драгов, которые приходят извне страницы, и что такой драг несёт
(`e.external`). См. [файлы и другие приложения](https://zizigy.github.io/docs/guides/native).

<api-table name="ExternalAccept">



</api-table>

<api-table name="ExternalData">



</api-table>

<api-table name="ExternalFile">



</api-table>

## Положение указателя

<api-table name="Placement">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
