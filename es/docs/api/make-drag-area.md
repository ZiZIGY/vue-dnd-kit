---
title: "makeDragArea"
description: "Reglas para los arrastres que empiezan dentro de un elemento — un eje, límites, una cuadrícula, desplazamiento automático, activación — bajo un único provider para toda la app."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/api/make-drag-area"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeDragArea(
  target: MaybeElementRef,
  options?: DragAreaOptions,
): DragAreaReturn;
```

```ts
const board = useTemplateRef<HTMLElement>('board');
makeDragArea(board, { restrictToArea: true, modifiers: [snapToGrid(24)] });
```

Cuando hay áreas anidadas, gana la más cercana, excepto `disabled`, que heredan las áreas
interiores. Consulta [Ejes, límites y cuadrículas](https://zizigy.github.io/docs/guides/constraints).

Las fichas dentro del área siguen sus reglas; la que está fuera se arrastra libremente.

<example height="36rem" hint="Cambia las reglas del área y luego arrastra una ficha dentro de ella" name="api-drag-area">



</example>

## Opciones

<api-table name="DragAreaOptions">



</api-table>

## Valor devuelto

<api-table name="DragAreaReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
