---
title: "Animations"
description: "The options and hooks of the animations — sorting, the drop, and changes no drag made."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/api/animations"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

The provider's `animation` (layout moves while sorting), `dropAnimation` (the overlay landing)
and `animateChanges` (data changes no drag made) take `false`, options, or your own function — for
GSAP or motion. Lists and trees can override `animation` and `animateChanges`; draggables, items
and lists can bring their own `dropAnimation`, and drop targets an `overDropAnimation`. See
[Animations](https://zizigy.github.io/docs/guides/animations).

```vue
<DnDProvider :animation="{ duration: 180, easing: 'ease-out' }" :drop-animation="false" />
```

Each lane below is a provider of its own that gives `animation`, `dropAnimation` and `animateChanges`
the same kind of value (`animateChanges` takes a function in `move`).

<example height="27rem" hint="Shuffle, or drag a row in each lane" name="api-animation-shapes">



</example>

## Options

<api-table name="AnimationOptions">



</api-table>

## Sorting

<api-table name="LayoutAnimation">



</api-table>

<api-table name="LayoutAnimationContext">



</api-table>

## The drop

<api-table name="DropAnimation">



</api-table>

<api-table name="DropAnimationContext">



</api-table>

## Data changes

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
