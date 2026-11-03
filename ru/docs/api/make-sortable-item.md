---
title: "makeSortableItem"
description: "Регистрирует строку сортируемого списка или дерева — она перетаскивается, освобождает место и приземляется в свой слот."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/make-sortable-item"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableItem">



</api-signature>

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isPlaceholder, index } = makeSortableItem(el, { item: () => props.task, handle: '.grip' });
```

См. [сортируемые списки](https://zizigy.github.io/docs/guides/sortable-lists).

<example height="24rem" hint="Перетащите строку за ручку: чекбокс по-прежнему работает" name="todo-list">



</example>

## Опции

<api-table name="SortableItemOptions">



</api-table>

## Возвращает

<api-table name="SortableItemReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
