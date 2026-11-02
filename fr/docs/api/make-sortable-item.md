---
title: "makeSortableItem"
description: "Enregistre une ligne d'une liste ou d'un arbre triable — elle glisse, fait de la place et atterrit sur son emplacement."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/make-sortable-item"
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

Appelez-le dans le composant de ligne, rendu à l'intérieur de l'élément de la liste (parmi plusieurs
listes créées dans un même composant, la ligne rejoint la plus intérieure autour d'elle). Identifiez
la ligne avec `item` (dont la clé vient du `getKey` de la liste, `item.id` par défaut) ou avec `id`.
Voir [Listes triables](https://zizigy.github.io/docs/guides/sortable-lists).

<example height="24rem" hint="Faites glisser une ligne par sa poignée : la case à cocher fonctionne toujours" name="todo-list">



</example>

## Options

<api-table name="SortableItemOptions">



</api-table>

## Valeur de retour

<api-table name="SortableItemReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
