---
title: "Animations"
description: "Les options et les hooks des animations — le tri, le dépôt, et les changements qui ne viennent pas d'un glissement."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/animations"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Les props `animation` (déplacements de mise en page pendant le tri), `dropAnimation`
(l'atterrissage de l'overlay) et `animateChanges` (changements de données qui ne viennent pas d'un
glissement) du provider acceptent `false`, des options, ou votre propre fonction — pour GSAP ou
motion. Les listes et les arbres peuvent redéfinir `animation` et `animateChanges` ; les éléments
déplaçables, les items et les listes peuvent apporter leur propre `dropAnimation`, et les cibles
de dépôt une `overDropAnimation`. Voir [Animations](https://zizigy.github.io/docs/guides/animations).

```vue
<DnDProvider :animation="{ duration: 180, easing: 'ease-out' }" :drop-animation="false" />
```

Chaque couloir ci-dessous est un provider à part entière, qui donne à `animation`,
`dropAnimation` et `animateChanges` le même type de valeur (`animateChanges` accepte une fonction dans `move`).

<example height="27rem" hint="Mélangez, ou faites glisser une ligne dans chaque couloir" name="api-animation-shapes">



</example>

## Options

<api-table name="AnimationOptions">



</api-table>

## Tri

<api-table name="LayoutAnimation">



</api-table>

<api-table name="LayoutAnimationContext">



</api-table>

## Le dépôt

<api-table name="DropAnimation">



</api-table>

<api-table name="DropAnimationContext">



</api-table>

## Changements de données

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
