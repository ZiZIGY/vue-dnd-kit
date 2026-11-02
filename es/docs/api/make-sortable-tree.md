---
title: "makeSortableTree"
description: "Convierte un contenedor en un árbol ordenable, renderizado en plano con profundidades — anidamiento arrastrando hacia un lado o pasando sobre un nodo."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/api/make-sortable-tree"
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

Renderiza `items` (nodos planos con una `depth`); cada fila llama a
[`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) con `id: () => node.key`. Consulta [Árboles](https://zizigy.github.io/docs/guides/trees).

<example height="26rem" hint="Cambia una opción y luego arrastra una fila hacia un lado" name="api-tree-options">



</example>

## Opciones

<api-table name="SortableTreeOptions">



</api-table>

## Valor devuelto

<api-table name="SortableTreeReturn">



</api-table>

## Nodos planos

<api-table name="FlatNode">



</api-table>

## Proyección

<api-table name="TreeProjection">



</api-table>

<api-table name="TreeNesting">



</api-table>

## El evento de drop

<api-table name="SortableTreeDropEvent">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
