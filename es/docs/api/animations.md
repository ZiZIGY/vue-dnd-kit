---
title: "Animaciones"
description: "Las opciones y los hooks de las animaciones — la ordenación, el drop y los cambios que no vienen de un arrastre."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/api/animations"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Las props `animation` (movimientos de layout al ordenar), `dropAnimation` (el aterrizaje del
overlay) y `animateChanges` (cambios de datos que no vienen de un arrastre) del provider aceptan
`false`, opciones o tu propia función — para GSAP o motion. Las listas y los árboles pueden
sobrescribir `animation` y `animateChanges`; los elementos arrastrables, los ítems y las listas
pueden traer su propia `dropAnimation`, y los destinos de drop una `overDropAnimation`. Consulta [Animaciones](https://zizigy.github.io/docs/guides/animations).

```vue
<DnDProvider :animation="{ duration: 180, easing: 'ease-out' }" :drop-animation="false" />
```

Cada carril de abajo es un provider propio que da a `animation`, `dropAnimation`
y `animateChanges` el mismo tipo de valor (`animateChanges` acepta una función en `move`).

<example height="27rem" hint="Baraja, o arrastra una fila en cada carril" name="api-animation-shapes">



</example>

## Opciones

<api-table name="AnimationOptions">



</api-table>

## Ordenación

<api-table name="LayoutAnimation">



</api-table>

<api-table name="LayoutAnimationContext">



</api-table>

## El drop

<api-table name="DropAnimation">



</api-table>

<api-table name="DropAnimationContext">



</api-table>

## Cambios de datos

<api-table name="AutoAnimation">



</api-table>

<api-table name="AutoAnimationOptions">



</api-table>

<api-table name="EnterAnimation">



</api-table>

<api-table name="EnterAnimationContext">



</api-table>

<api-table name="LeaveAnimation">



</api-table>

<api-table name="LeaveAnimationContext">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
