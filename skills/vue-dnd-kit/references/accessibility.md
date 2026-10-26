# Accessibility: keyboard, screen readers, alternatives to dragging

Everything below is on by default. Usually the only work left is giving items readable
ids or texts, and offering buttons that move items (WCAG 2.5.7 asks for a way to move
items without dragging).

## Attributes

Every draggable and sortable item gets, **unless you set them yourself**:
- `tabindex="0"` (when the element isn't focusable already);
- `role="button"` (not on a `<button>`);
- `aria-roledescription`: `"draggable"`, or `"sortable"` for sortable items;
- `aria-describedby`: the provider's instructions, added as one more id next to yours (a tooltip's id survives);
- `aria-disabled` and, while dragging, `aria-pressed="true"`.

With a `handle`, the attributes go on the handle, which is also where keyboard drags
start. `attributes: false` turns all of this off (live: what the library set is removed).

## Keyboard

| Key | Action |
| --- | --- |
| Space / Enter | Pick up the focused item; drop it. |
| Arrows | Move: by slots in lists, by rows and depth in trees, by `keyboard.step` px (Shift: faster) in free drags, or between accepting targets with `makeDraggable({ keyboard: 'droppables' })`. Arrows toward another list of the group move the item there. |
| Escape | Cancel any drag (pointer drags too). |

Rebind keys with `<DnDProvider :keyboard="{ keys: { start: ['KeyD'], drop: ['Enter'], cancel: ['Escape'] } }">`
(matched against `event.code` or `event.key`). `:keyboard="false"` turns keyboard drags off,
but Escape still cancels. Keyboard drags reveal targets instead of auto-scrolling, and focus
returns to the item after the drop, even when its row was re-rendered elsewhere.

## Announcements

A live region in the provider speaks every pickup, move, drop and cancel. Sortable lists
announce positions ("position 3 of 5 in list todo"). Moves are spoken once the drag has
rested for 500 ms. The texts use ids, so give items meaningful ids or override the texts:

```ts
const announcements: Partial<Announcements> = {
  onDragStart: ({ active }) => `Picked up ${titleOf(active.id)}.`,
  onDragOver: ({ active, over }) => (over ? `${titleOf(active.id)} is over ${over.id}.` : undefined), // undefined: default text
  onDragEnd: ({ active, over, dropped }) => (dropped ? `Dropped ${titleOf(active.id)}.` : undefined),
  onDragCancel: () => '',                                                                         // '': say nothing
};
```

```vue
<DnDProvider :announcements="announcements" screen-reader-instructions="Press D to pick up a card…">
```

`:announcements="false"` silences the provider (e.g. when you announce through your own region).

## Buttons that move items: @vue-dnd-kit/actions

```ts
import { useDnDActions } from '@vue-dnd-kit/actions';

const { moveItem } = useDnDActions();   // in a component under the provider
await moveItem(task.id, { index: index - 1 });    // up
await moveItem(task.id, { index: 0 });            // to the top
await moveItem(task.id, { list: 'done' });        // to the end of another list
```

`moveItem` runs a real keyboard drag: it is announced, goes through `onBeforeDrop` and
`onDrop` (and `e.result` / `preventDefault()` for controlled lists), animates, and keeps
focus on the item. It resolves `true` when the drop went through. Calls queue one after
another. `index` counts positions without the item itself and is clamped to the list.

## Reduced motion

The library's own animations stop with `prefers-reduced-motion: reduce`. Custom animation
functions get `reducedMotion: true` (see [animations](animations.md)).

## Touch

Touch drags start after a 200 ms long press (moving more than 5 px first scrolls the
page instead). The default vibration on start can be turned off with `:haptics="false"`.
For a long-press ring, read `useDnD().activation.progress` (0 to 1) while `status === 'activating'`.
