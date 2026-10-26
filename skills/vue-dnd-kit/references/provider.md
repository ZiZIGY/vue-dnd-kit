# DnDProvider, useDnD, monitors

## DnDProvider

Usually one provider wraps the whole app (in a layout or `App.vue`). Give parts of the
page their own rules with `makeDragArea` (modifiers, axis, bounds, auto-scroll,
activation, disabled). Nest a second provider only when a part needs its own
provider-wide settings (collision, keyboard keys, announcements) and its items never
leave it: nested providers are independent, a drag never crosses them, and the closest
provider owns an element.

```vue
<DnDProvider
  :collision="pointerFirst"
  :modifiers="[restrictToWindowEdges]"
  :animation="{ duration: 200, easing: 'ease' }"
  :drop-animation="true"
  :animate="false"
  :auto-scroll="{ threshold: 0.2, maxSpeed: 20 }"
  :activation="{ touch: { delay: 300, tolerance: 8 } }"
  :keyboard="{ step: 25, keys: { start: ['Space', 'Enter'], drop: ['Space', 'Enter'], cancel: ['Escape'] } }"
  :haptics="{ start: true, drop: 10, refuse: [20, 40, 20] }"
  copy-modifier="Alt"
  overlay-to="body"
  overlay-fit="slot"
  :announcements="{ onDragStart: ({ active }) => `Picked up ${active.id}` }"
  screen-reader-instructions="Press Space to pick up…"
  :default-styles="true"
  @drag-start="onStart"
  @drag-move="onMove"
  @drag-over="onOver"
  @drag-end="onEnd"
  @drag-cancel="onCancel"
>
  <App />
  <template #overlay="{ active, items, over, accepted, status, mode }">
    <!-- optional: custom overlay for every drag without its own `overlay` component -->
  </template>
</DnDProvider>
```

| Prop | Default | Meaning |
| --- | --- | --- |
| `collision` | `pointerFirst` | How the target under the drag is found: `pointerFirst`, `pointerWithin`, `rectIntersection`, `closestCenter`, `closestCorners`, or your own `(args) => Key[]` (best first). |
| `modifiers` | `[]` | Global movement modifiers (see [draggable-droppable](draggable-droppable.md#modifiers)). |
| `animation` | `true` | FLIP of sortable items while sorting: `true`, `false`, `{ duration, easing }` or a function. |
| `dropAnimation` | `true` | How the overlay lands. Same shapes. |
| `animate` | `false` | Default for lists and trees: animate data changes that no drag made. See [animations](animations.md). |
| `autoScroll` | `true` | Scroll containers and the window near their edges. `{ threshold, maxSpeed, acceleration }`. |
| `activation` | mouse `{ distance: 4 }` (immediate on a handle), pen `{ distance: 4 }`, touch `{ delay: 200, tolerance: 5 }` | Per pointer kind: `{ mouse, touch, pen }`. |
| `keyboard` | Space/Enter start and drop, Escape cancels, `step: 25` | `false` turns keyboard drags off. Escape still cancels any drag. |
| `sensors` | `[pointerSensor, keyboardSensor]` | What turns input into drags. See [sensors-actions](sensors-actions.md). |
| `haptics` | short vibration on touch drag start | `false` turns it off. `{ start, enter, drop, refuse }` take `true`, ms, or a pattern. Only touch drags vibrate, and iOS Safari can't vibrate. |
| `copyModifier` | `'Alt'` | Held during a drag between lists, it turns the move into a copy (lists need `clone`). `null` disables it. |
| `overlayTo` | `'body'` | Teleport target of the overlay. |
| `overlayFit` | `'slot'` | `'slot'`: the overlay takes the size of the slot it will land in. `'source'`: it keeps the dragged element's size. |
| `announcements` | built-in texts | `Partial<Announcements>` to override events (`undefined` = default, `''` = silent). `false` silences the live region. |
| `screenReaderInstructions` | built-in | Text linked to every draggable through `aria-describedby`. |
| `defaultStyles` | `true` | Injects zero-specificity CSS (placeholder opacity, no text selection, grabbing cursor). |

Events: `dragStart`, `dragMove`, `dragOver`, `dragEnd` (`DnDEndEvent`: `dropped`, `accepted`),
and `dragCancel`. `dragEnd` fires after sortable lists have run `onDrop` and written the
drop.

The overlay and the live region are teleported and render on the client only, so the
provider is SSR-safe (Nuxt). Default ids come from `useId()` and are stable between server
and client.

## useDnD(): reactive drag state

```ts
const { status, active, over, pointer, activation, isAutoScrolling, selection, cancel } = useDnD();
// status: 'idle' | 'activating' | 'dragging' | 'dropping' | 'selecting'
// active: { id, ids, items, data, type, element, rect, sensor } | null
// over:   { id, data, element, rect, accepted } | null
// activation.progress: 0..1 while a long press charges (draw a progress ring with it)
// selection: { ids, has, add, delete, toggle, set, clear }
```

When the drop is decided, `active`, `over` and `pointer` become `null`, even while the
overlay still animates (`status` stays `'dropping'`). Derived UI never mixes the old drag
with the new data. While an async `onBeforeDrop` is pending, the state stays as it was at
release.

## useDnDMonitor(): events from anywhere under the provider

```ts
useDnDMonitor({
  onDragStart(e) {},
  onDragMove(e) {},
  onDragOver(e) {},                      // the target changed
  onBeforeDrop(e) { return 'accept'; },  // 'reject' / false; Key[]: a subset; 'continue': keep dragging; may be async
  onDragEnd(e) {},                       // after the write: e.dropped, e.accepted, e.position
  onDragCancel(e) {},
  onDragResume(e) {},                    // onBeforeDrop answered 'continue': the drag goes on
  getKeyboardCoordinates(event, { active, pointer, direction }) {}, // custom arrow-key moves
});
```

It is removed when the calling component unmounts. `DnDEvent` has `active`, `over`,
`pointer` (viewport, after modifiers), `delta` (offset from the start), and `source`
(when the items come from a sortable list: `{ list, remove() }`).

## Sharing a provider with another Vue app

An app mounted elsewhere (a shadow root, a portal app) can join a provider:

```ts
const context = useDnDContext();              // in a component under the provider
const app = createApp(Widget);
provideDnDContext(app, context);
app.mount(shadowRoot.querySelector('#mount')!);
```

Hit-testing and the overlay work across shadow roots.
