---
title: "makeSortableTree"
description: "Делает контейнер сортируемым деревом, отрисованным плоско с глубинами, — вложение сдвигом вбок или наведением на узел."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/make-sortable-tree"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeSortableTree<T>(
  target: MaybeElementRef,
  options: SortableTreeOptions<T>,
): SortableTreeReturn<T>;
```

```ts
const root = useTemplateRef<HTMLElement>('root');
const { items } = makeSortableTree(root, { items: files, indentation: 20, collapsed });
```

Рендерите `items` (плоские узлы с `depth`); каждая строка вызывает
[`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) с `id: () => node.key`. См.
[деревья](https://zizigy.github.io/docs/guides/trees).

<example height="26rem" hint="Переключите опцию, затем перетащите строку вбок" name="api-tree-options">



</example>

## Опции

<api-table name="SortableTreeOptions">



</api-table>

## Возвращает

<api-table name="SortableTreeReturn">



</api-table>

## Плоские узлы

<api-table name="FlatNode">



</api-table>

## Проекция

<api-table name="TreeProjection">



</api-table>

<api-table name="TreeNesting">



</api-table>

## Событие броска

<api-table name="SortableTreeDropEvent">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
