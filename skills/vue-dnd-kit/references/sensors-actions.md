# Sensors and programmatic drags

## Sensors

A sensor turns input into drags. It only tells the provider "drag this item from here",
then where the input moved and whether it dropped or cancelled. The provider does the
rest, the same way for every sensor: one drag at a time, disabled items and buttons
inside items refused, activation constraints with progress, sorting, auto-scroll,
announcements, Escape and the drop pipeline.

Default: `[pointerSensor, keyboardSensor]`. Change the list on the provider:

```vue
<!-- Add your own next to the defaults -->
<DnDProvider :sensors="[pointerSensor, keyboardSensor, joystick.sensor]">
```

Or run one for as long as a component lives: `useSensor(joystick.sensor)`. To turn off
keyboard drags, prefer `:keyboard="false"` over dropping `keyboardSensor`. The keyboard
sensor is also what cancels any drag with Escape.

### A custom sensor (on-screen joystick, gamepad, voice)

```ts
import { shallowRef } from 'vue';
import { defineSensor, type Coordinates, type SensorContext, type SensorDrag } from '@vue-dnd-kit/core';

export function createJoystick() {
  const cursor = shallowRef<Coordinates>({ x: 0, y: 0 });
  let context: SensorContext | null = null;
  let drag: SensorDrag | null = null;

  const sensor = defineSensor({
    name: 'joystick',                      // shows in the devtools timeline
    // Runs once per provider, in the browser, inside an effect scope: listeners made with
    // VueUse here are removed with it. Return a cleanup if you need one.
    setup(ctx) {
      context = ctx;
      return () => { context = null; drag = null; };
    },
  });

  /** "A" pressed: drop a running drag, or pick up what is under the cursor after a hold. */
  const press = () => {
    if (drag?.state === 'dragging') return void drag.drop();
    const target = document.elementFromPoint(cursor.value.x, cursor.value.y);
    if (!target || !context) return;
    drag = context.activate({
      target,                              // an element inside a draggable, or a draggable's id
      point: cursor.value,                 // where the drag starts (viewport)
      activation: { delay: 300 },          // or 'mouse' | 'touch' | 'pen' to use the configured one
      type: 'pointer',                     // 'pointer' follows points; 'keyboard' moves by items (step/place)
      onEnd: (ended) => { if (drag === ended) drag = null; },
    });                                    // null: refused (busy, disabled, a button inside the item…)
  };
  const move = (dx: number, dy: number) => {
    cursor.value = { x: cursor.value.x + dx, y: cursor.value.y + dy };
    drag?.move(cursor.value);              // pending: checks the tolerance; dragging: moves
  };
  const cancel = () => drag?.cancel();

  return { sensor, cursor, press, move, cancel };
}
```

`context`: `props` (the provider's), `status`, `drag` (the provider's current drag,
whichever sensor started it), `activate(options)` (returns the drag or `null`), `cancel()`.

`SensorDrag`: `id`, `type`, `state` (`'pending' | 'dragging' | 'ended'`), `started`,
`move(point)`, `step('up' | 'down' | 'left' | 'right')` (keyboard drags), `place({ list, index })`,
`drop(): Promise<boolean>`, `cancel()`. Calls that no longer apply are ignored.

To wrap a built-in sensor, run its `setup` with your own context. Use
`Object.create(context, { activate: { value: … } })` rather than a spread, so the live
getters keep working.

## Programmatic drags: @vue-dnd-kit/actions

```bash
npm i @vue-dnd-kit/actions
```

```ts
import { useDnDActions } from '@vue-dnd-kit/actions';
const { moveItem, startDrag } = useDnDActions();   // in setup, under a provider

// One-shot moves (menus, "Move to…" buttons, undo/redo, tests)
await moveItem('card-1', { list: 'done' });         // to the end of another list
await moveItem('card-1', { index: 0 });             // to the top of its list

// A scripted drag (tours, demos, e2e). Every step resolves after it rendered.
const drag = startDrag('card-1', { type: 'pointer' });   // null: can't start now
await drag?.moveTo(document.querySelector('#done')!);    // an element, a point, or { list, index }
await drag?.drop();                                       // true when the drop went through
```

These are real drags. Announcements, animations, `onBeforeDrop`, `onDrop`, `e.result`
and `preventDefault()` all apply, and so do the provider's rules (one drag at a time,
disabled items). `moveItem` calls queue and wait for the provider to be idle.

Outside components (a store, a test harness), create the actions from a sensor of your own:

```ts
import { createDnDActions, type DnDActions } from '@vue-dnd-kit/actions';
let tour: DnDActions | undefined;
const tourSensor = defineSensor({ name: 'tour', setup: (context) => void (tour = createDnDActions(context)) });
// <DnDProvider :sensors="[pointerSensor, keyboardSensor, tourSensor]">
await tour?.moveItem('card-1', { list: 'done' });
```
