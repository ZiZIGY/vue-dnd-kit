---
title: "makeDroppable"
description: "Convierte un elemento en un destino de drop, con reglas sobre lo que acepta y hooks para el drop."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/api/make-droppable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeDroppable<TData = unknown>(
  target: MaybeElementRef,
  options?: DroppableOptions<TData>,
): DroppableReturn;
```

```ts
const zone = useTemplateRef<HTMLElement>('zone');
const { isOver, isAccepting } = makeDroppable(zone, {
  accept: 'image',
  onDrop: (e) => move(e.active.id),
});
```

Consulta [Arrastrar y soltar](https://zizigy.github.io/docs/guides/drag-and-drop) y [Decidir un drop](https://zizigy.github.io/docs/guides/drop-decisions).

<example height="26rem" hint="Suelta los archivos en las zonas que los aceptan" name="droppable">



</example>

## Opciones

<api-table name="DroppableOptions">



</api-table>

## Valor devuelto

<api-table name="DroppableReturn">



</api-table>

## Reglas de aceptación

<api-table name="AcceptRule">



</api-table>

<api-table name="AcceptContext">



</api-table>

<api-table name="AcceptMode">



</api-table>

## Desde fuera de la página

Lo que `external` acepta de los arrastres que vienen de fuera de la página, y lo que lleva un
arrastre así (`e.external`). Consulta [archivos y otras apps](https://zizigy.github.io/docs/guides/native).

<api-table name="ExternalAccept">



</api-table>

<api-table name="ExternalData">



</api-table>

<api-table name="ExternalFile">



</api-table>

## Placement

<api-table name="Placement">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
