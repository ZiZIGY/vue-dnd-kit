---
title: "makeSortableTree"
description: "Torna um contêiner uma árvore ordenável, renderizada de forma plana com profundidades — aninhamento arrastando para o lado ou pairando sobre um nó."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/api/make-sortable-tree"
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

Renderize `items` (nós planos com uma `depth`); cada linha chama
[`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) com `id: () => node.key`. Veja [Árvores](https://zizigy.github.io/docs/guides/trees).

<example height="26rem" hint="Troque uma opção, depois arraste uma linha para o lado" name="api-tree-options">



</example>

## Opções

<api-table name="SortableTreeOptions">



</api-table>

## Retorno

<api-table name="SortableTreeReturn">



</api-table>

## Nós planos

<api-table name="FlatNode">



</api-table>

## Projeção

<api-table name="TreeProjection">



</api-table>

<api-table name="TreeNesting">



</api-table>

## O evento de drop

<api-table name="SortableTreeDropEvent">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
