# @vue-dnd-kit/actions

Programmatic drags for [Vue DnD Kit](https://github.com/zizigy/vue-dnd-kit) v3: move items from buttons, menus,
keyboard shortcuts and tests.

A programmatic drag is a real one. The item is picked up, moved and dropped with the normal animations and
screen reader announcements, and the drop goes through the normal pipeline: `onBeforeDrop`, `onDrop`,
`event.result`, `event.preventDefault()`. The provider's rules apply too: one drag at a time, disabled items,
`group.put` and `accept` rules. The package is built on the core's public sensor API (`useSensor`) and uses
nothing internal.

```bash
npm install @vue-dnd-kit/actions
```

Peer dependencies: `vue ^3.5`, `@vue-dnd-kit/core ^3`.

## Move buttons

`moveItem(id, { list, index })` moves an item of a sortable list to a position of its own list or of another
one. It gives an accessible alternative to dragging ("Move up", "Move to Done" in a row's menu).

```vue
<script setup lang="ts">
import { useDnDActions } from '@vue-dnd-kit/actions';

const props = defineProps<{ task: Task; index: number }>();
const { moveItem } = useDnDActions();
</script>

<template>
  <button @click="moveItem(task.id, { index: index - 1 })">Up</button>
  <button @click="moveItem(task.id, { index: index + 1 })">Down</button>
  <button @click="moveItem(task.id, { index: 0 })">To the top</button>
  <button @click="moveItem(task.id, { list: 'done' })">Move to Done</button>
</template>
```

- `list` is the id of a sortable list (`makeSortableList({ id })`). Without it, the item stays in its list.
- `index` is where the item ends up, counted without the item itself, and clamped to the list. Without it,
  the item goes to the end.
- The promise resolves `true` when the drop went through. It resolves `false` when the item isn't rendered or
  is disabled, when no list takes it there, or when the drop was refused.
- Calls run one after another, and each one waits until the provider is idle. A click made while the previous
  move is still landing is not lost.
- The move runs as a keyboard drag: the live region announces it, and the focus stays on the item when its row
  is re-rendered in another list.
- Trees are not supported: their positions also have a depth.

## Scripted drags

`startDrag(id)` starts a drag and hands it to you. Use it for demos, onboarding tours and tests.

```ts
const { startDrag } = useDnDActions();

const drag = startDrag('card-1'); // null when it can't start
if (drag) {
  await drag.moveTo(trashElement); // onto an element
  await drag.moveTo({ x: 400, y: 120 }); // to a point, in viewport coordinates
  await drag.moveTo({ list: 'done', index: 2 }); // to a list position
  const dropped = await drag.drop(); // or drag.cancel()
}
```

- `type: 'pointer'` (the default) moves like a mouse. Targets are hit-tested where the drag is, and lists sort
  under it.
- `type: 'keyboard'` moves by items: `await drag.step('down')`. The keyboard sensor can take over, so the user
  continues with the arrows, Space and Escape. This makes a "Move" menu item that picks the item up for the
  keyboard.
- `moveTo` resolves once the move has rendered. `drop` resolves once the drop has landed.

## A sensor of your own

`useDnDActions()` drives drags through one sensor per provider, named `actions`. `createDnDActions(context)` gives
the same actions over a sensor you run yourself. Its drags carry that sensor's name (the devtools timeline shows
it), and the actions work from outside the provider's components: a store, a test harness. The inspector of
`@vue-dnd-kit/devtools` drives its drags this way.

```ts
import { defineSensor } from '@vue-dnd-kit/core';
import { createDnDActions, type DnDActions } from '@vue-dnd-kit/actions';

export let tour: DnDActions | undefined;

export const tourSensor = defineSensor({
  name: 'tour',
  setup: (context) => void (tour = createDnDActions(context)),
});
```

Run the sensor in the provider: `<DnDProvider :sensors="[pointerSensor, keyboardSensor, tourSensor]">`, or
`useSensor(tourSensor)` in a component under it. Each actions object queues its own `moveItem` calls; a move waits
for any drag of the provider to end first, whichever sensor started it.

## API

```ts
function useDnDActions(): DnDActions;
function createDnDActions(context: SensorContext): DnDActions;

interface DnDActions {
  moveItem(id: Key, to: SortablePosition): Promise<boolean>;
  startDrag(id: Key, options?: StartDragOptions): ActionDrag | null;
}

interface SortablePosition {
  list?: Key;
  index?: number;
}

interface StartDragOptions {
  type?: 'pointer' | 'keyboard';
  from?: Coordinates;
}

interface ActionDrag {
  readonly id: Key;
  readonly type: 'pointer' | 'keyboard';
  readonly state: 'pending' | 'dragging' | 'ended';
  moveTo(destination: Coordinates | Element | SortablePosition): Promise<boolean>;
  step(direction: 'up' | 'down' | 'left' | 'right'): Promise<void>;
  drop(): Promise<boolean>;
  cancel(): void;
}
```

Call `useDnDActions()` in the `setup` of a component under a `<DnDProvider>`. It runs in the browser only:
during server rendering, `moveItem` resolves `false` and `startDrag` returns `null`.

## License

MIT
