---
title: "Animationen"
description: "Die Optionen und Hooks der Animationen – Sortieren, der Drop und Änderungen, die kein Drag ausgelöst hat."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/api/animations"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Die Optionen `animation` (Layout-Bewegungen beim Sortieren), `dropAnimation` (die Landung des
Overlays) und `animate` (Datenänderungen, die kein Drag ausgelöst hat) des Providers nehmen
`false`, Optionen oder deine eigene Funktion entgegen – für GSAP oder motion. Listen und Bäume
können `animation` und `animate` überschreiben; ziehbare Elemente, sortierbare Elemente, Listen
und Drop-Ziele können ihre eigene `dropAnimation` mitbringen. Siehe
[Animationen](https://zizigy.github.io/docs/guides/animations).

```vue
<DnDProvider :animation="{ duration: 180, easing: 'ease-out' }" :drop-animation="false" />
```

Jede Bahn unten ist ein eigener Provider, der `animation`, `dropAnimation` und
`animate` dieselbe Art von Wert gibt (`animate` bekommt in `move` eine Funktion).

<example height="27rem" hint="Mische, oder ziehe in jeder Bahn eine Zeile" name="api-animation-shapes">



</example>

## Optionen

<api-table name="AnimationOptions">



</api-table>

## Sortieren

<api-table name="LayoutAnimation">



</api-table>

<api-table name="LayoutAnimationContext">



</api-table>

## Der Drop

<api-table name="DropAnimation">



</api-table>

<api-table name="DropAnimationContext">



</api-table>

## Datenänderungen

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
