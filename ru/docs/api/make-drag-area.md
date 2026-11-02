---
title: "makeDragArea"
description: "Правила для драгов, которые начинаются внутри элемента, — ось, границы, сетка, автоскролл, активация — при одном провайдере на всё приложение."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/make-drag-area"
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

Когда области вложены, побеждает ближайшая — кроме `disabled`, который внутренние области
наследуют. См. [оси, границы и сетки](https://zizigy.github.io/docs/guides/constraints).

Чипы внутри области следуют её правилам; тот, что снаружи, перетаскивается свободно.

<example height="36rem" hint="Переключите правила области, затем перетащите чип внутри неё" name="api-drag-area">



</example>

## Опции

<api-table name="DragAreaOptions">



</api-table>

## Возвращает

<api-table name="DragAreaReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
