---
title: "makeDraggable"
description: "Делает элемент перетаскиваемым — свободно или в цели, которые его принимают."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/make-draggable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeDraggable">



</api-signature>

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isDragging } = makeDraggable(el, { id: 'card', type: 'card', data: { title } });
```

См. [drag and drop](https://zizigy.github.io/docs/guides/drag-and-drop). Элементы сортируемых списков — тоже
перетаскиваемые элементы: [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) принимает те же
опции и не только.

<example height="22rem" hint="Перетащите каждую карточку. Отпустите — и она вернётся на место" name="draggable">



</example>

## Опции

<api-table name="DraggableOptions">



</api-table>

## Возвращает

<api-table name="DraggableReturn">



</api-table>

## За пределы страницы

Что драг `native` несёт за пределы страницы. См. [файлы и другие приложения](https://zizigy.github.io/docs/guides/native#out-of-the-page).

<api-table name="NativeDragOptions">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
