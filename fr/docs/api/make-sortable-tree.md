---
title: "makeSortableTree"
description: "Fait d'un conteneur un arbre triable, rendu à plat avec des profondeurs — imbrication en glissant de côté ou en survolant un nœud."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/make-sortable-tree"
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

Rendez `items` (des nœuds plats avec une `depth`) ; chaque ligne appelle
[`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) avec `id: () => node.key`. Voir [Arbres](https://zizigy.github.io/docs/guides/trees).

<example height="26rem" hint="Changez une option, puis faites glisser une ligne de côté" name="api-tree-options">



</example>

## Options

<api-table name="SortableTreeOptions">



</api-table>

## Valeur de retour

<api-table name="SortableTreeReturn">



</api-table>

## Nœuds plats

<api-table name="FlatNode">



</api-table>

## Projection

<api-table name="TreeProjection">



</api-table>

<api-table name="TreeNesting">



</api-table>

## L'événement de dépôt

<api-table name="SortableTreeDropEvent">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
