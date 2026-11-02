---
title: "makeSortableItem"
description: "Registra uma linha de uma lista ou árvore ordenável — ela é arrastada, abre espaço e pousa na sua posição."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/api/make-sortable-item"
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

Chame-o no componente da linha, renderizado dentro do elemento da lista (entre várias listas
criadas em um mesmo componente, a linha entra na mais interna em volta dela). Identifique a linha com
`item` (com a key dada pelo `getKey` da lista, `item.id` por padrão) ou com `id`. Veja
[Listas ordenáveis](https://zizigy.github.io/docs/guides/sortable-lists).

<example height="24rem" hint="Arraste uma linha pela alça: o checkbox continua funcionando" name="todo-list">



</example>

## Opções

<api-table name="SortableItemOptions">



</api-table>

## Retorno

<api-table name="SortableItemReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
