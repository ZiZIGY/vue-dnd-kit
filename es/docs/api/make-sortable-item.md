---
title: "makeSortableItem"
description: "Registra una fila de una lista o de un árbol ordenable — se arrastra, hace sitio y aterriza en su hueco."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/api/make-sortable-item"
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

Llámalo en el componente de la fila, renderizado dentro del elemento de la lista (de varias listas
creadas en un mismo componente, la fila se une a la más interior que la rodea). Identifica la fila
con `item` (cuya clave sale del `getKey` de la lista, `item.id` por defecto) o con `id`. Consulta
[Listas ordenables](https://zizigy.github.io/docs/guides/sortable-lists).

<example height="24rem" hint="Arrastra una fila por su asa: la casilla sigue funcionando" name="todo-list">



</example>

## Opciones

<api-table name="SortableItemOptions">



</api-table>

## Valor devuelto

<api-table name="SortableItemReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
