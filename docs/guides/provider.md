---
title: "The provider"
description: "DnDProvider owns every drag under it. It finds the target, starts drags, scrolls, and tells useDnD and useDnDMonitor everything that happens."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/guides/provider"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## One provider for the app

```vue [App.vue]
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
</script>

<template>
  <DnDProvider>
    <RouterView />
  </DnDProvider>
</template>
```

Put one `DnDProvider` high up, in `App.vue` or a layout, and forget about it. Every
composable (`makeSortableList`, `makeDraggable`, `useDnD`…) looks for the closest provider
above the component it runs in.

<warning>

A composable must run in a component **rendered inside** the provider. Calling it in the
component whose own template contains `<DnDProvider>` throws
`No <DnDProvider> found above this component`: Vue's `inject` only sees ancestors.

</warning>

## What it owns

<table>
<thead>
  <tr>
    <th>
      Part
    </th>
    
    <th>
      What the provider does
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Input
    </td>
    
    <td>
      Turns pointer, touch and keyboard input into drags (<code>
        sensors
      </code>
      
      , <code>
        activation
      </code>
      
      ), one drag at a time.
    </td>
  </tr>
  
  <tr>
    <td>
      Finding the target
    </td>
    
    <td>
      Hit-tests the drop targets under the drag (<code>
        collision
      </code>
      
      ) and tells them.
    </td>
  </tr>
  
  <tr>
    <td>
      The overlay
    </td>
    
    <td>
      Renders the box that follows the pointer, teleported to <code>
        body
      </code>
      
      , and lands it on drop.
    </td>
  </tr>
  
  <tr>
    <td>
      The selection
    </td>
    
    <td>
      One set of selected ids, shared by every list and draggable under it.
    </td>
  </tr>
  
  <tr>
    <td>
      Auto-scroll
    </td>
    
    <td>
      Scrolls containers and the window when a drag nears their edges.
    </td>
  </tr>
  
  <tr>
    <td>
      The live region
    </td>
    
    <td>
      Announces pickups, moves, drops and cancels to screen readers.
    </td>
  </tr>
</tbody>
</table>

It renders nothing else: your markup stays as it is.

## Options at a glance

Every option has a default that works, so the provider usually takes none. The provider
reads its props when it needs them: the demos below switch `collision`, `activation` and
`autoScroll` live.

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Default
    </th>
    
    <th>
      What it sets
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        collision
      </code>
    </td>
    
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      How the target under the drag is chosen. <a href="#finding-the-target">
        Below
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      mouse 4 px, touch 200 ms
    </td>
    
    <td>
      When a press becomes a drag, per pointer kind. <a href="#when-a-press-becomes-a-drag">
        Below
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        autoScroll
      </code>
    </td>
    
    <td>
      on
    </td>
    
    <td>
      Edge scrolling: <code>
        { threshold, maxSpeed, acceleration }
      </code>
      
       or <code>
        false
      </code>
      
      . <a href="#auto-scroll">
        Below
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        haptics
      </code>
    </td>
    
    <td>
      a short vibration on touch pickup
    </td>
    
    <td>
      Vibrations for touch drags, or <code>
        false
      </code>
      
      . <a href="#haptics-and-the-copy-key">
        Below
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        copyModifier
      </code>
    </td>
    
    <td>
      <code>
        'Alt'
      </code>
    </td>
    
    <td>
      Key that, held while dragging, turns a move into a copy.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifiers
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      Movement rules for every drag: see <a href="/docs/guides/constraints">
        constraints
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animation
      </code>
      
       / <code>
        dropAnimation
      </code>
    </td>
    
    <td>
      on
    </td>
    
    <td>
      Items sliding while sorting / the overlay landing: see <a href="/docs/guides/animations">
        animations
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animateChanges
      </code>
    </td>
    
    <td>
      off
    </td>
    
    <td>
      Default for lists and trees: animate data changes no drag made.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard
      </code>
    </td>
    
    <td>
      Space / Enter, Escape
    </td>
    
    <td>
      Keyboard keys and step; <code>
        false
      </code>
      
       turns keyboard drags off. See <a href="/docs/guides/accessibility#the-keyboard">
        accessibility
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sensors
      </code>
    </td>
    
    <td>
      pointer + keyboard
    </td>
    
    <td>
      What turns input into drags: see <a href="/docs/guides/sensors">
        sensors
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayTo
      </code>
    </td>
    
    <td>
      <code>
        'body'
      </code>
    </td>
    
    <td>
      Where the overlay is teleported.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayFit
      </code>
    </td>
    
    <td>
      <code>
        'slot'
      </code>
    </td>
    
    <td>
      Overlay size: the slot it will land in, or the source's. See <a href="/docs/guides/overlay">
        the overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayTransition
      </code>
    </td>
    
    <td>
      a crossfade
    </td>
    
    <td>
      How the overlay changes from one component to another mid-drag: <code>
        false
      </code>
      
      , or <code>
        <Transition>
      </code>
      
       props. See <a href="/docs/guides/overlay#targets-that-change-the-overlay">
        targets that change the overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayClass
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      Classes for the overlay's content (<code>
        [data-dnd-overlay-content]
      </code>
      
      ), the element to animate as a whole: a lift as the drag picks up, a settle as it lands. See <a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        the overlay: lift, tilt, settle
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayPreviews
      </code>
    </td>
    
    <td>
      <code>
        5
      </code>
    </td>
    
    <td>
      Multi-drag: how many dragged items get a clone at pickup, or <code>
        'all'
      </code>
      
      . See <a href="/docs/guides/multi-drag#the-default-overlay">
        the default overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        announcements
      </code>
    </td>
    
    <td>
      built-in
    </td>
    
    <td>
      Screen reader texts, or <code>
        false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        screenReaderInstructions
      </code>
    </td>
    
    <td>
      built-in
    </td>
    
    <td>
      The text every draggable points to with <code>
        aria-describedby
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        defaultStyles
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
    </td>
    
    <td>
      Injects zero-specificity CSS for drag states: see <a href="/docs/guides/styling">
        styling
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

The full list with every shape is in the [DnDProvider API](https://zizigy.github.io/docs/api/dnd-provider). The
provider also emits `drag-start`, `drag-move`, `drag-over`, `drag-end`, `drag-cancel`,
`drag-resume` and `drag-settle`, the same events `useDnDMonitor` hears.

## Read the drag: `useDnD()`

<example height="27rem" hint="Drag a task and watch the state" name="provider-state">



</example>

`useDnD()` returns the drag as reactive state, in any component under the provider:

```ts
import { useDnD } from '@vue-dnd-kit/core';

const { status, active, over, pointer, activation, isAutoScrolling, selection, cancel } = useDnD();
```

<table>
<thead>
  <tr>
    <th>
      Field
    </th>
    
    <th>
      What it holds
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        status
      </code>
    </td>
    
    <td>
      <code>
        'idle'
      </code>
      
      , <code>
        'activating'
      </code>
      
       (a press waiting for its activation), <code>
        'dragging'
      </code>
      
      , <code>
        'dropping'
      </code>
      
       (no drag runs, but an overlay still lands, or an async <code>
        onBeforeDrop
      </code>
      
       decides), <code>
        'selecting'
      </code>
      
       (a rubber band).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        active
      </code>
    </td>
    
    <td>
      What is dragged: <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
       (every dragged id, the grabbed one first), <code>
        items
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      , <code>
        element
      </code>
      
      , <code>
        rect
      </code>
      
      , <code>
        sensor
      </code>
      
      . <code>
        null
      </code>
      
       when idle.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      The target under the drag: <code>
        id
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        element
      </code>
      
      , <code>
        rect
      </code>
      
       and <code>
        accepted
      </code>
      
      . <code>
        null
      </code>
      
       over nothing.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer
      </code>
    </td>
    
    <td>
      The pointer in viewport coordinates, after modifiers.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation.progress
      </code>
    </td>
    
    <td>
      <code>
        0
      </code>
      
       to <code>
        1
      </code>
      
       while a press waits for its activation: draw a ring with it.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAutoScrolling
      </code>
    </td>
    
    <td>
      Auto-scroll is moving something.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selection
      </code>
    </td>
    
    <td>
      The provider's selection: <code>
        ids
      </code>
      
      , <code>
        has
      </code>
      
      , <code>
        add
      </code>
      
      , <code>
        delete
      </code>
      
      , <code>
        toggle
      </code>
      
      , <code>
        set
      </code>
      
      , <code>
        clear
      </code>
      
      . See <a href="/docs/guides/multi-drag">
        multi-drag
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Cancels the running drag (the items fly back), a charging press, or a selection band.
    </td>
  </tr>
</tbody>
</table>

```vue [DropHint.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';

const { status, over } = useDnD();
const refused = computed(() => status.value === 'dragging' && over.value?.accepted === false);
</script>

<template>
  <p v-if="refused" role="status">This list doesn't take that.</p>
</template>
```

As soon as a drop is decided, `active`, `over` and `pointer` read `null`, even while the
overlay is still landing (`status` reads `'dropping'`). UI derived from them never shows
the old drag next to the new data. While an async `onBeforeDrop` waits, the state stays as
it was at release.

The next drag doesn't wait for a landing: it starts at once, and `status` reads
`'dragging'` while the last overlay lands around it. A press on a landing overlay catches
it in flight: the drag goes on from where the overlay is. `onDragSettle` tells when a drag's
overlay is home.

## Listen to every drag: `useDnDMonitor()`

```ts
import { useDnDMonitor } from '@vue-dnd-kit/core';

useDnDMonitor({
  onDragStart: ({ active }) => {},
  onDragMove: ({ pointer, delta }) => {},
  onDragOver: ({ over }) => {},                  // the target changed
  onBeforeDrop: (e) => 'accept',                 // or 'reject', 'continue', some ids; may be async
  onDragEnd: ({ active, over, dropped, accepted, position }) => {},
  onDragCancel: ({ active }) => {},
  onDragResume: ({ active }) => {},              // onBeforeDrop answered 'continue'
  onDragSettle: ({ active, over }) => {},        // its overlay has landed
});
```

A monitor hears every drag under its provider, wherever it starts: the panel above logs
the list's drags without importing it. It stops when the component that called it
unmounts.

<table>
<thead>
  <tr>
    <th>
      Event
    </th>
    
    <th>
      When
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        onDragStart
      </code>
    </td>
    
    <td>
      A drag starts.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragMove
      </code>
    </td>
    
    <td>
      The drag moves.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      The target under the drag changes.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      The drag is released. Its answer decides the drop: see <a href="/docs/guides/drop-decisions">
        deciding a drop
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnd
      </code>
    </td>
    
    <td>
      The drop went through. Sortable lists have already run their <code>
        onDrop
      </code>
      
       and written the new order. <code>
        dropped
      </code>
      
       is <code>
        false
      </code>
      
       when it ended over no target.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      Escape, a drop on a target that refuses it, or an <code>
        onBeforeDrop
      </code>
      
       that answered <code>
        'reject'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragResume
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       answered <code>
        'continue'
      </code>
      
      : nothing dropped, and the drag goes on.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragSettle
      </code>
    </td>
    
    <td>
      The drag's overlay has landed (or flown back, or was caught by the next drag), with the event <code>
        onDragEnd
      </code>
      
       or <code>
        onDragCancel
      </code>
      
       got. Other drags may have started meanwhile.
    </td>
  </tr>
</tbody>
</table>

Every event carries `active`, `over`, `pointer`, `delta` (the offset from the start),
`position` (where the dragged box sits in `over`, see
[drag and drop](https://zizigy.github.io/docs/guides/drag-and-drop#leave-it-where-it-was-dropped)) and, for items
from a sortable list, `source`. The full shapes are in the [events API](https://zizigy.github.io/docs/api/events).

<note>

`onDragEnd` is the place for "after the drop" work: saving, clearing the selection,
analytics. A list's own `onDrop` runs **before** its write, so it still sees the old order.

</note>

## Finding the target

Pick a function, then drag the pin or the card over the targets. The badges show how the
function ranks them on this frame; the green one is the target.

<example height="33rem" hint="Switch the function, drag over the nested, small and overlapping targets" name="collision-lab">



</example>

On every frame of a drag, the provider gives `collision` the drop targets in play, and it
returns their ids, best first. Five functions come with the library:

<table>
<thead>
  <tr>
    <th>
      Function
    </th>
    
    <th>
      Ranks
    </th>
    
    <th>
      Good for
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      What is under the pointer; when that's nothing, what the dragged box overlaps.
    </td>
    
    <td>
      The default: precise under the pointer, forgiving in the gaps.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      Only what is under the pointer, the innermost first.
    </td>
    
    <td>
      Precise targets: a gap drops nowhere.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      Every target the dragged box overlaps: higher <code>
        priority
      </code>
      
      , then deeper nesting, then the bigger overlap.
    </td>
    
    <td>
      Big items over small targets, where the pointer is at the item's edge.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      Every target, by the distance from the box's center to theirs.
    </td>
    
    <td>
      Something always wins, even far away: grids and lists of same-size items.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      Every target, by the distances between the four corners.
    </td>
    
    <td>
      Columns stacked side by side (kanban), targets of very different heights.
    </td>
  </tr>
</tbody>
</table>

Under the pointer, hit-testing respects what the user sees: of overlapping targets only the
one on top is hit (`front`, never `back` where they overlap), and of nested ones the
innermost comes first (`subfolder`, then `folder`).

### A function of your own

```ts [magnet.ts]
import type { CollisionDetection, Coordinates, Rect } from '@vue-dnd-kit/core';

/** How far the point is from the rect: 0 inside it. */
const gap = (rect: Rect, point: Coordinates) =>
  Math.hypot(
    Math.max(rect.left - point.x, 0, point.x - rect.right),
    Math.max(rect.top - point.y, 0, point.y - rect.bottom),
  );

/** What is under the pointer; in a gap, the nearest target within 40px. */
export const magnet: CollisionDetection = ({ hits, pointer, candidates }) => {
  if (hits.length) return hits;
  return candidates
    .filter((candidate) => gap(candidate.rect, pointer) <= 40)
    .sort((a, b) => gap(a.rect, pointer) - gap(b.rect, pointer))
    .map((candidate) => candidate.id);
};
```

<table>
<thead>
  <tr>
    <th>
      Argument
    </th>
    
    <th>
      What it holds
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointer
      </code>
    </td>
    
    <td>
      The pointer, after modifiers.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayRect
      </code>
    </td>
    
    <td>
      The dragged box as it is shown, <code>
        null
      </code>
      
       without an overlay.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        candidates
      </code>
    </td>
    
    <td>
      Every target in play: <code>
        id
      </code>
      
      , <code>
        rect
      </code>
      
       (its visible part, clipped by scroll containers), <code>
        priority
      </code>
      
      , <code>
        depth
      </code>
      
       (<code>
        0
      </code>
      
       at the top, deeper when nested).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hits
      </code>
    </td>
    
    <td>
      The targets under the pointer, from hit-testing, best first.
    </td>
  </tr>
</tbody>
</table>

Return an empty array for "no target". Disabled targets, targets inside the dragged items
and targets hidden by their scroll containers never reach the function. A target that
refuses the drag still competes: over it, `over.accepted` is `false` and a drop is refused
(a target inside a sortable item steps aside instead, so the list sorts over it). The demo
wraps the chosen function to record its ranking:
`(args) => (ranked.value = detect(args))`.

<note>

The provider damps the switches the function asks for. A target the drag just left can't
win again until the pointer has moved 10 px, so boundaries don't flicker. Between the
targets nested in a parent (the gaps of a column of cards), the last target stays.

</note>

## When a press becomes a drag

A press doesn't drag at once. `activation` sets, per pointer kind (`mouse`, `touch`,
`pen`), what it waits for: a `distance` in px, a `delay` in ms (with a `tolerance` past
which the press gives up, so the page can scroll), or whichever of the two comes first.

```vue
<DnDProvider :activation="{ mouse: { distance: 8 }, touch: { delay: 300, tolerance: 8 } }">
```

<table>
<thead>
  <tr>
    <th>
      Pointer
    </th>
    
    <th>
      Default
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        mouse
      </code>
      
      , <code>
        pen
      </code>
    </td>
    
    <td>
      <code>
        { distance: 4 }
      </code>
      
      : a click stays a click. A mouse press on a <code>
        handle
      </code>
      
       starts at once, and is still a click if it doesn't move.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        touch
      </code>
    </td>
    
    <td>
      <code>
        { delay: 200, tolerance: 5 }
      </code>
      
      : a long press, so lists keep scrolling under a finger.
    </td>
  </tr>
</tbody>
</table>

A kind you leave out keeps its default. A draggable's own `activation` wins over a
[drag area's](https://zizigy.github.io/docs/guides/constraints), which wins over the provider's. While a press
waits, `useDnD().status` is `'activating'` and `activation.progress` runs from `0` to `1`;
Escape or `useDnD().cancel()` gives it up. Try the constraints live, and draw a long-press
ring from the progress, in [sensors](https://zizigy.github.io/docs/guides/sensors#activation-constraints).

## Auto-scroll

Drag a channel toward the top or the bottom of the list. The green bands are the edge
zones: the deeper into one, the faster the list scrolls.

<example height="37.5rem" hint="Drag a channel into the green bands" name="auto-scroll-edges">



</example>

Any element with `overflow: auto` or `scroll` scrolls by itself, and so does the window. The
provider scrolls the container under the pointer first, then its ancestors, then the
window.

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Default
    </th>
    
    <th>
      What it sets
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        threshold
      </code>
    </td>
    
    <td>
      <code>
        0.2
      </code>
    </td>
    
    <td>
      The edge zone, as a fraction of the container's size, between 24 and 96 px.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        acceleration
      </code>
    </td>
    
    <td>
      <code>
        10
      </code>
    </td>
    
    <td>
      The speed at the very edge, in px per frame. It grows with the square of the depth into the zone, so the start is slow and precise.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        maxSpeed
      </code>
    </td>
    
    <td>
      <code>
        25
      </code>
    </td>
    
    <td>
      The top speed. Past the edge (the pointer outside the container), the speed keeps growing up to it.
    </td>
  </tr>
</tbody>
</table>

`:auto-scroll="false"` turns it off. A direction scrolls only once the pointer has moved
that way, so an item picked up near an edge doesn't scroll by itself. Lists, trees and
[drag areas](https://zizigy.github.io/docs/guides/constraints) take an `autoScroll` of their own for their
container:

```ts
makeSortableList(list, { items: channels, autoScroll: { maxSpeed: 10 } });
```

Keyboard drags never auto-scroll: they scroll the item into view instead. `isAutoScrolling`
(from `useDnD()`, or a drag area) is `true` while something scrolls.

## Haptics and the copy key

A touch drag vibrates briefly when it starts. `:haptics="false"` turns that off; an object
sets each vibration:

```vue
<DnDProvider :haptics="{ start: true, enter: 10, drop: 10, refuse: [20, 40, 20] }">
```

<table>
<thead>
  <tr>
    <th>
      Key
    </th>
    
    <th>
      Vibrates when
    </th>
    
    <th>
      Default
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        start
      </code>
    </td>
    
    <td>
      The long press turns into a drag.
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (10 ms)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        enter
      </code>
    </td>
    
    <td>
      The drag enters a target that accepts it.
    </td>
    
    <td>
      off
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop
      </code>
    </td>
    
    <td>
      The drop goes through.
    </td>
    
    <td>
      off
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        refuse
      </code>
    </td>
    
    <td>
      The drop is refused and the items fly back.
    </td>
    
    <td>
      off
    </td>
  </tr>
</tbody>
</table>

Each takes `true` (the default pattern), a length in ms, an on/off pattern, or `false`.
Only drags started by touch vibrate, and iOS Safari can't vibrate at all.

`copyModifier` is the key that, held during a drag between lists, turns the move into a
copy: `'Alt'` by default, any `KeyboardEvent.key`, or `null` for none. The list the items
come from needs a `clone` function; see [lists that share items](https://zizigy.github.io/docs/guides/shared-lists).

## Several providers

Most apps need exactly one. Put the wishlist under its own provider, then try to move a book
across: it can't leave its provider, and the outer monitor stops hearing the wishlist.

<example height="33.5rem" hint="Move a book across, then give the wishlist its own provider" name="provider-nested">



</example>

```vue
<DnDProvider>
  <Shelf v-model="reading" />
  <DnDProvider>
    <Shelf v-model="wishlist" />
    <EventLog />            <!-- hears the inner provider's drags only -->
  </DnDProvider>
</DnDProvider>
```

- Providers are independent: a drag never crosses from one to another.
- Nested providers are allowed. The **closest owner wins**: an item belongs to the nearest
provider above it, and the outer provider ignores it.
- Each provider has its own selection, overlay, live region and monitors.

A second provider makes sense only for a part of the page that needs its own provider-wide
settings (collision, keyboard keys, announcements) and whose items never leave it. If
items can't move between two parts of your page, check that they don't sit under two
providers.

<tip>

Rules for one part of the page (a board that snaps, a feed with a longer touch press, a
panel where nothing drags) don't need a provider of their own:

```ts
makeDragArea(board, { modifiers: [snapToGrid(20)], activation: { touch: { delay: 400 } } });
```

Its items stay in the app's provider and can still move anywhere. See
[constraints](https://zizigy.github.io/docs/guides/constraints).

</tip>

An app mounted elsewhere, inside a shadow root or as a separate Vue app, can join an
existing provider: pass `useDnDContext()` to `provideDnDContext(app, context)` before
mounting it. Hit-testing and the overlay work across shadow roots.

## SSR and Nuxt

The provider is SSR-safe. Lists and items render on the server like any other markup. The
overlay and the live region are teleported and mount on the client only, so they never
cause a hydration mismatch. Default ids come from Vue's `useId()` and match between server
and client.

In Nuxt, the module registers `DnDProvider` globally and auto-imports the composables: see
[installation](https://zizigy.github.io/docs/getting-started/installation#nuxt).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
