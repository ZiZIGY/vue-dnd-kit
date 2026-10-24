# dnd-kit research for vue-dnd-kit v3

*Source: `github.com/clauderic/dnd-kit`, cloned 2026-10-24. I read the code; I did not run anything.*

## 0. Where things live

| Generation | Branch | Packages / versions | Local checkout |
|---|---|---|---|
| Classic | `master` (last commit 2024-12-05) | `@dnd-kit/core@6.3.1`, `sortable@10.0.0`, `modifiers@9.0.0`, `utilities@3.2.2`, `accessibility@3.1.1`; official examples in `stories/` | `scratchpad/v3-research/src/classic` |
| Next-gen | `main` (last commit 2026-10-22) | `@dnd-kit/abstract`, `dom`, `collision`, `geometry`, `helpers`, `state`, `react`, `solid`, `svelte`, **`vue`** — all `0.5.1` | `scratchpad/v3-research/src/dnd-kit` |

Paths below are written as `master:<path>` for classic and `main:<path>` for next-gen.

**Headline.** Classic dnd-kit sorts by moving items with transforms while the DOM stays put, which is the model v3 is leaving behind. Next-gen dnd-kit does what v3 plans to do: it reorders the DOM during the drag and animates each moved item with FLIP, using WAAPI on the CSS `translate` property. So the v3 approach matches where dnd-kit itself went. dnd-kit also met the same problem that approach creates: reordering moves the droppable rects, which can make the drop target flip back and forth (oscillation). There is also an official **`@dnd-kit/vue@0.5.1`** (peer `vue ^3.5`). It is a thin wrapper over `@dnd-kit/dom` and competes directly with v3.

---

## 1. Drop animation

**Classic (`master:packages/core/src/components/DragOverlay/`)**

- **How the overlay survives the drop.** `AnimationManager.tsx` keeps a clone of the previous children when `active` becomes `null`. It then runs the animation in a layout effect, after the commit.
- **When the target is measured.** `DndContext.tsx` (`createHandler`, around line 426) dispatches `DragEnd`/`DragCancel` and calls the user's `onDragEnd` inside the same `unstable_batchedUpdates`. So when the layout effect runs, the user's `arrayMove` has already been rendered. The target is therefore measured *after* the state update.
- **What gets measured** (`hooks/useDropAnimation.ts`):
  - The target is the **source element** (`draggableNodes.get(id).node`). It is first passed to `scrollIntoViewIfNeeded`, then measured with `getTransformAgnosticClientRect`, so the sortable's transform is ignored.
  - The overlay is measured with `getClientRect(getMeasurableNode(overlay))`, which uses the first child when there is only one.
  - The final transform is the current overlay transform minus the delta between the two rects.

```ts
const delta = { x: dragOverlay.rect.left - active.rect.left, y: dragOverlay.rect.top - active.rect.top };
const finalTransform = { x: transform.x - delta.x, y: transform.y - delta.y, ...scale };
...
if (JSON.stringify(firstKeyframe) === JSON.stringify(lastKeyframe)) return; // nothing to animate
const cleanup = sideEffects?.({active, dragOverlay, ...rest});
const animation = dragOverlay.node.animate(animationKeyframes, {duration, easing, fill: 'forwards'});
```

- **Defaults:**
  - `duration: 250`, `easing: 'ease'`.
  - Keyframes: `[{transform: initial}, {transform: final}]`.
  - `sideEffects` is `defaultDropAnimationSideEffects({styles: {active: {opacity: '0'}}})`. It hides the source while the overlay flies and restores the original inline value in cleanup. The official stories use `opacity: '0.5'` instead.
  - A `dropAnimation` function replaces everything. `null` disables the animation.
- **Missing source or no target.** If the draggable node is not registered or `node.current` is null (unmounted or virtualized), the hook returns `undefined`. The overlay then disappears with no animation. There is no special "no target" path: the overlay always returns to the source element, wherever the user's state put it.
- **Cancel vs. drop.** Both run the same code. The only difference is the user's state: after a cancel the source is still in its original slot. `cancelDrop` can be async and is awaited before the end handler. A truthy result turns `DragEnd` into `DragCancel`.
- **Keyboard drags.** These get `transition: transform 250ms ease` on the overlay (`PositionedOverlay.tsx`).

**Next-gen (`main:packages/dom/src/core/plugins/feedback/dropAnimation.ts`)**

- Waits for `manager.renderer.rendering`, i.e. until the framework has committed.
- Targets `placeholder ?? element`. It measures both elements with `DOMRectangle`, then animates `translate`. When the intrinsic size differs it also animates `min/max-width/height`.
- Duration is 0 under `prefers-reduced-motion`, and also when the item didn't move and no overlay is used.
- Pauses any running keyboard `translate` transition before measuring.
- On finish: `placeholder.replaceWith(element)`, then restores focus in a rAF (keyboard drags only).
- Async confirmation: `dragend` exposes `suspend()`, which returns `{resume, abort}` (`main:packages/abstract/src/core/manager/actions.ts:254`).

**Problems these solve:**
- Measuring before the commit, which would fly the overlay to the old slot.
- Transformed targets.
- Targets that are off-screen (handled by the scroll-into-view).
- The source and the overlay both being visible during the flight (hidden by the side effect).
- No-op animations (skipped).
- An unmounted target (no animation instead of a crash).

**Implication for v3**
- Measure the drop target after Vue flushes the committed draft (`await nextTick()` / `flush: 'post'`). Order matters: scroll into view first, then measure. Strip both `transform` *and* `translate` from the measurement (see §9), and animate size as well as position.
- Rejected drops (`onBeforeDrop` returning false) and multi-drag returns have no equivalent in dnd-kit, so we design them ourselves. Restore the draft first, then fly the overlay *and* every collapsed selected item to their restored slots.
- When the target element no longer exists (virtualized away), fade the overlay out instead of removing it abruptly, and respect `prefers-reduced-motion`.

---

## 2. Sortable strategies, preventing oscillation, and projected → committed

**Classic strategies (`master:packages/sortable/src/strategies/`)**

- **How positions are computed.** `SortableContext.tsx` derives `activeIndex`, `overIndex` and `sortedRects`. The droppable rects come from the core: they are measured at drag start and are transform-agnostic. Each `useSortable` then calls the strategy for its own index.
- **`verticalListSortingStrategy` / `horizontalListSortingStrategy`.**
  - Items between the active and over indexes shift by ±(active height + gap). The gap is measured from each item's actual neighbour, so variable heights and margins work.
  - The active item itself translates to the edge of the over rect, so it previews its target slot.

```ts
if (index > activeIndex && index <= overIndex) return {x: 0, y: -activeNodeRect.height - itemGap, ...};
if (index < activeIndex && index >= overIndex) return {x: 0, y: activeNodeRect.height + itemGap, ...};
```

- **`rectSortingStrategy`** (the default). Takes `newRect = arrayMove(rects, overIndex, activeIndex)[index]` and returns the delta *plus `scaleX/scaleY`*. With items of different sizes this stretches them, which is why the stories apply `CSS.Translate` (no scale). This is the known weakness for variable-size grids.
- **`rectSwappingStrategy`.** Only the active and over items exchange rects.

**Why classic never oscillates.**
- The layout never changes during a drag; only transforms change.
- Droppable rects are cached at drag start and measured transform-agnostically.
- So when a sibling slides away, its collision rect stays where it was. There is no feedback loop to stabilise.
- Collision choices: the default is `rectIntersection`; the sortable stories use `closestCenter`; the docs recommend `closestCorners` when droppables are stacked (kanban).
- If `items` change mid-drag, `SortableContext` sets `disableTransforms` for one render and calls `measureDroppableContainers(items)` in a layout effect.

**From projected to committed without a jump** (`hooks/useSortable.ts`, `hooks/defaults.ts`, `hooks/utilities/useDerivedTransform.ts`):
- **Items that land where they were projected.** After the drop the user commits `arrayMove`. For an item whose new index equals its projected `newIndex`:
  - `defaultAnimateLayoutChanges` returns false.
  - `getTransition()` returns `transform 0ms linear`.
  - Removing the strategy transform and changing DOM order happen in the same paint and cancel out visually.
- **Any other index change** (e.g. a cross-container move in `onDragOver`) uses `useDerivedTransform`, which is FLIP built on CSS transitions:

```ts
// layout effect, after the DOM changed:
const current = getClientRect(node.current, {ignoreTransform: true});
const delta = {x: initial.left - current.left, y: initial.top - current.top, ...};
if (delta.x || delta.y) setDerivedtransform(delta);   // rendered with transition disabled
// useEffect (after paint): setDerivedtransform(null) -> CSS transition 200ms ease animates to 0
```

- **Shortly after the drop.** `previous.activeId` is updated after a 50 ms `setTimeout`, so `wasDragging` stays true just long enough for post-drop layout changes to animate.

**Next-gen (`main:packages/dom/src/sortable/sortable.ts`)** has no strategies at all. The DOM is reordered, either by `OptimisticSortingPlugin` or by the framework re-rendering. An effect on each `Sortable` watches its `index`/`group` and runs `animate()`:
- Waits for the render.
- Cancels CSS transitions on `transform`, `translate` and `scale`, which would otherwise corrupt `getBoundingClientRect`.
- Takes First from the cached `droppable.shape` and Last from `refreshShape()`.
- Animates `translate` from `current + delta` to the final translate (the last keyframe of any running animation). Retargeting mid-flight therefore composes instead of jumping.
- Defaults: `250ms cubic-bezier(0.25, 1, 0.5, 1)`. `idle: false` means no animation when the index changes outside a drag.

**Next-gen anti-oscillation:**
- **Pointer-only recompute.** `CollisionObserver` (`main:packages/abstract/src/core/collision/observer.ts`) skips recomputing when the pointer coordinates are unchanged, so a layout shift alone can't change the target.
- **Short lock while the target changes.** `CollisionNotifier` disables the observer while `setDropTarget` resolves.
- **Target becomes the dragged item.** After an optimistic move the target is set to the source itself (`setDropTarget(source.id)`).
- **Pointer distance, not overlap area.** `shapeIntersection` ranks candidates by distance to the pointer instead of by intersection area, "because it can lead to cyclic collisions".
- **10 px hysteresis (unmerged).** Branch `fix/collision-notifier-oscillation` (2026-07) adds `CollisionNotifier.hysteresis = 10`: a droppable that was recently set or cleared as the target can't become the target again until the pointer has moved 10 px.

**Implication for v3**
- The draft order inherits next-gen's problem, so stability has to come from the collision layer:
  - (a) Recompute the target only on pointer movement or scroll, never just because the layout changed.
  - (b) After each draft mutation, treat the dragged item's new slot as the current target.
  - (c) Add hysteresis of about 10 px per recently targeted item.
  - (d) Use a "crossed the target's midpoint in the direction of travel" rule, which handles variable sizes, instead of overlap area.
- FLIP:
  - Capture First from cached rects *before* the draft mutation; a `flush: 'sync'`/`'pre'` watcher gives you the hook.
  - Capture Last after `flush: 'post'`.
  - Compose with in-flight animations by reading the current `translate` from computed style.
  - Cancel user CSS transitions on `transform`/`translate` before measuring.
  - For 500 items, only animate elements whose rect actually changed and that are near the viewport.

---

## 3. Multiple containers (kanban) and nested sortables

**Classic story (`master:stories/2 - Presets/Sortable/MultipleContainers.tsx`).** State is a `Record<containerId, id[]>`.

**Event handlers:**
- **`onDragStart`.** Snapshots the items into `clonedItems`.
- **`onDragOver`** (only when the containers differ):
  - Removes the item from its container and inserts it into the target container.
  - The index is `overIndex + (translated.top > over.bottom ? 1 : 0)`. When hovering the container itself, it appends.
  - Sets `recentlyMovedToNewContainer = true`. A `useEffect` on `items` resets it in the next `requestAnimationFrame`.
- **`onDragEnd`.**
  - Same container: `arrayMove`.
  - Trash droppable: filter the item out.
  - `PLACEHOLDER_ID`: create a new column.
- **`onDragCancel`.** Restores `clonedItems`.

**Custom collision detection:**

```ts
if (activeId in items) return closestCenter({...args, droppableContainers: containersOnly});
const pointerIntersections = pointerWithin(args);
let overId = getFirstCollision(pointerIntersections.length ? pointerIntersections : rectIntersection(args), 'id');
if (overId != null) {
  if (overId in items && items[overId].length > 0)   // over a non-empty column -> pick nearest card in it
    overId = closestCenter({...args, droppableContainers: cardsOf(overId)})[0]?.id;
  lastOverId.current = overId; return [{id: overId}];
}
if (recentlyMovedToNewContainer.current) lastOverId.current = activeId;  // layout shifted under us
return lastOverId.current ? [{id: lastOverId.current}] : [];
```

**Other details:**
- `measuring={{droppable: {strategy: MeasuringStrategy.Always}}}`, because the DOM changes during the drag.
- **Empty columns** work because every column is itself a droppable (`useSortable` with `data.type = 'container'`).
- **Draggable columns** are a nested sortable:
  - The outer `SortableContext` (horizontal strategy) holds the column ids plus a placeholder; each column renders an inner `SortableContext`.
  - Cards are `disabled` while a column is being dragged.
  - The column overlay renders the whole column.
  - The keyboard getter (`multipleContainersKeyboardCoordinates.ts`) skips non-empty columns unless a column is being dragged.
- Cards mounted mid-drag fade in (`useMountStatus`, 500 ms).

**Next-gen (`main:apps/stories/stories/react/Sortable/MultipleLists/MultipleLists.tsx`, `main:packages/helpers/src/move.ts`):**
- Columns are sortables with `type: 'column'`, `accept: ['column','item']` and **`collisionPriority: CollisionPriority.Low`**, so a card under the pointer always beats its column.
- `onDragOver` calls `setItems(items => move(items, event))`. Columns rely on optimistic sorting alone. Cancel restores a `structuredClone` snapshot.
- `move()` handles the details:
  - Insertion into an empty group: index 0 or `length`, depending on whether the dragged shape's centre is above or below the column's centre.
  - Cross-group insertion: before or after, comparing the rounded `y` of the shape centre with the target centre.
- **Element recreation.** When a card is reparented, React (and Vue, across different `v-for` parents) destroys and recreates it. Next-gen bridges this in three places:
  - `dragOperation.source` falls back to the previous instance with the same id (`main:packages/abstract/src/core/manager/operation.ts:126`).
  - Pointer capture is on `document.body`.
  - Feedback re-applies itself to the new element using its stored initial geometry.

**Implication for v3**
- Build the kanban rules into the library instead of leaving them to the user:
  - Items get high priority and containers low.
  - When over a non-empty container, pick its nearest item.
  - When over an empty container, append (or insert at 0 based on the midpoint).
  - Keep a "last valid target" plus a one-frame "just moved" guard on top of the hysteresis from §2.
  - Columns are sortable lists of lists, filtered by `group`/`accept`.
- Re-measure only the lists whose draft changed.
- Identify items by key, not by element. Keep sensor listeners on `document` with pointer capture on `body`, so recreating the element across lists can't kill the drag.

---

## 4. Sortable tree

**Classic (`master:stories/3 - Examples/Tree/utilities.ts`, `SortableTree.tsx`, `keyboardCoordinates.ts`)**

- **Data shapes.** `flattenTree` walks the tree depth-first into `{id, parentId, depth, index, children}`. `buildTree` rebuilds it by looking up parents (root id `'root'`).
- **What renders during a drag.** `removeChildrenOf(flattened, [activeId, ...collapsedIds])` hides the active item's descendants and all collapsed subtrees. The dragged node "carries" its subtree, and the overlay shows `childCount + 1`.
- **Projection:**

```ts
const newItems = arrayMove(items, activeIndex, overIndex);
const previousItem = newItems[overIndex - 1], nextItem = newItems[overIndex + 1];
const projectedDepth = activeItem.depth + Math.round(dragOffsetX / indentationWidth);
const maxDepth = previousItem ? previousItem.depth + 1 : 0;
const minDepth = nextItem ? nextItem.depth : 0;
depth = clamp(projectedDepth, minDepth, maxDepth);
// parentId: depth 0 / no prev -> null; == prev.depth -> prev.parentId; > prev.depth -> prev.id;
// else walk back to the nearest item with that depth and take its parentId
```

- **Rendering and settings:**
  - `onDragMove` stores `delta.x`.
  - The active row is rendered at `projected.depth`, as padding of `depth * indentationWidth` (default 50).
  - Uses `closestCenter`, the vertical strategy and `MeasuringStrategy.Always`.
  - Tree items set `animateLayoutChanges = ({isSorting, wasDragging}) => !(isSorting || wasDragging)`.
  - Indicator mode adds a modifier `y - 25`.
- **Drop.** Clone the flattened list, set the active item's `{depth, parentId}`, `arrayMove`, `buildTree`. Collapse toggles a `collapsed` flag on the node.
- **Keyboard.**
  - Left/Right shift x by ±`indentationWidth`, but only while the projection stays within min/max depth.
  - Up/Down filter droppables above or below, run `closestCorners`, skip the current `over`, and target `x = newRect.left + depth * indent`.
- **Announcements.** "X was nested under Y" / "moved after" / "moved before" / "dropped…". Repeats are suppressed by comparing `{parentId, overId}`.

**Next-gen tree story (`main:apps/stories/stories/react/Sortable/Tree/Tree.tsx`)** is essentially v3's draft-order design:
- At `onDragStart` it removes the descendants from the flattened state and stores them.
- `onDragOver` calls `event.preventDefault()` (which disables optimistic DOM sorting), then `move(flattened, event)` and applies the projection.
- `onDragMove` updates `depth`/`parentId` when the horizontal offset changes.
- Keyboard Left/Right changes depth and moves the overlay by one indentation (`actions.move({by, propagate: false})`).
- `maxDepth = min(target.depth + 1, prev.depth + 1)`.
- On drop: `buildTree([...flattened, ...sourceChildren])`. On cancel: re-flatten the original tree.

**Implication for v3**
- Reuse the flatten/project/build trio directly. The draft is simply the flattened list, with `depth`/`parentId` as draft fields.
- "Hover-to-nest" has no equivalent in dnd-kit. Use a zone rule instead: the middle band of a row, around 25–75% of its height, means "nest into". It can be combined with the offset projection, which still decides depth in the edge bands.
- Hide the carried subtree during the drag, re-insert it on drop, and keep collapsed subtrees out of the draft.

---

## 5. Modifiers

**Signature** (`master:packages/core/src/modifiers/types.ts`):

```ts
type Modifier = (args: { transform; activatorEvent; active; activeNodeRect;
  draggingNodeRect /* overlay rect ?? active rect */; containerNodeRect /* activeNode.parentElement */;
  over; overlayNodeRect; scrollableAncestors; scrollableAncestorRects; windowRect }) => Transform;
```

**How they apply.** `applyModifiers` reduces them in array order. Modifiers on `DndContext` change the translate used for **collision**. Modifiers on `DragOverlay` are visual only.

**The built-ins (`master:packages/modifiers/src/`):**
- **`createSnapModifier(grid)`.** `x = Math.ceil(transform.x / grid) * grid`, and likewise for y. It snaps the drag *delta*, not the absolute position, and `ceil` is asymmetric: it jumps forward as soon as you move 1 px. Next-gen `SnapModifier` is the same, with `size: number | {x, y}`.
- **`restrictToBoundingRect(transform, rect, bounds)`.** If `rect.top + y <= bounds.top`, then `y = bounds.top - rect.top`. If `rect.bottom + y >= bounds.bottom`, then `y = bounds.bottom - rect.bottom`. Same for x. It is used by:
  - `restrictToParentElement`, with `containerNodeRect`, i.e. the *immediate* parent of the source.
  - `restrictToWindowEdges`, with `windowRect`.
  - `restrictToFirstScrollableAncestor`, with `scrollableAncestorRects[0]`. Those ancestors are computed for `overNode ?? activeNode`, so the bounds can change when you hover another list. That's a subtle pitfall.
- **`restrictToVerticalAxis` / `restrictToHorizontalAxis`.** Zero out x or y.
- **`snapCenterToCursor`.** `offset = activatorCoords - rect.{left,top}`, then `transform + offset - size / 2`.

**Next-gen `RestrictToElement`** (`main:packages/dom/src/modifiers/RestrictToElement.ts`):
- Caches the element's bounding rect.
- Refreshes it through a `ResizeObserver` plus a capture-phase scroll listener throttled to 25 ms.
- Restricts using the initial centre and the current size.

**Implication for v3**
- Apply modifiers once to the overlay translate and feed that same value to collision detection, so the overlay and the target always agree.
- Snap:
  - Use `Math.round` by default.
  - Offer snapping to an absolute grid relative to a container origin.
  - "Smooth" snap is a short WAAPI or transition step on the overlay between snapped positions; the collision side uses the snapped value immediately.
- Restrict:
  - Cache the bounds rect per drag and refresh it on scroll/resize.
  - The "parent" should be the list container, not the immediate DOM parent.

---

## 6. Keyboard and accessibility

**Classic `KeyboardSensor` (`master:packages/core/src/sensors/keyboard/`).**
- **Keys.** Start: `Space`/`Enter`, and only when `event.target` is the activator node. Cancel: `Esc`. End: `Space`/`Enter`/`Tab`.
- **Avoiding the activating keydown.** The keydown listener is attached in a `setTimeout`, so the keydown that started the drag isn't processed again.
- **Cancel triggers.** Window `resize` and `visibilitychange`.
- **Auto-scroll.** `autoScrollEnabled = false`. The default getter moves 25 px per keypress.
- **Scrolling.** If the new coordinates fall outside the scroll container's half-clamped bounds and the container can scroll, it calls `scrollTo`/`scrollBy` (smooth). When the scroll covers the whole delta it returns without moving the item.

**`sortableKeyboardCoordinates`** (`master:packages/sortable/src/sensors/keyboard/sortableKeyboardCoordinates.ts`):
- Keeps enabled droppables that lie strictly in the pressed direction (comparing `collisionRect.top` or `left` with each rect).
- Runs `closestCorners` on that set. If the winner is the current `over`, it takes the second result.
- Returns the target rect's top-left. For items after the active one in the same container, it subtracts `collisionRect.size - newRect.size` so the bottom/right edges line up, which handles variable sizes.

**Default instructions and announcements** (`master:packages/core/src/components/Accessibility/defaults.ts`):

> To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.

- `onDragStart`: `Picked up draggable item ${active.id}.`
- `onDragOver`: `Draggable item ${active.id} was moved over droppable area ${over.id}.`, or `Draggable item ${active.id} is no longer over a droppable area.`
- `onDragEnd`: `Draggable item ${active.id} was dropped over droppable area ${over.id}`, or `Draggable item ${active.id} was dropped.`
- `onDragCancel`: `Dragging was cancelled. Draggable item ${active.id} was dropped.`

Next-gen (`main:packages/dom/src/core/plugins/accessibility/defaults.ts`) uses nearly the same wording ("droppable target" instead of "droppable area"; the instructions add "in a given direction"). It also **debounces `dragover`/`dragmove` announcements by 500 ms**.

**Attributes from `useDraggable`.**
- `role: 'button'`, `tabIndex: 0`, `aria-disabled`.
- `aria-pressed: true` while dragging, when the role is `button`.
- `aria-roledescription: 'draggable'` (`'sortable'` from `useSortable`).
- `aria-describedby`, pointing at a `display: none` instructions element.
- The live region is `role="status"`, `aria-live="assertive"`, `aria-atomic`, visually hidden.
- `RestoreFocus.tsx` refocuses the activator (or the first focusable element in the node) in a rAF after a keyboard drag, if focus was lost.
- Next-gen sets the same attributes imperatively and never overwrites attributes the user set.

**Sortable announcements.** None are built in. The story pattern (`master:stories/2 - Presets/Sortable/Sortable.tsx`) is:
- "Picked up sortable item X. Sortable item X is in position N of M"
- "…was moved into position N of M"
- "…dropped at position…"
- "Sorting was cancelled… returned to position…"

The first redundant `onDragOver` is skipped.

**Next-gen `SortableKeyboardPlugin`:**
- Candidates are droppables whose centres lie more than 10 px past the dragged centre in the arrow's direction, measured with the *visible* bounding rect.
- `closestCorners` picks one; then `setDropTarget`, then the overlay moves onto the target's real rect, then `scrollIntoViewIfNeeded`.
- The pointer auto-scroller is disabled during keyboard sorting.

**Implication for v3**
- "Keyboard moves by items" means stepping the draft index by ±1, with no geometry needed. Left/Right moves to the adjacent list in a kanban and changes depth in a tree.
- Grids are the one case that needs geometry: the nearest item in the next row by centre x.
- Ship position-aware English announcements by default ("Item X moved to position 3 of 8 in List A"), debounced, and overridable.
- Restore focus by key after the drop, because Vue may have recreated the element.

---

## 7. Auto-scroll

**Classic (`master:packages/core/src/hooks/utilities/useAutoScroller.ts`, `utilities/scroll/getScrollDirectionAndSpeed.ts`):**
- **What triggers it.** The activator is the pointer position (default) or the dragged rect.
- **Edge zone.** `threshold` is `{x: 0.2, y: 0.2}` of the container's size.
- **Speed.** `acceleration = 10`, applied every 5 ms by `setInterval` via `scrollBy(speed * direction)`. The formula is `acceleration * |(edge ± threshold - pos) / threshold|`. It grows linearly and is **unbounded when the pointer goes past the edge**, so it keeps accelerating outside the container.
- **Which container scrolls:**
  - `isTop/isBottom/isLeft/isRight` checks stop scrolling at the limits.
  - `canScroll(el)` can veto a container.
  - The first container with speed > 0 wins.
  - Scrollable ancestors are collected for `overNode ?? activeNode`, innermost first. **But the default `TraversalOrder.TreeOrder` reverses that list, so the outermost scroller (the document) is tried first.**
- **Scroll intent.** A direction is only allowed after the user has moved in that direction since the drag started. Picking an item up near an edge therefore doesn't scroll by itself.
- **Layout-shift compensation.** `useLayoutShiftScrollCompensation` scrolls the first scrollable ancestor by however far the active node moved between pickup and initialisation.

**Next-gen (`main:packages/dom/src/core/plugins/scrolling/Scroller.ts`, `AutoScroller.ts`, `utilities/scroll/detectScrollIntent.ts`):**
- **Which container scrolls.** Candidates come from `elementFromPoint` under the pointer: its scrollable ancestors *including itself*, innermost first.
- **Speed and timing.** `acceleration = 25`, `threshold = 0.2` (a single number or per axis; 0 disables an axis). It runs on a `setInterval` of 10 ms, and each tick is scheduled through a rAF scheduler.
- **Pointer outside the container.** A **cross-axis tolerance of 10 px** applies: vertical scrolling only happens while the pointer is within the container's horizontal extent ±10 px. A pointer beside the container therefore does not scroll it. Along the scroll axis, speed still grows past the edge.
- **Stability.** A scroll-intent lock applies per axis and direction. While auto-scrolling it keeps the previous scroller set if the new one is smaller, so it doesn't jump to another container mid-scroll. Inverted axes (scale −1) are supported.

**Implication for v3**
- Use a single rAF loop, not `setInterval`.
- Pick scrollers innermost-first from the element under the pointer.
- Threshold: a fraction of the container size, clamped to px min/max.
- Clamp the maximum speed.
- Add the cross-axis tolerance and the scroll-intent lock.
- Because the draft reorders the DOM, scrolling changes the cached rects. Use classic's lazy scroll-delta rects (§9) so we don't re-measure on every frame.

---

## 8. Pointer and touch sensors

**Classic (`master:packages/core/src/sensors/pointer/AbstractPointerSensor.ts`):**
- **Constraints.** `{distance, tolerance?}`, `{delay, tolerance}`, or both.
  - While pending, moving past the tolerance cancels.
  - Moving past the distance starts the drag.
  - The delay is a `setTimeout`.
  - With no constraint the drag starts immediately; there are no defaults.
- **Listeners while pending or dragging:**
  - `move`: `passive: false`, calls `preventDefault` when cancelable.
  - `end` and `cancel`.
  - Window `resize` cancels.
  - Window `dragstart` and `contextmenu`: `preventDefault`.
  - `visibilitychange` cancels.
  - Document `keydown` `Escape` cancels.
- **On start:**
  - A capture-phase `click` → `stopPropagation` listener on the document. It is removed **50 ms after detach**, which suppresses the click after a drop.
  - `getSelection().removeAllRanges()`, plus a `selectionchange` listener that keeps clearing the selection.
- **Per input type:**
  - **`PointerSensor`** attaches its listeners to the owner *document*, because pointer events stop reaching an unmounted target. Its activator requires `isPrimary && button === 0`.
  - **`TouchSensor`** attaches to the *event target*, because touch events keep firing at the original target even after it is removed. `TouchSensor.setup()` adds a window `touchmove` no-op with `{passive: false}` so that later `preventDefault()` calls work on iOS Safari.
  - **`MouseSensor`** ignores the right button.

**Next-gen (`main:packages/dom/src/core/sensors/pointer/PointerSensor.ts`)** has smarter defaults:

```ts
if (pointerType === 'mouse' && handleContainsTarget) return undefined;           // immediate
if (pointerType === 'touch') return [new Delay({value: 250, tolerance: 5})];
if (isTextInput(target)) return [new Delay({value: 200, tolerance: 0})];
return [new Delay({value: 200, tolerance: 10}), new Distance({value: 5})];         // OR semantics
```

- **`preventActivation`.** Pressing an interactive element inside the draggable doesn't start a drag, unless that element is the handle or the draggable itself.
- **Move events** are coalesced into one per frame through a rAF scheduler.
- **Pointer capture** is set on **`document.body`**, not on the element, which survives the element being moved or recreated.
- **After activation:**
  - `touchmove` → `preventDefault` (non-passive) on the target and on body.
  - `click` and `contextmenu` → `preventDefault`.
  - `Escape` cancels.
- **On pointer up.** A capture-phase window `click` handler cancels the body-targeted click that follows a drop, and is removed by a `setTimeout(0)`.
- **Native drag conflicts.** Natively `draggable="true"` elements cancel the activation.
- **Text selection.** The `PreventSelection` plugin injects `* { user-select: none !important }` and clears the selection on `selectionchange`.

**Implication for v3**
- Use Pointer Events only (we target modern browsers). Constraints should be composable objects with OR semantics.
- Defaults:
  - Mouse: 4 px distance; immediate when pressed on a handle.
  - Touch: 200 ms delay with about 5 px tolerance.
- Never start a drag from an interactive child.
- Keep listeners on the document and pointer capture on `body`.
- `touch-action` can't be changed mid-gesture. Keep the non-passive `touchmove` `preventDefault` plus the window no-op patch for iOS.
- Also include: post-drop click suppression, selection blocking via an injected style, and cancel on `Escape`, `visibilitychange` and `pointercancel`.

---

## 9. Measuring

**Classic:**
- **`MeasuringStrategy`** (`master:packages/core/src/hooks/utilities/useDroppableMeasuring.ts`):
  - `WhileDragging` (default) measures droppables when the drag starts.
  - `BeforeDragging` measures before.
  - `Always` re-measures whenever the set of containers changes.
- **Frequency.** `Optimized` (default) only re-measures on demand, through a queue. A number re-measures on a timer after the translate changes.
- **Partial re-measures.** `measureDroppableContainers(ids)` adds ids to the queue and re-measures only those.
- **Resize handling.** Each droppable has a `ResizeObserver`, debounced 25 ms. In a sortable, a resize re-measures the item *and every item after it* (`updateMeasurementsFor`).
- **Transform-agnostic rects.** `getTransformAgnosticClientRect` calls `getBoundingClientRect`, then `inverseTransform` using the computed `transform` and `transform-origin` (`utilities/transform/inverseTransform.ts`). It **ignores the individual `translate`/`scale` properties and running animations**.
- **Scroll handling without re-measuring** (`utilities/rect/Rect.ts`). The `Rect` stores the rect plus the scroll offsets of every scrollable ancestor at measure time. Its `top/left/right/bottom` getters add the current scroll delta lazily, so cached droppable rects stay correct during scrolling.
- **Active node.** Tracked with `useRect` (a `ResizeObserver` plus a `MutationObserver` on body `childList`). `useCachedNode` keeps the last known active node when it unmounts (virtualized lists).

**Next-gen:**
- **`DOMRectangle`** (`main:packages/dom/src/utilities/shapes/DOMRectangle.ts`):
  - `forceFinishAnimations` temporarily sets running ancestor animations on `transform/translate/scale/width/height` to their end time, measures, then restores them. This gives an element's final position even while its column is mid-FLIP.
  - For the element's own animations it reads the projected transform from their last keyframes (last one wins per property).
  - It parses `transform`, `translate` and `scale`, and applies iframe frame transforms.
- **Droppable shapes** (`main:packages/dom/src/core/entities/droppable/droppable.ts`) are only observed during a drag, and only for droppables that accept the source.
- **`PositionObserver`** (`utilities/observers/PositionObserver.ts`):
  - An `IntersectionObserver` whose `rootMargin` equals the element's own rect, so any movement fires it.
  - Plus a `ResizeObserver`, throttled to 75 ms.
  - Invisible elements get `shape = undefined` and drop out of collision detection.

**Implication for v3**
- Our measure has to strip `translate` (which we animate) as well as `transform`. Compute the layout rect from the `getBoundingClientRect` reading minus the parsed computed `translate`/`transform`. Use the final keyframe, or temporarily finishing, when an animation is running.
- Cache rects per drag, keyed by item key. Invalidate:
  - only the lists whose draft changed (after `flush: 'post'`);
  - on resize;
  - lazily for scroll, using classic's scroll-delta getters.
- Batch all reads into one pass per frame. One `PositionObserver` per item is too heavy for 500 items without virtualization.

---

## 10. Next-gen `@dnd-kit/dom`: optimistic sorting, Feedback, `move()`

**`OptimisticSortingPlugin` (`main:packages/dom/src/sortable/plugins/OptimisticSortingPlugin.ts`):**
- **On `dragover` between two sortables:**
  - `queueMicrotask`, then wait for `renderer.rendering`.
  - **Abort if any index or group changed**, meaning the user's handler already updated state and the framework re-rendered.
  - Otherwise run `move()` over the `Sortable` instances and **move the DOM node directly** with `insertAdjacentElement`, behind the framework's back.
  - `batch` the updates to `sortable.index`/`group`.
  - `setDropTarget(source.id)`, with the collision observer disabled until that resolves.
- **On a cancelled `dragend`.** Restores the DOM order and the initial indices.
- **Opting out.** `event.preventDefault()` in `onDragOver` turns it off; the tree story does this. On drop, `move()` reconciles by using `source.index` (the projected index) when it differs from the data index.

**Feedback types** (`main:packages/dom/src/core/plugins/feedback/Feedback.ts`, `constants.ts`, `utilities.ts`, `observers.ts`):
- **`default`.**
  - The **real element** is lifted into the top layer: `popover="manual"` with `showPopover()`, plus `position: fixed !important` through an injected stylesheet and `--dnd-*` custom properties.
  - It moves with `translate`.
  - A **hidden placeholder clone** (`visibility: hidden`) is inserted right after it to keep the space.
  - A document `MutationObserver` re-attaches the placeholder next to the element whenever the framework moves the element.
- **`clone`.** The placeholder is a *visible* clone (a ghost stays in the list) while the real element follows the pointer.
- **`move`.** No placeholder: the element leaves the flow and the list closes the gap. The droppable is disabled.
- **`none`.** No visual feedback at all.
- **With a `DragOverlay` component.** The overlay becomes the feedback element and the source is left untouched.
- **Cloning pitfalls they handle** (`cloneElement.ts`):
  - Copies the current `value` of inputs/textarea/select (`cloneNode` doesn't).
  - Redraws canvases.
  - Renames radio `name` attributes so the original group isn't broken.
  - Droppables inside the source are proxied to their clones (`ProxiedElements`).

**Sortable animation.** WAAPI on `translate`, FLIP from the cached shape to the refreshed shape; details in §2.

**`move()` / `swap()`** (`main:packages/helpers/src/move.ts`):
- Accept a flat array or a `Record<group, items>`, with either ids or `{id}` objects.
- Return the same reference on a no-op, and call `preventDefault`.
- Reconcile optimistic indices.
- Fall back to `initialIndex`/`index` when ids can't be matched.
- Cross-group insertion is before or after the target, based on the dragged shape's centre relative to the target centre.

**What this means for the v3 approach.**

*Supports it:*
- Next-gen is our model: the DOM is reordered during the drag, including across lists, and every move is a FLIP on `translate` via WAAPI with mid-flight composition.
- Their tree example *is* a draft-order implementation.
- Interrupting in-flight animations, cancelling CSS transitions before measuring, and `prefers-reduced-motion` all turned out to be necessary; copy them.

*Challenges it raises:*
- (a) They move DOM nodes optimistically so they don't have to wait for a framework render. Our reactive draft makes Vue patch on every reorder. A keyed `v-for` move is cheap, but with 500 items keep the draft in a `shallowRef`, mutate it at most once per frame, and avoid re-rendering item contents.
- (b) Collision oscillation from layout shifts was real enough to need a hysteresis fix.
- (c) Moving an item across lists recreates its component. They handle it by falling back to the previous instance with the same id, pointer capture on `body`, and Feedback re-applying itself.
- (d) Their default overlay is the real element in the top layer, not a clone. That keeps component state, video and focus. A clone overlay should copy values and canvases, and may lose ancestor-scoped CSS.
- (e) The official `@dnd-kit/vue` uses a `flush: 'sync'` watcher to push `index`/`group` into the `Sortable` before the patch, so the old shape is still cached when `animate()` runs after the render. Our First capture needs the same ordering.

**Implication for v3**
- Keep draft order + FLIP. Borrow next-gen's animation rules (cancel transitions, compose with in-flight animations, reduced motion) and its collision hysteresis.
- Make the placeholder keep the active element in the list, which is the opposite of their `default` and closer to `clone` inverted.
- Copy their clone hygiene for our DOM-clone overlay.
- Benchmark Vue patch cost at 500 items against direct DOM moves.

---

## 11. Multi-drag

**Not supported officially, in either generation.** Neither the classic `stories/` nor the next-gen stories have a multi-select example. There are two unmerged branches:

- **`multi-drag`** (2021-01, `stories/2 - Presets/Sortable/Selectable.tsx`). This is the community "stack" pattern:
  - **`onDragStart`.** If the active item isn't selected, clear the selection. Otherwise **remove every other selected item from its container** (the stack collapse) and snapshot `clonedItems`.
  - **Overlay.** Renders the active item plus up to 4 selected items stacked, with a "N items" badge when there are more than 5.
  - **`onDragOver`.** Moves only the active item across containers.
  - **`onDragEnd`.** `arrayMove` the active item, then `splice(overIndex + 1, 0, ...selectedItems.filter(id => id !== activeId))`. On cancel, restore the snapshot.
- **`multi-select-demo`** (2022-01). A similar selection layer on top of `MultipleContainers`.

**Pitfalls in that pattern:**
- The re-inserted items follow the *order they were clicked*, not their original document order.
- Collapsing items on pickup shifts the active element. Classic's `layoutShiftCompensation` (§7) partly hides this.
- Nothing animates the collapse or the expand-on-cancel.

**Implication for v3**
- Build "stack" in:
  - On pickup, remove the selected items from the draft and FLIP them into the active item, fading as they go.
  - Compensate any layout shift with a scroll adjustment.
  - On drop, insert them after the active item in their original relative order.
  - On cancel or reject, restore the draft and FLIP each one back.
- "Gaps" keeps the selected items in place as semi-transparent placeholders, with only the active item moving in the draft. The overlay shows the stack either way.

---

### Key file index

- Classic drop animation: `master:packages/core/src/components/DragOverlay/{DragOverlay.tsx,hooks/useDropAnimation.ts,components/AnimationManager/AnimationManager.tsx}`
- Classic sortable: `master:packages/sortable/src/{components/SortableContext.tsx,hooks/useSortable.ts,hooks/defaults.ts,hooks/utilities/useDerivedTransform.ts,strategies/*}`
- Classic examples: `master:stories/2 - Presets/Sortable/MultipleContainers.tsx`, `master:stories/3 - Examples/Tree/*`
- Next-gen sortable: `main:packages/dom/src/sortable/{sortable.ts,plugins/OptimisticSortingPlugin.ts,plugins/SortableKeyboardPlugin.ts}`
- Next-gen feedback: `main:packages/dom/src/core/plugins/feedback/*`
- Collision stability: `main:packages/abstract/src/core/collision/{observer.ts,notifier.ts}`, branch `origin/fix/collision-notifier-oscillation`
- Helpers: `main:packages/helpers/src/move.ts`
- Official Vue adapter: `main:packages/vue/src/*`
