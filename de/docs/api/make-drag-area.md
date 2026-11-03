---
title: "makeDragArea"
description: "Regeln für die Drags, die in einem Element beginnen – eine Achse, Grenzen, ein Raster, Auto-Scroll, Aktivierung – unter einem einzigen Provider für die ganze App."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/api/make-drag-area"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeDragArea">



</api-signature>

```ts
const board = useTemplateRef<HTMLElement>('board');
makeDragArea(board, { restrictToArea: true, modifiers: [snapToGrid(24)] });
```

Innere Bereiche erben `disabled`; jede andere Regel kommt vom nächstgelegenen Bereich. Siehe
[Achsen, Grenzen und Raster](https://zizigy.github.io/docs/guides/constraints).

Die Chips im Bereich folgen seinen Regeln; der Chip außerhalb lässt sich frei ziehen.

<example height="36rem" hint="Schalte die Regeln des Bereichs um, dann ziehe einen Chip darin" name="api-drag-area">



</example>

## Optionen

<api-table name="DragAreaOptions">



</api-table>

## Rückgabe

<api-table name="DragAreaReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
