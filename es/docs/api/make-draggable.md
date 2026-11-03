---
title: "makeDraggable"
description: "Hace que un elemento se pueda arrastrar — arrastre libre, o hacia los destinos de drop que lo aceptan."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/api/make-draggable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeDraggable">



</api-signature>

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isDragging } = makeDraggable(el, { id: 'card', type: 'card', data: { title } });
```

Consulta [Arrastrar y soltar](https://zizigy.github.io/docs/guides/drag-and-drop). Los ítems ordenables también son
elementos arrastrables: [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) acepta las mismas
opciones y alguna más.

<example height="22rem" hint="Arrastra cada tarjeta. Suéltala y volverá a su sitio" name="draggable">



</example>

## Opciones

<api-table name="DraggableOptions">



</api-table>

## Valor devuelto

<api-table name="DraggableReturn">



</api-table>

## Fuera de la página

Lo que lleva un arrastre `native` fuera de la página. Consulta [archivos y otras apps](https://zizigy.github.io/docs/guides/native#out-of-the-page).

<api-table name="NativeDragOptions">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
