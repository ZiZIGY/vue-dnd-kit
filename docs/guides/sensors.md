---
title: "Sensors and programmatic drags"
description: "How input becomes a drag — the pointer and keyboard sensors, activation constraints, canDrag, sensors of your own, and drags you script with @vue-dnd-kit/actions."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/guides/sensors"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

A sensor turns input into drags. It only tells the provider "drag this item from here", then where
the input moved, and whether it dropped or cancelled. The provider does the rest, the same way for
every sensor: one drag at a time, disabled items refused, activation constraints, sorting,
auto-scroll, announcements, <kbd value="Escape">



</kbd>

 and the whole drop.

## The built-in sensors

<table>
<thead>
  <tr>
    <th>
      Sensor
    </th>
    
    <th>
      Input
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointerSensor
      </code>
    </td>
    
    <td>
      Mouse, touch and pen, through Pointer Events. It captures the pointer, keeps the page from selecting text or scrolling under a touch drag, and swallows the click that follows a drag.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboardSensor
      </code>
    </td>
    
    <td>
      <kbd value="Space">
        
      </kbd>
      
       and <kbd value="Enter">
        
      </kbd>
      
       pick up and drop, arrows move, <kbd value="Escape">
        
      </kbd>
      
       cancels — any drag, pointer drags too.
    </td>
  </tr>
</tbody>
</table>

Both run by default. The provider's `sensors` replaces the list:

```vue
<DnDProvider :sensors="[pointerSensor, keyboardSensor, joystick.sensor]">
```

To turn keyboard drags off, prefer `:keyboard="false"` to leaving `keyboardSensor` out: the
keyboard sensor is also what cancels any drag with <kbd value="Escape">



</kbd>

. Its keys are rebound with
`keyboard.keys` (see [Accessibility](https://zizigy.github.io/docs/guides/accessibility#the-keyboard)).

## Activation constraints

A press doesn't drag at once: it waits for its activation constraint, so a click stays a click and a
swipe can still scroll the page. Switch the rules of this list and press a row:

<example height="34.5rem" hint="Hold a row until the ring closes, or switch the rule" name="activation-modes">



</example>

A constraint has three fields:

<table>
<thead>
  <tr>
    <th>
      Field
    </th>
    
    <th>
      The drag starts…
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        distance
      </code>
    </td>
    
    <td>
      Once the pointer has moved that many px.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        delay
      </code>
    </td>
    
    <td>
      Once the press has lasted that many ms. With <code>
        distance
      </code>
      
       too, whichever comes first.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        tolerance
      </code>
    </td>
    
    <td>
      With <code>
        delay
      </code>
      
      : how far the pointer may move meanwhile. Past it the press gives up, so the page can scroll. Default 5 px when there is no <code>
        distance
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Without your own, each pointer kind has its default:

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
      Mouse
    </td>
    
    <td>
      After moving 4 px. At once when pressed on a <code>
        handle
      </code>
      
      , unless a mouse constraint is set.
    </td>
  </tr>
  
  <tr>
    <td>
      Pen
    </td>
    
    <td>
      After moving 4 px.
    </td>
  </tr>
  
  <tr>
    <td>
      Touch
    </td>
    
    <td>
      After a 200 ms press. Moving more than 5 px first gives up, so the page scrolls instead.
    </td>
  </tr>
</tbody>
</table>

### Where to set them

Per pointer kind — `mouse`, `touch`, `pen` — on the provider, a drag area or the item. For each
kind, the item's own wins, then its area's, then the provider's:

```vue
<DnDProvider :activation="{ mouse: { distance: 8 }, touch: { delay: 250, tolerance: 5 } }">
```

```ts
// Inbox.vue: the rules of every drag that starts inside the panel.
makeDragArea(panel, { activation: () => MODES[mode.value].activation });

// One item: a longer press by touch, the area's rule for the mouse.
makeSortableItem(el, { item: () => props.task, activation: { touch: { delay: 400, tolerance: 8 } } });
```

The options are read when a press starts, so a getter or a ref switches them live, as the demo does.
Keyboard drags start at once. [A sensor of your own](#a-sensor-of-your-own) asks for its own
constraint, or for the one configured for a pointer kind.

### A long-press ring

While a press waits, `useDnD().status` is `'activating'` and `activation.progress` goes from 0 to
1 — by time with `delay`, by the distance moved with `distance`. The demo draws a ring where the
press started:

```vue [Inbox.vue]
<script setup lang="ts">
const { status, activation } = useDnD();
</script>

<template>
  <svg v-if="status === 'activating'" class="ring" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="17" pathLength="1" :stroke-dasharray="`${activation.progress.value} 1`" />
  </svg>
</template>
```

Give the ring `pointer-events: none`: it sits under the pointer, and the drag hit-tests what is
there. A press that gives up — moved past its `tolerance`, or let go too early — takes `status`
straight back to `'idle'`.

### Handles start at once

With a `handle`, only the handle starts a drag, and a mouse press on it drags at once: grabbing a
grip leaves nothing to tell apart. A press released where it started is still a click, so the
grip can open a menu on `click` (the pointer is captured only once it moves). A touch still waits for its long press, unless the handle can't
scroll the page. Give it `touch-action: none` and the item a short distance:

```ts [Message.vue]
makeSortableItem(el, {
  item: () => props.chat,
  handle: '.grip',
  // The grip has `touch-action: none`: a touch on it can't scroll, so it drags after 4 px.
  activation: { touch: { distance: 4 } },
});
```

A mouse constraint set on the item, its area or the provider applies to handles too. Make the
grip a `<button>`, as the demo does: it takes the focus, so a keyboard drag starts from it
too.

## Only some presses

`canDrag` is one more gate on draggables and sortable items. It gets the input event and answers
`true` or `false` for this press. Here pointer drags need <kbd value="Shift">



</kbd>

; the keyboard drags
as usual:

<example height="28rem" hint="Drag a row with and without Shift; tick a box, pick an owner" name="can-drag">



</example>

```ts [Task.vue]
makeSortableItem(el, {
  item: () => props.task,
  // Never: the row is locked (and says so to screen readers with aria-disabled).
  disabled: () => !!props.task.locked,
  // Per press: pointer drags only with Shift held; the keyboard as usual.
  canDrag: (event) => {
    if (!props.shiftOnly || event instanceof KeyboardEvent || event.shiftKey) return true;
    emit('refused');
    return false;
  },
});
```

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Asked
    </th>
    
    <th>
      Use it for
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      Live, and set as <code>
        aria-disabled
      </code>
    </td>
    
    <td>
      Items that can't move at all: locked, read-only.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        canDrag
      </code>
    </td>
    
    <td>
      Once per press, with its event
    </td>
    
    <td>
      Rules about the input: a key held, a button, a pointer type.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        handle
      </code>
    </td>
    
    <td>
      Where the press lands
    </td>
    
    <td>
      Items that start a drag from one part only.
    </td>
  </tr>
</tbody>
</table>

`canDrag` is asked before the activation constraint, with the `pointerdown` or `keydown`. A pointer
type is one more rule it can make:

```ts
// Mouse and pen drag; a touch on the row always scrolls the page.
canDrag: (event) => !(event instanceof PointerEvent && event.pointerType === 'touch'),
```

Interactive children — buttons, inputs, checkboxes, editable fields — never start a pointer drag,
so they keep working inside a draggable, as the checkbox and the owner menu in the demo do. With a
`handle`, only the handle starts one.

## A sensor of your own

A gamepad, an on-screen joystick, voice commands: anything that can point at an item and move can
drive a drag. This gamepad is a sensor. Hold <kbd value="A">



</kbd>

 over a hero to pick it up, steer with
the pad, <kbd value="A">



</kbd>

 again drops, <kbd value="B">



</kbd>

 cancels. The mouse and the keyboard still work
next to it:

<example height="30rem" hint="Hold A over a hero, then hold an arrow: the hero moves through the list" name="joystick">



</example>

`defineSensor` gives the sensor its name and a `setup` that receives the provider's side, once per
provider:

```ts [joystick.ts]
const sensor = defineSensor({
  name: 'joystick',
  // Once per provider, in the browser. The cleanup runs when the provider unmounts.
  setup(ctx) {
    context = ctx;
    return () => {
      context = null;
      drag = null;
    };
  },
});
```

A press asks the provider for a drag with `activate()`. The target is checked like a real press:
it must be a draggable of this provider, not disabled, and not a button inside one:

```ts [joystick.ts]
/** A goes down: drops a running drag, or starts a hold over what is under the cursor. */
const press = () => {
  if (drag?.state === 'dragging') return void drag.drop();
  const at = point();
  const target = document.elementFromPoint(at.x, at.y);
  if (!target || !context) return;
  drag = context.activate({
    target, // checked like a real press: a draggable of this provider, not disabled
    point: at,
    type: 'pointer', // follows points: lists sort under it, containers auto-scroll
    activation: { delay: 300 }, // `useDnD().activation.progress` runs meanwhile
    onEnd: (ended) => {
      if (drag === ended) drag = null;
    },
  }); // null: nothing to drag there
};
```

Then the drag moves with the pad, and A or B end it:

```ts [joystick.ts]
const move = (dx: number, dy: number) => {
  cursor.value = { x: cursor.value.x + dx, y: cursor.value.y + dy }; // clamped in the demo
  drag?.move(point()); // pending: checks the tolerance; dragging: moves
};

const release = () => {
  if (drag?.state === 'pending') drag.cancel(); // A let go before the hold is over
};

const cancel = () => drag?.cancel();
```

Add the sensor to the provider's `sensors`, as the demo does, or run it for as long as a component
lives with `useSensor(joystick.sensor)`. Points are in viewport coordinates: the demo keeps its
cursor in the stage's coordinates, so it scrolls with the page, and converts it in `point()`.

### What the sensor gets

`setup(context)` receives the provider's side:

<table>
<thead>
  <tr>
    <th>
      Member
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
        props
      </code>
    </td>
    
    <td>
      The provider's props (<code>
        activation
      </code>
      
      , <code>
        keyboard
      </code>
      
      …). Read them when needed: they may change.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        status
      </code>
    </td>
    
    <td>
      The provider's drag status, whichever sensor runs the drag.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag
      </code>
    </td>
    
    <td>
      The provider's current drag, pending or running, whichever sensor started it. <code>
        null
      </code>
      
       when there is none.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activate(options)
      </code>
    </td>
    
    <td>
      Asks for a drag. Returns a <code>
        SensorDrag
      </code>
      
      , or <code>
        null
      </code>
      
       when no drag may start.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Cancels the provider's drag or pending press.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onWindow(setup)
      </code>
    </td>
    
    <td>
      Runs <code>
        setup(view)
      </code>
      
       in the page's window and in every <a href="/docs/guides/provider#other-windows-of-the-app">
        other window of the app
      </a>
      
       as it joins. Listen to input there; it is cleaned up when that window closes.
    </td>
  </tr>
</tbody>
</table>

`activate()` takes:

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
        target
      </code>
    </td>
    
    <td>
      Where the input landed: an element inside a draggable, or a draggable's id. An element is checked like a real press (handle, no interactive child); an id skips the checks.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        point
      </code>
    </td>
    
    <td>
      Where the drag starts, in viewport coordinates. Default: the center of the draggable.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        type
      </code>
    </td>
    
    <td>
      <code>
        'pointer'
      </code>
      
       (default): follows points, hit-tests targets, auto-scrolls. <code>
        'keyboard'
      </code>
      
      : moves by items, reveals targets, returns focus at the end.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      A constraint (<code>
        { delay: 300 }
      </code>
      
      ), or a pointer kind (<code>
        'touch'
      </code>
      
      ) to use the configured one. Default: none, the drag starts at once.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        event
      </code>
    </td>
    
    <td>
      The input event, handed to the item's <code>
        canDrag
      </code>
      
       (without one, <code>
        canDrag
      </code>
      
       isn't asked). A touch <code>
        pointerType
      </code>
      
       makes it a touch drag (haptics).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onStart(drag)
      </code>
    </td>
    
    <td>
      The drag started, after its activation.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onEnd(drag)
      </code>
    </td>
    
    <td>
      The drag is over: aborted, dropped or cancelled — by anyone.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onResume(drag)
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       answered <code>
        'continue'
      </code>
      
      : the drag goes on, and <code>
        move
      </code>
      
      , <code>
        drop
      </code>
      
       and <code>
        cancel
      </code>
      
       apply again.
    </td>
  </tr>
</tbody>
</table>

The `SensorDrag` it returns:

<table>
<thead>
  <tr>
    <th>
      Member
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
        id
      </code>
      
      , <code>
        type
      </code>
    </td>
    
    <td>
      The dragged item's id, and <code>
        'pointer'
      </code>
      
       or <code>
        'keyboard'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        state
      </code>
    </td>
    
    <td>
      <code>
        'pending'
      </code>
      
       (waiting for the activation), <code>
        'dragging'
      </code>
      
      , then <code>
        'ended'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        started
      </code>
    </td>
    
    <td>
      The drag started, even if it has ended since.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        move(point)
      </code>
    </td>
    
    <td>
      The input moved. While pending, checks the tolerance; while dragging, moves the drag.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        step(direction)
      </code>
    </td>
    
    <td>
      Keyboard drags: one arrow step, <code>
        'up' | 'down' | 'left' | 'right'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        place({ list, index })
      </code>
    </td>
    
    <td>
      Puts the item at a position of a sortable list, as keyboard moves do. Resolves <code>
        false
      </code>
      
       when no list takes it there.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop()
      </code>
    </td>
    
    <td>
      Drops. Resolves <code>
        true
      </code>
      
       when the drop went through, once it has landed.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Cancels: the item flies back, or a pending press is abandoned.
    </td>
  </tr>
</tbody>
</table>

Calls that no longer apply — a move after the end, a second `drop()` — are ignored. Full types:
[Sensors](https://zizigy.github.io/docs/api/sensors).

<tip>

To wrap a built-in sensor, run its `setup` with a context of your own. Make it with
`Object.create(context, { activate: { value: myActivate } })` rather than a spread, so the live
getters (`status`, `drag`, `props`) keep working.

</tip>

## Programmatic drags

`@vue-dnd-kit/actions` moves items from code: "Move up" buttons, menus, keyboard shortcuts, undo,
onboarding tours, tests. It is built on the public sensor API, and its drags are real ones:
announced and animated, through `onBeforeDrop`, `onDrop`, `e.result` and `preventDefault()`, under
the provider's rules (one drag at a time, disabled items, `accept` and `group.put`).

<example height="31.5rem" hint="Hover a track for its arrows, shuffle, or play the scripted drag" name="actions">



</example>

```bash
npm i @vue-dnd-kit/actions
```

### moveItem: one call, one move

```ts
import { useDnDActions } from '@vue-dnd-kit/actions';

const { moveItem } = useDnDActions(); // in setup, under a provider

await moveItem('card-1', { index: 0 }); // to the top of its list
await moveItem('card-1', { list: 'done' }); // to the end of another list
await moveItem('card-1', { list: 'done', index: 2 }); // to a place in another list
```

- `list` is a sortable list's `id`. Without it, the item stays in its list.
- `index` is where the item ends up, counted without the item itself, and clamped to the list.
Without it, the item goes to the end.
- It resolves `true` when the drop went through, `false` when the item isn't rendered or is
disabled, no list takes it there, or the drop was refused.
- Calls queue: each waits until the provider is idle, so a quick second click isn't lost. The
shuffle in the demo is five calls in a row.
- It runs as a keyboard drag, so it is announced and the focus stays on the item.
- Lists only: tree positions also have a depth.

See [Accessibility](https://zizigy.github.io/docs/guides/accessibility#moving-without-dragging) for a row with move buttons.

### startDrag: a scripted drag

```ts
const { startDrag } = useDnDActions();

const drag = startDrag('card-1'); // null when it can't start now
if (drag) {
  await drag.moveTo(document.querySelector('#trash')!); // onto an element
  await drag.moveTo({ x: 400, y: 120 }); // to a point, in viewport coordinates
  await drag.moveTo({ list: 'done', index: 2 }); // to a list position
  await drag.drop(); // true when the drop went through; or drag.cancel()
}
```

`moveTo` resolves once the move has rendered, `drop` once the drop has landed. The demo's
"Play a scripted drag" glides the last track up in small `moveTo` steps, then drops it at the top.
`startDrag(id, { from: { x, y } })` picks the item up at a point instead of its center.

### Hand a drag to the keyboard

`startDrag(id, { type: 'keyboard' })` lifts the item as a keyboard drag. Your code can move it with
`await drag.step('down')`, or leave it to the user: the keyboard sensor drives every keyboard drag,
whoever started it. That makes a "Move" menu item:

<example height="26rem" hint="Open a row's menu: arrow keys, or send it to the other week" name="move-menu">



</example>

```ts [Row.vue]
const { moveItem, startDrag } = useDnDActions();

// One move in one call: picked up, put there and dropped, announced and animated.
const toOther = () => moveItem(props.task.id, { list: props.other.id, index: 0 });
// A keyboard drag, handed to the arrow keys: Space or Enter drops, Escape cancels.
const withKeys = () => {
  el.value?.focus();
  startDrag(props.task.id, { type: 'keyboard' });
};
```

The arrows move the row by slots, <kbd value="ArrowLeft">



</kbd>

 and <kbd value="ArrowRight">



</kbd>

 to the
other week (the lists share a `group`). When the drag ends, the focus goes back to the row. The
key hints under the board light up while `useDnD().active.value?.sensor` is `'keyboard'`.

### Outside components

`useDnDActions()` runs one sensor, named `actions`, in the provider above. To drive a provider from
a store or a test harness, or under a name of your own, create the actions in a sensor you run
yourself:

```ts
import { defineSensor } from '@vue-dnd-kit/core';
import { createDnDActions, type DnDActions } from '@vue-dnd-kit/actions';

export let tour: DnDActions | undefined;
export const tourSensor = defineSensor({
  name: 'tour',
  setup: (context) => void (tour = createDnDActions(context)),
});
```

```vue
<DnDProvider :sensors="[pointerSensor, keyboardSensor, tourSensor]">
```

Then `await tour?.moveItem('card-1', { list: 'done' })` from anywhere. During server rendering
nothing drags: `moveItem` resolves `false` and `startDrag` returns `null`.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
