---
title: "Axes, bounds and grids"
description: "Lock drags to one axis, keep them inside a box, snap them to a grid or to guides of your own — for one item, a list or a whole part of the page."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/guides/constraints"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

A drag can be held to one axis, kept inside a box, snapped to a grid, or bent by a rule of
your own. The rules are **modifiers**: they adjust the drag's offset on every frame. Set
them on one draggable, on a list, or on a part of the page, and the overlay, the drop
targets and the drop all follow them.

## Lock an axis

Clips on a timeline slide along their track. Turn the lock off and they can change tracks
too.

<example height="22rem" hint="Drag a clip; turn the lock off and drag it to the other track" name="axis-timeline">



</example>

```ts [TimelineClip.vue]
const { isDragging } = makeDraggable(el, {
  id: () => props.clip.id,
  axis: () => (props.locked ? 'x' : undefined),
});
```

`axis: 'x'` moves only horizontally, `'y'` only vertically. `makeDraggable`, `makeSortableList`,
`makeSortableTree`, `makeSortableItem` and `makeDragArea` all take it:

```ts
makeSortableList(listRef, { items: tracks, axis: 'y' });
```

- The lock runs **after every modifier**, so it holds whatever they do: a snap or a bound can't
push the item off its line.
- The line is in the content, not on the screen: it moves with the list (or the parent) the drag
started in. Scroll the page mid-drag and the item stays on its row.
- An item's own `axis` wins over its list's or tree's, and a draggable's (or its list's) wins over
its drag area's.
- It is read when a drag starts, so a getter can toggle it, as above.
- A tree locked to `'y'` still nests: the depth then comes from hovering the middle of a row.

<tip>

Prefer `axis` to the `restrictToVerticalAxis` and `restrictToHorizontalAxis` modifiers. They do the
same thing, but as ordinary modifiers they run in the middle of the chain, and a modifier after
them (a grid snapping both axes) can move the item off the axis again.

</tip>

## Modifiers

A modifier adjusts the drag's offset on every frame. Its result moves the overlay **and** is the
point where targets are looked for, so a list sorts by the locked, bounded or snapped position,
and the drop's `position` is where the box ended up.

<table>
<thead>
  <tr>
    <th>
      Modifier
    </th>
    
    <th>
      What it does
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        restrictToParent
      </code>
    </td>
    
    <td>
      Keeps the overlay inside the container the drag started in: the sortable list, or a plain draggable's parent element.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToElement(target)
      </code>
    </td>
    
    <td>
      Keeps the overlay inside an element: a template ref, a getter or the element itself.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToWindowEdges
      </code>
    </td>
    
    <td>
      Keeps the overlay inside the window.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToFirstScrollableAncestor
      </code>
    </td>
    
    <td>
      Keeps the overlay inside the first scrollable ancestor of the dragged element.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapToGrid(size)
      </code>
    </td>
    
    <td>
      Snaps the overlay to a grid (below).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapCenterToCursor
      </code>
    </td>
    
    <td>
      Centers the overlay under the pointer instead of keeping the grab offset.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToVerticalAxis
      </code>
    </td>
    
    <td>
      Moves only vertically. Prefer <code>
        axis: 'y'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToHorizontalAxis
      </code>
    </td>
    
    <td>
      Moves only horizontally. Prefer <code>
        axis: 'x'
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`modifiers` is an option of the provider, of drag areas, of lists and trees, and of draggables
and sortable items. Every one but the provider's also takes a ref or a getter, read when the
drag starts.

### Keep it inside

A self view in a video call stays on the screen. Switch the bound and drag it far out:

<example height="29rem" hint="Drag the self view out of the screen with each bound" name="bounds-pip">



</example>

```ts [SelfView.vue]
const { isDragging } = makeDraggable(el, {
  id: 'self-view',
  modifiers: () => props.modifiers, // [restrictToParent], [restrictToWindowEdges] or []
});
```

- `restrictToParent` holds it on the screen, its parent element. For a sortable item, the
"parent" is its list, wherever the list sits in the DOM.
- `restrictToWindowEdges` lets it leave the screen but not the window. Dropped off the
screen, it isn't on a drop target, so it flies back.
- Without a bound it goes anywhere.

A bound keeps the **overlay** inside, at the size it has: with `overlayFit: 'slot'`, a box
that grows over a list of wider items is kept inside at its new size.

### Snap to a grid

The nodes of a flowchart snap to the canvas grid. Switch the cell size and the glide:

<example height="29rem" hint="Drag a node; switch the grid and smooth" name="snap-canvas">



</example>

```ts [FlowNode.vue]
const { isDragging } = makeDraggable(el, {
  id: () => props.node.id,
  modifiers: () => [snapToGrid({ x: props.grid, y: props.grid, smooth: props.smooth })],
});
```

`snapToGrid(24)` snaps both axes to 24 px cells. An object sets more:

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Meaning
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        x
      </code>
      
      , <code>
        y
      </code>
    </td>
    
    <td>
      The cell size in pixels, per axis. Leave one out to snap the other only: <code>
        { y: 15 }
      </code>
      
       snaps an event to quarter hours and lets it move freely across the days.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        origin
      </code>
    </td>
    
    <td>
      <code>
        'container'
      </code>
      
       (default): the overlay's top-left corner lands on grid lines drawn from the container's top-left — the sortable list, or a plain draggable's parent. <code>
        'delta'
      </code>
      
      : the offset itself is rounded, so an item that started off the grid stays off it and moves by whole cells from where it was. Pick it for items placed anywhere (a free canvas) that should keep their own alignment.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        smooth
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       or <code>
        { duration, easing }
      </code>
      
      : the overlay glides between cells (80 ms by default). Targets use the snapped position at once.
    </td>
  </tr>
</tbody>
</table>

With `origin: 'container'`, draw the grid from the container's border box: the canvas
above has its frame as a `box-shadow`, not a `border`, so its lines start at its very edge.

### Your own modifier

Boxes on a slide jump onto the edges and centers of the others when they come close, and
pink guides show the lines they sit on:

<example height="26rem" hint="Drag a box next to another one, or to the middle of the slide" name="magnet-guides">



</example>

```ts [Slide.vue]
import type { Modifier } from '@vue-dnd-kit/core';

/** Near a line, the box jumps onto it. */
const magnet: Modifier = ({ transform, overlayRect, containerRect, active }) => {
  if (!containerRect) return transform;
  const id = String(active.id);
  const left = overlayRect.left - containerRect.left;
  const top = overlayRect.top - containerRect.top;
  return {
    x: transform.x + pull(left, overlayRect.width, lines(id, 'x')),
    y: transform.y + pull(top, overlayRect.height, lines(id, 'y')),
  };
};

// In order: the magnet pulls, then the slide's edges hold.
const modifiers = [magnet, restrictToParent];
```

A modifier gets `transform`, the offset from the drag start as the modifiers before it left
it, and returns a new one. It also gets what it may need to compute it:

<table>
<thead>
  <tr>
    <th>
      Argument
    </th>
    
    <th>
      What it is
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        transform
      </code>
    </td>
    
    <td>
      The offset so far.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayRect
      </code>
    </td>
    
    <td>
      The overlay box moved by <code>
        transform
      </code>
      
      , at the size it has now.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activeRect
      </code>
    </td>
    
    <td>
      The dragged element when the drag started.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        containerRect
      </code>
    </td>
    
    <td>
      The container the drag started in (the sortable list, or the parent element), where it is now: it follows scrolling.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        windowRect
      </code>
    </td>
    
    <td>
      The window.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        origin
      </code>
    </td>
    
    <td>
      The pointer when the drag started.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        active
      </code>
      
      , <code>
        over
      </code>
    </td>
    
    <td>
      The drag and the target under it.
    </td>
  </tr>
</tbody>
</table>

Modifiers run on every frame: keep them quick and free of side effects. The guides above
are drawn from the drag's `delta` in a monitor's `onDragMove`, which is the offset after
every modifier. Types in [Modifiers](https://zizigy.github.io/docs/api/modifiers).

## The order

Modifiers from several places run one after another, each from the result of the one before:

1. the provider's `modifiers`;
2. the `modifiers` of the drag area the drag started in;
3. the dragged item's own `modifiers` or, when it has none, its list's or tree's;
4. the drag area's `restrictToArea`;
5. the `axis` lock.

Within one array they run in order, so put snaps and magnets before bounds: a bound last
keeps the box inside whatever the others did. The slide above runs `[magnet, restrictToParent]`;
the other way round, the magnet could pull a box held at the slide's edge a few pixels past it.

An item's `modifiers` **replace** its list's; they don't add to them. The area's bounds come after
the snapping of steps 1–3, so a snapped item still stays inside, and the axis lock comes last of
all.

## Bounded lists keep their ends

A layers panel: rows move up and down only, and never leave the panel. Drag the top row to
the very bottom:

<example height="26rem" hint="Drag Heading to the bottom, past the panel's edge" name="bounded-layers">



</example>

```ts [Layers.vue]
const { items } = makeSortableList(list, { items: layers, axis: 'y', modifiers: [restrictToParent] });
```

A bound holds the overlay at the box's edge while the pointer goes on. Once the pointer has left
the overlay along the list's axis, the list sorts by the pointer instead, so the first and the
last place stay in reach however you hold the item. Grids keep sorting by the overlay: held at the
edge, it already covers the edge cell.

## Rules for a part of the page

Two areas, two sets of rules. Stickers in Layout snap to its grid and can't leave it;
stickers in Sketch go anywhere, into Layout too. A drag keeps the rules of the area it
started in, and the area whose rules are in force lights up.

<example height="25rem" hint="Drag a sticker in Layout, then one from Sketch into Layout" name="drag-areas">



</example>

```vue [DragArea.vue]
<script setup lang="ts">
const area = useTemplateRef<HTMLElement>('area');
const { isDragging } = makeDragArea(area, {
  modifiers: () => (props.strict ? [snapToGrid(24)] : []),
  restrictToArea: () => props.strict,
});
</script>

<template>
  <div ref="area" class="area" :class="{ busy: isDragging }">
    <Sticker v-for="sticker in stickers" :key="sticker.id" :sticker="sticker" />
  </div>
</template>
```

`makeDragArea` sets rules for the drags that **start inside** its element — plain draggables and
sortable items alike, which then need no rules of their own. Keep one `DnDProvider` for the
whole app, and give a board, a canvas or a feed an area of its own.

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      What it does
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        axis
      </code>
    </td>
    
    <td>
      Locks the drags to one axis. A draggable's own <code>
        axis
      </code>
      
      , or its list's, wins.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifiers
      </code>
    </td>
    
    <td>
      Run after the provider's and before the draggable's own.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToArea
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
      : the drags stay inside the area's element.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        autoScroll
      </code>
    </td>
    
    <td>
      Auto-scroll of the area's scroll container (the element, or its closest scrollable ancestor). <code>
        false
      </code>
      
       turns it off there.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      <a href="/docs/guides/sensors#activation-constraints">
        Activation
      </a>
      
       per pointer kind, such as a longer touch press in a scrolling feed. A draggable's own wins; the provider's comes last.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      No drag starts in the area, nor in the areas inside it. Its draggables report <code>
        aria-disabled
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Every option takes a value, a ref or a getter, read when a press or a drag starts. The area
returns `isDragging` (a drag that started here is running, as the lit frame above shows) and
`isAutoScrolling` (auto-scroll is moving its container). Full reference:
[makeDragArea](https://zizigy.github.io/docs/api/make-drag-area).

### How areas combine

- A drag follows the area it **started in**, even after it leaves it. Passing over an area changes
nothing, except its `autoScroll`: that one applies to every drag that scrolls its container.
- Nested areas don't merge: the closest one wins. `disabled` is the exception, and it is
inherited: an area that is off turns off the areas inside it too.
- Collision detection, keyboard keys and announcements stay provider-wide.

<note>

Why not a second `DnDProvider` around the board? Providers are independent: a drag never crosses
from one to another, so the board's items could never leave it. Nest a provider only when a part
of the page needs provider-wide settings of its own and its items stay inside it. See
[The provider](https://zizigy.github.io/docs/guides/provider).

</note>

## Leave it where it's dropped

The timeline, the call, the flowchart, the slide and the areas above all keep each item where it
was dropped. Every drag event carries `position`: the dragged box's top-left corner inside the
target, from its padding edge and with its scroll — the `left` and `top` that put an absolutely
positioned item right there. It comes after the modifiers, so a snapped node lands on the grid.

```ts [Flowchart.vue]
makeDroppable(canvas, { id: 'canvas' });
useDnDMonitor({
  onDragEnd({ active, over, position }) {
    const node = nodes.value.find((item) => item.id === active.id);
    if (!node || over?.id !== 'canvas' || !position) return;
    node.x = Math.round(position.x);
    node.y = Math.round(position.y);
  },
});
```

More on free dragging and drop targets in [Drag and drop](https://zizigy.github.io/docs/guides/drag-and-drop).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
