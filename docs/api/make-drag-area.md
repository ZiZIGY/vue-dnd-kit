---
title: "makeDragArea"
description: "Rules for the drags that start inside an element — an axis, bounds, a grid, auto-scroll, activation — under one app-wide provider."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/api/make-drag-area"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeDragArea">



</api-signature>

```ts
const board = useTemplateRef<HTMLElement>('board');
makeDragArea(board, { restrictToArea: true, modifiers: [snapToGrid(24)] });
```

Inner areas inherit `disabled`; every other rule comes from the closest area. See
[Axes, bounds and grids](https://zizigy.github.io/docs/guides/constraints).

The chips inside the area follow its rules; the one outside it drags freely.

<example height="36rem" hint="Switch the area's rules, then drag a chip inside it" name="api-drag-area">



</example>

## Options

<api-table name="DragAreaOptions">



</api-table>

## Returns

<api-table name="DragAreaReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
