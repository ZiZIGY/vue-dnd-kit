---
title: "makeDraggable"
description: "Rend un élément déplaçable — glissement libre, ou vers les cibles de dépôt qui l'acceptent."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/make-draggable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeDraggable">



</api-signature>

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isDragging } = makeDraggable(el, { id: 'card', type: 'card', data: { title } });
```

Voir [Glisser-déposer](https://zizigy.github.io/docs/guides/drag-and-drop). Les items triables sont aussi des éléments
déplaçables : [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) accepte les mêmes options, et
d'autres encore.

<example height="22rem" hint="Faites glisser chaque carte. Relâchez-la, et elle revient à sa place" name="draggable">



</example>

## Options

<api-table name="DraggableOptions">



</api-table>

## Valeur de retour

<api-table name="DraggableReturn">



</api-table>

## Hors de la page

Ce que transporte un glissement `native` hors de la page. Voir [fichiers et autres applications](https://zizigy.github.io/docs/guides/native#out-of-the-page).

<api-table name="NativeDragOptions">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
