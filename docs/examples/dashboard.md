---
title: "Dashboard"
description: "Widgets on a grid — moved by their headers, resized by their corners a cell at a time, in rows as tall as their content, with fewer columns on narrow screens."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/examples/dashboard"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="38rem" hint="Drag a widget by its header, resize it by its corner, type in the notes" name="dashboard" title="Dashboard">



</example>

## What to look at

- **Dashboard.vue**: the grid is one sortable list with `strategy: 'grid'`, which sorts widgets
of different sizes. It counts its columns from its own width (`useElementSize`): four, three or
two. Its rows are at least 92 px tall and grow with their content, and `grid-auto-flow: dense`
fills the holes a resize leaves.
- **Widget.vue**: a widget moves by its header (`handle`), so its content stays free: the tasks
get ticked, the notes take text. Its corner is a draggable of its own, and resizes it.
- **WidgetBody.vue**: what the widgets show. Type into the notes: the row grows with the text,
and the widgets beside it with the row. Nothing measures them: it is the grid's own layout, and
the library reads the sizes as they are when a drag starts.
- **widgets.ts**: the widgets, their sizes in cells, and the grid's numbers.

Expand the demo: the grid gets four columns, and a widget made narrower on a small screen is as
wide as it was again.

## Resizing: the corner is a draggable

The corner lies inside the widget, and a press drags the closest draggable: the corner, not the
widget. It has no overlay and never moves. The widget grows instead.

```ts [Widget.vue]
makeDraggable(corner, {
  id: cornerId,
  type: 'resize',
  overlay: false,
  activation: { touch: { distance: 4 } }, // a finger resizes at once, not after a long press
  attributes: false,                       // no tab stop: Shift + arrows on the header resize
});
```

The size follows the pointer: how far it went since the press, in whole cells. The grid shows that
size while the corner is held, and its other widgets make room.

```ts [Widget.vue]
const preview = computed<Size | null>(() => {
  const start = from.value;
  if (!resizing.value || !start || !pointer.value) return null;
  return {
    w: clamp(cellsIn(pixels(own.value.w, props.cell) + pointer.value.x - start.x, props.cell), 1, props.columns),
    h: clamp(cellsIn(pixels(own.value.h, ROW) + pointer.value.y - start.y, ROW), 1, MAX_ROWS),
  };
});
```

The drop keeps it: a monitor hears the corner's `onDragEnd`. <kbd value="Escape">



</kbd>

 cancels the
drag instead, and the widget goes back to its own size.

```ts [Widget.vue]
useDnDMonitor({
  onDragEnd: ({ active: dropped }) => {
    if (dropped.id === cornerId() && preview.value) emit('resize', preview.value);
  },
});
```

## The grid sits the resize out

A corner isn't a widget, and the grid would refuse it: the drop on a target that refuses a drag is
a cancel. So while a corner is dragged, the grid is `disabled`, and the corner's drop is on no
target at all.

```ts [Dashboard.vue]
const { active } = useDnD();
const { items } = makeSortableList(grid, {
  items: widgets,
  strategy: 'grid',
  label: 'Dashboard',
  disabled: () => !!active.value?.type.includes('resize'),
});
```

## Sizes that adapt

A widget keeps the size it was given. On fewer columns it is never wider than the grid
(`Math.min(w, columns)`), and it gets its width back when the grid has room again. The rows have a
minimum height, not a height: the content decides, and the widgets in a row all stretch to the
tallest.

## The keyboard

Tab to a widget's header and press <kbd value="Space">



</kbd>

 to pick the widget up. The arrows move it
among the others, <kbd value="Space">



</kbd>

 drops it, <kbd value="Escape">



</kbd>

 puts it back. With the header
focused, <kbd value="Shift">



</kbd>

 and the arrows resize the widget a cell at a time, and screen readers
hear its new size.

Read more: [Strategies](https://zizigy.github.io/docs/guides/sortable-lists#strategies) ·
[Handles](https://zizigy.github.io/docs/guides/sortable-lists#handles) ·
[Without an overlay](https://zizigy.github.io/docs/guides/drag-and-drop#without-an-overlay) ·
[useDnDMonitor()](https://zizigy.github.io/docs/guides/provider#listen-to-every-drag-usedndmonitor) ·
[Week calendar](https://zizigy.github.io/docs/examples/calendar)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
