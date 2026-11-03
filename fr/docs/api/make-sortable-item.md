---
title: "makeSortableItem"
description: "Enregistre une ligne d'une liste ou d'un arbre triable — elle glisse, fait de la place et atterrit sur son emplacement."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/make-sortable-item"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableItem">



</api-signature>

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isPlaceholder, index } = makeSortableItem(el, { item: () => props.task, handle: '.grip' });
```

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
