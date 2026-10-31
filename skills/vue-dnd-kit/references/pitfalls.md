# Pitfalls and fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| `[vue-dnd-kit] No <DnDProvider> found above this component.` | The composable runs in the component whose **template** renders `<DnDProvider>` (inject only sees ancestors). | Move the composable into a child component, or wrap higher up (layout, `App.vue`). |
| Rows of one list behave as if they belong to another | Two `makeSortableList` / `makeSortableTree` calls in one component: the items inject the last one. Development builds warn. | One list or tree per component (e.g. `<Column>` per column). |
| Nothing moves while dragging; the list jumps only on drop | The template renders your source array. | Render the returned `items` (the draft). |
| Wrong rows animate, input state jumps between rows | `:key="index"`. | `:key="item.id"` (the same key as `getKey`). |
| Drop does nothing, and a console warning says so | `items` is read-only (getter, `computed`, `readonly`, a `toRef` of props). | Pass a writable ref, or call `e.preventDefault()` and apply `e.result`. |
| Want `v-model` on a list component | — | `const tasks = defineModel<Task[]>({ required: true })` and `items: tasks`. The write emits `update:modelValue`. |
| A nested array from a prop (`column.tasks`) | `toRef(props, 'column')` is read-only. | `toRef(props.column, 'tasks')` when the parent passes a reactive object, or emit and preventDefault. |
| Items don't move to another list | Different `group` names (each list is its own group by default), `put: false`, or `group.put` refuses. | Same `group` on both lists; check `put`. |
| Alt-drag or a palette doesn't copy | No `clone` option on the list the copy comes from. | Add `clone: (item) => ({ ...item, id: newId() })`. |
| A plain draggable can't be dropped into a list | No `createItem`. | Add `createItem: (active) => …`. |
| Copies collide or the drag loses the item | `clone` / `createItem` return an item with an existing key. | Give every copy (and every node of a copied subtree) a new key. |
| Item keys or data stale after the parent changes the item | Options given as plain values captured at setup. | Use getters: `id: () => props.item.id`, `data: () => props.item`. |
| Empty list can't receive drops | The list element has zero height. | `min-height` on the list element. |
| Overlay content doesn't resize, or looks squashed | A fixed size on the overlay component's root, or `scale` in a custom drop animation. | Root `width: 100%; height: 100%`; animate `width`/`height`, not `scale`. |
| Overlay hidden under a modal, or offset inside `<dialog>` / a shadow root | Teleported to `body` under a top-layer element. | `overlayTo` to the dialog or shadow root container. |
| Vue warns "made a component reactive" | A component stored in a deep `ref` / `reactive` (e.g. `overlay`). | Pass it directly or use `shallowRef` / `markRaw`. |
| Buttons inside a row don't start a drag | By design: interactive children don't start pointer drags. | Use a `handle`, or move the control outside. |
| Items can't move between two parts of the page | Each part has its own `DnDProvider`: drags never cross providers. | One provider for the app; per-part rules with `makeDragArea`. |
| Touch drag doesn't start; the page scrolls | Touch needs a 200 ms long press without moving more than 5 px first. | Tune `activation.touch`. To drag at once from a handle, give the handle `touch-action: none` and the item `activation: { touch: { distance: 4 } }`. |
| Slow with thousands of items | Deep `ref` of a big array. | `shallowRef`, and virtualize (see [virtualization](virtualization.md)). |
| Virtual list shows stale rows after a reorder (TanStack) | Options passed as a static object, or a stable `getItemKey`. | One `computed` that reads `items.value` and creates `getItemKey` / `rangeExtractor` inside it. |
| `onDrop` sees the old order | By design: it runs before the write. | Read `e.result`, or use the provider's `@drag-end` / `useDnDMonitor({ onDragEnd })`. |
| UI shows the dragged item twice right after drop | Your UI derives from `useDnD().active`. | `active` is `null` as soon as the drop is decided. Check `status === 'dropping'` if you need the landing phase. |
| An "after the animation" effect (a lid shutting) waits for the next drag to end | It watches `status` turning `'idle'`, but the next drag started during the landing. | Use `useDnDMonitor({ onDragSettle })`: it fires per drag, when its overlay is home. |
| Moves double-animate | `<TransitionGroup>` around sortable items. | Remove it; use `animate` on the list. |
| An action fires when a drag ends on the item | A handler on `pointerup` / `mouseup`. The built-in pointer sensor swallows the `click` after a drag, but not those events. | Use `@click` for item actions. |

## Debugging

Install `@vue-dnd-kit/devtools` ([devtools](devtools.md)). The log shows why a drop was
refused (target's `accept`, `group.put`, `onBeforeDrop`), and whether `preventDefault()`
was called. The mini-map shows which lists accept the current drag.
