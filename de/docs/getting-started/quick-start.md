---
title: "Schnellstart"
description: "Eine sortierbare Liste in drei Dateien – ein Provider, eine Liste und ihre Zeilen."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/getting-started/quick-start"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Hier läuft das Ganze schon. Ziehe eine Zeile – oder springe mit Tab zu einer, drücke
<kbd value="Space">



</kbd>

, bewege sie mit den Pfeiltasten und drücke wieder <kbd value="Space">



</kbd>

.

<example name="quick-start" title="Schnellstart">



</example>

## Schritt für Schritt

<steps level="3">

### Umschließe die App mit einem Provider

`DnDProvider` verantwortet den Drag. Jedes Composable muss in einer Komponente laufen, die **in
ihm gerendert** wird – nicht in der Komponente, deren Template ihn enthält.

### Erstelle eine Liste

`makeSortableList` nimmt das Element der Liste und dein Array entgegen. Es gibt `items` zurück:
einen Entwurf, der sich schon während des Ziehens neu ordnet. Rendere den Entwurf, nicht dein
Array, und verwende die ID als Schlüssel der Zeilen.

### Erstelle die Zeilen

Jede Zeile ruft `makeSortableItem` mit ihrem Element und dem Datenelement auf, das sie rendert.
Ihr Schlüssel kommt aus `item.id`.

</steps>

Wenn der Drop landet, bekommt `tasks` die neue Reihenfolge – es ist ein normaler `ref`, also
sieht der Rest deiner App die Änderung wie jede andere.

<tip>

Nutzt du Pinia, einen Server oder unveränderliche Daten? Übergib einen Getter statt eines Refs,
rufe dann `e.preventDefault()` in `onDrop` auf und wende `e.result` selbst an.

</tip>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
