---
title: "makeSortableItem"
description: "Регистрирует строку сортируемого списка или дерева — она перетаскивается, освобождает место и приземляется в свой слот."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/make-sortable-item"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeSortableItem<TData = unknown>(
  target: MaybeElementRef,
  options: SortableItemOptions<TData>,
): SortableItemReturn;
```

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isPlaceholder, index } = makeSortableItem(el, { item: () => props.task, handle: '.grip' });
```

Вызывайте его в компоненте строки, отрендеренном внутри элемента списка (из нескольких
списков, созданных в одном компоненте, строка входит в самый внутренний вокруг неё). Определяйте строку
через `item` (ключ берётся из `getKey` списка, по умолчанию `item.id`) или через `id`. См.
[сортируемые списки](https://zizigy.github.io/docs/guides/sortable-lists).

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
