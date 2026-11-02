---
title: "Анимации"
description: "Опции и хуки анимаций — сортировка, бросок и изменения, сделанные не драгом."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/animations"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

`animation` провайдера (перемещения раскладки при сортировке), `dropAnimation` (приземление
оверлея) и `animateChanges` (изменения данных, сделанные не драгом) принимают `false`, опции или
вашу собственную функцию — для GSAP или motion. Списки и деревья могут переопределять `animation` и
`animateChanges`; перетаскиваемые элементы, сортируемые элементы и списки могут задавать
собственную `dropAnimation`, а цели — `overDropAnimation`. См. [анимации](https://zizigy.github.io/docs/guides/animations).

```vue
<DnDProvider :animation="{ duration: 180, easing: 'ease-out' }" :drop-animation="false" />
```

Каждая дорожка ниже — отдельный провайдер, который задаёт `animation`, `dropAnimation` и
`animateChanges` значения одного вида (`animateChanges` в `move` принимает функцию).

<example height="27rem" hint="Перемешайте или перетащите строку в каждой дорожке" name="api-animation-shapes">



</example>

## Опции

<api-table name="AnimationOptions">



</api-table>

## Сортировка

<api-table name="LayoutAnimation">



</api-table>

<api-table name="LayoutAnimationContext">



</api-table>

## Бросок

<api-table name="DropAnimation">



</api-table>

<api-table name="DropAnimationContext">



</api-table>

## Изменения данных

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
