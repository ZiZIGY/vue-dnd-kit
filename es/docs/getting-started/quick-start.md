---
title: "Inicio rápido"
description: "Una lista ordenable en tres archivos — un provider, una lista y sus filas."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/getting-started/quick-start"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Aquí tienes todo, funcionando. Arrastra una fila, o llega a una con Tab, pulsa
<kbd value="Space">



</kbd>

, muévela con las flechas y vuelve a pulsar <kbd value="Space">



</kbd>

.

<example name="quick-start" title="Inicio rápido">



</example>

## Paso a paso

<steps level="3">

### Envuelve la app en un provider

`DnDProvider` gestiona el arrastre. Todo composable debe ejecutarse en un componente **renderizado
dentro** de él — no en el componente cuyo template lo contiene.

### Crea una lista

`makeSortableList` recibe el elemento de la lista y tu array. Devuelve `items`: un borrador que se
reordena en vivo mientras arrastras. Renderiza el borrador, no tu array, y usa el id como clave de
las filas.

### Crea las filas

Cada fila llama a `makeSortableItem` con su elemento y el ítem que renderiza. Su clave sale de
`item.id`.

</steps>

Al soltar, `tasks` recibe el nuevo orden — es una `ref` normal, así que el resto de tu app ve el
cambio como cualquier otro.

<tip>

¿Usas Pinia, un servidor o datos inmutables? Pasa un getter en lugar de una ref, luego llama a
`e.preventDefault()` en `onDrop` y aplica `e.result` tú mismo.

</tip>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
