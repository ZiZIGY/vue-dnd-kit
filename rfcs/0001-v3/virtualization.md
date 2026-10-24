# vue-dnd-kit v3: sortable lists and FLIP inside virtualized lists

**Versions read** (installed 2026-10-24 into `v3-research/src/virtual`): `@tanstack/vue-virtual` 3.13.48, `@tanstack/virtual-core` 3.19.7, `@vueuse/core` 15.0.0, `vue` 3.5.44.

**Line references** (paths are relative to `v3-research/src/virtual/node_modules/`):
- `core:N` is `@tanstack/virtual-core/src/index.ts`.
- `adapter:N` is `@tanstack/vue-virtual/src/index.ts`.
- `vueuse:N` is `@vueuse/core/dist/index.js`.
- `rc:N` is `@vue/runtime-core/dist/runtime-core.cjs.js`.

**Experiments**: `v3-research/scripts/tanstack-reorder.mjs` and `tanstack-more.mjs`. Both run in Node against a real `Virtualizer` with a fake scroll element. **Official Vue examples** (downloaded as data): `v3-research/src/examples/*.vue`.

## TL;DR

1. **The settled design fits virtualization.** The draft order is real data, the DOM reorders, and FLIP is keyed by id. dnd-kit's transform-based `rectSortingStrategy` "does not support virtualized lists" because it needs every rect. Our approach only needs the rows that are mounted.
2. **The main trap is in TanStack.** Measurements are memoised on `[count, getItemKey reference, …]` (core:1549-1601). If the list is reordered, the count stays the same and `getItemKey` is the same function, the virtualizer keeps returning the old keys and positions. I verified this. The fix is to create `getItemKey` inside the options `computed` that reads `items.value`.
3. **TanStack caches sizes by key** (`itemSizeCache: Map<Key, number>`, core:488), so sizes move with their keys. Two kinds of rows are measured later by a ResizeObserver, after our post-flush FLIP measurement:
   - rows whose size changed, such as a swap to a placeholder;
   - new keys that mount while the list is scrolling.

   We need an interruptible FLIP plus a public `captureLayout()` that the user wires to the virtualizer's `onChange`.
4. **The official examples key rows by index.** TanStack's fixed example uses `:key="virtualRow.index"` and VueUse's docs use `:key="item.index"`. Users must key rows by id.
5. **The active row will unmount** when it scrolls out of range. VueUse cannot prevent this. TanStack can pin the row with `rangeExtractor`, but the extractor is memoised by reference (core:1853-1887), so its closure must be recreated whenever the active index changes.
6. **Animating `translate` with WAAPI is safe with both libraries.** It composes with `transform` / `top` / `margin-top` positioning, it does not change border-box size (so ResizeObserver never fires), and it does not affect TanStack's measurements.

---

## 1. TanStack: positioning, keys, measurement, recompute timing

**Positioning.** The adapter only exposes `VirtualItem {key, index, start, size, end, lane}` (core:60-67). The user does the positioning, and the examples show two patterns:

- **Per-row absolute.** Each row gets `position:absolute; top:0; transform: translateY(${start}px); height:${size}px` (`RowVirtualizerFixed.vue`). Note that this example keys by `virtualRow.index`.
- **Flow block.** One absolutely positioned wrapper gets `transform: translateY(${rows[0].start}px)` and the rows sit in normal flow inside it, measured through `data-index` (`RowVirtualizerDynamic.vue`). The scroller uses `contain: strict` and measures in `onUpdated(measureAll)`. The docs recommend this block translation for smooth scrolling.

**Keys.** `getItemKey(index)` defaults to the index (core:100, 744). The key is used in three places:
- the size cache `itemSizeCache: Map<Key, number>` (core:488);
- `elementsCache: Map<Key, Element>` (core:637);
- the `key` field of each item, used for Vue's `:key`.

The index is used in two places:
- `laneAssignments: Map<index, lane>` (core:490);
- the DOM↔index mapping through the `data-index` attribute (`indexFromElement`, core:1889-1901).

**Measurement.**
- The virtualizer's ResizeObserver observes `border-box` (core:722) and reads `borderBoxSize` (core:277-285).
- `measureElement(node)` is a function ref. Vue calls it synchronously on every patch (rc:1876-1877, rc:5671-5672). It measures synchronously only if the node is connected and the list is **not** scrolling (core:1967-1973). Even then, the default measurer returns the **cached size by key** without reading the DOM (core:293-300). It falls back to `offsetHeight` only for keys it has never measured (core:302).

  So a placeholder swap on an existing key is always picked up asynchronously by the ResizeObserver. A new key is measured synchronously only while the list is not scrolling.
- `resizeItem` updates the cache, bumps `itemSizeCacheVersion` and calls `notify` (core:1976-2098).
- The ResizeObserver callback runs after layout and before paint. The adapter's `onChange` → `triggerRef` (adapter:53-56) re-renders in the following microtask, still before paint. The browser never paints a stale frame, but our post-flush FLIP has already run by then.
- `useAnimationFrameWithResizeObserver` (core:678-680) defers this by a full frame. Leave it off.

**What happens on a reorder with the same count.** `getMeasurements` is memoised on `getMeasurementOptions()` and `itemSizeCacheVersion` (core:1600-1601). `getMeasurementOptions` compares `count, paddingStart, scrollMargin, getItemKey, enabled, lanes, laneAssignmentMode, gap` by reference (core:1549-1559). Results from `tanstack-reorder.mjs`:

```
stable getItemKey ref    after reorder a->3:  0:a@0+30 1:b@30+80 2:c@110+40 3:d@150+60   <- stale
new closure per options  after reorder a->3:  0:b@0+80 1:c@80+40 2:d@120+60 3:a@180+30   <- correct, sizes followed keys
```

- The edge-key rebuild in `setOptions` (core:778-849) only runs with `anchorTo:'end'`.
- `measure()` (core:2664-2673) does fix stale keys, but it also clears every cached size, so every row falls back to its estimate.

With a fresh closure, measurements are rebuilt in full: 1.1 ms per reorder at 50k items with `lanes=1`, 3.2 ms with `lanes=4` (`tanstack-more.mjs`).

**When `getVirtualItems()` is recomputed.** It is pull-based and memoised (core:2100-2128), and re-evaluates when the render reads it. Three things trigger a re-render:
- **Options change.** The adapter's `watch(() => unref(options))` uses the default `flush:'pre'`. It calls `setOptions`, then `_willUpdate`, then `triggerRef` (adapter:48-65). This happens in the same flush as the draft change, so there is no delay.
- **Scroll.** A passive `scroll` listener (core:229) calls `maybeNotify`. That only notifies when `range.start`, `range.end` or `isScrolling` changes (core:969-991).
- **ResizeObserver.**

The only frame-based work is the `scrollToIndex` reconcile loop (core:1401-1521).

**Sources of stale positions at our post-flush measurement:**
- a stable `getItemKey`;
- a row resized by the ResizeObserver (placeholder size, content change) when using the absolute pattern;
- a new key mounting during a scroll, which uses its estimate until the ResizeObserver measures it;
- `useAnimationFrameWithResizeObserver`;
- `anchorTo:'end'` writing `scrollTop` in the pre-flush `_willUpdate` (core:1219-1258).

The flow-block pattern is self-correcting. The browser lays out the in-flow siblings at patch time, so the post-flush rects are already correct, and the later ResizeObserver pass only changes `totalSize` and the range.

## 2. TanStack: the APIs we rely on

- **`rangeExtractor`** (core:102-117, 1853-1887). Pinning the active row is the standard sticky-row pattern: `new Set([...defaultRangeExtractor(range), pin])`, then sort. The memo dependencies are `[rangeExtractor, overscan, count, start, end, lanes]`. A stable function that reads a changing pin is ignored. `tanstack-more.mjs` shows `pinned=60` still rendering index 40 until the closure is recreated.

  A pinned row is not contiguous with the range. It only works with per-row absolute positioning. In the flow-block pattern, `rows[0].start` would be the pinned row's offset, so the whole block would be offset by that amount.
- **`scrollToIndex(i, {align, behavior})` / `scrollToOffset` / `scrollBy`** (core:2354-2401). These run over several frames: they retarget as measurements arrive, retire after 1-3 stable frames, and give up after a 5 s safety timeout. A user or library scroll retires the command (core:1105-1114). Keyboard sorting should call `scrollToIndex(activeIndex, {align:'auto'})`.
- **Scroll element.** `getScrollElement` must return a sized element with `overflow:auto`. Its size is tracked through a content-box ResizeObserver (core:119-160) and its offset through scroll and scrollend events. `useWindowVirtualizer` uses `scrollMargin`.
- **Horizontal lists.** Set `horizontal:true`. The virtualizer then reads `scrollLeft` and `inlineSize`, the user applies `translateX(start)`, and `isRtl` handles negative `scrollLeft`.
- **Grids.**
  - `lanes:N` places each item in the shortest lane (core:1712-1814). In the default `laneAssignmentMode:'estimate'`, the lane is cached **per index** (core:490, 1740-1786). A sortable grid keeps index → slot stable, which is what you want for uniform cells. Masonry layouts reshuffle when sizes are keyed and lanes are indexed: in the experiment, positions shifted and lanes stayed the same.
  - A true 2D grid needs a row virtualizer plus a column virtualizer. Moving a cell across rows remounts it in another row element, which still works because FLIP is keyed by id.
  - Use ≥3.19 for lanes (#1063 was fixed in 3.13.14 and 3.19.0).
- **Dynamic sizes.** Set `estimateSize` to the largest reasonable size, and use `measureElement` with `data-index`. `useCachedMeasurements` skips DOM reads.
- **`shouldAdjustScrollPositionOnItemSizeChange`.** This is an **instance property**, not an option (core:630-636). By default (core:2017-2050):
  - a row's first measurement adjusts the scroll if the row starts above the scroll offset;
  - a re-measurement adjusts only if the row is entirely above the viewport and the user is not scrolling backward;
  - nothing is adjusted during a smooth scroll.

  The default works for dragging. Leave it alone unless you have measured a problem.
- **`anchorTo:'end'` / `followOnAppend`.** A reorder or cross-list insert that changes the first or last key re-anchors `scrollOffset`. In `tanstack-more.mjs`, inserting at index 0 moved the scroll offset from 500 to 550 and caused an extra write in the pre-flush watcher. Sortable lists should keep the default `'start'`.
- **iOS** (ios-gesture.ts). Touch listeners in the capture phase on the scroller mean a touch-drag that starts on a row counts as a "gesture in motion". Scroll corrections are then held (`_holdOffset`) until the gesture ends. During a touch drag on iOS, a size change above the viewport can only be applied at drop. This is low risk but worth knowing.

## 3. VueUse `useVirtualList` (vueuse:7920-8119)

- **Rendering.**
  - `containerProps = {ref, onScroll: calculateRange, style:{overflowY:'auto'}}` (vueuse:7924-7937).
  - `wrapperProps.style = {width:'100%', height: total-offsetTop, marginTop: offsetTop}` (vueuse:8109-8115). The horizontal version uses `display:flex` and `marginLeft` (vueuse:8081-8088).
  - Rows sit in **normal flow**, with no transforms.
- **Item size.**
  - `itemHeight` / `itemWidth` is required, either as a number or as `(index) => number`. There is no DOM measurement, apart from the container's own size through `useElementSize`.
  - With the function form, the offset, distance and total size are all O(n) per call (vueuse:7970-7984, 8005-8010, 8022-8027). At 50k items, prefer a number.
  - The real DOM height, including margins and borders, must equal `itemHeight`.
  - The first index is `floor(scrollTop/h)+1-overscan` (vueuse:7972, 7992). With `overscan:0`, row 0 is never rendered. Keep `overscan ≥ 1`.
- **`list`.**
  - `currentList` is a **deep `ref([])`** of `{data, index}`, where `index` is absolute (vueuse:7942, 7998-8001). `data` is therefore a reactive proxy, not the raw item, so identity comparisons against raw items fail.
  - It is recomputed by `watch([w, h, listRef, totalSize, containerRef])` (vueuse:8011-8021) and on every scroll event.
- **Reorder.** Only a change of array identity or total size triggers a recompute. An in-place splice of a `ref([])` with the same length leaves `list` stale until the next scroll. A draft `computed` that returns a new array works.
- **`scrollTo(index, {behavior, block})`** (vueuse:8041-8066) calls `container.scrollTo` and then `calculateRange()` immediately.
- **Limitations.**
  - There is no `rangeExtractor`, so the active row cannot be pinned.
  - Heights are not measured.
  - The docs key rows by index: `v-for="item in list" :key="item.index"`. On a reorder, every row element is reused for a different item and component state follows the slot, not the item.

## 4. FLIP composition

- **Reuse or remount.** With `:key = item key`, Vue moves the existing elements on a reorder (keyed diff, `insertBefore`), and component instances survive.
  - Element.animate() animations survive a DOM move. CSS transitions do not. In any case, every FLIP pass restarts from a visual snapshot.
  - With index keys, the same component instance receives a new id. FLIP by key still produces the right motion, as long as `makeSortableItem` takes a **getter** `id` and updates the key→element registry before the post-flush measurement. Child pre-watchers run in `updateComponentPreRender`, which is before our post-flush. Focus, local state and animations in progress will still follow the slot rather than the item.
- **Is `translate` safe?**
  - **Positioning.** CSS composes `translate` before `transform` (translate · rotate · scale · transform). It therefore adds to TanStack's `translateY(start)` and to VueUse's `margin-top`, and re-renders that write `transform` or `top` never cancel it.
  - **Measurement.** It changes neither `borderBoxSize` nor `offsetHeight`, so it never triggers TanStack's ResizeObserver and never affects measurements. A custom `measureElement` based on `getBoundingClientRect` would be distorted by `scale`-based FLIP. Animate `translate` only.
- **Pitfalls.**
  - **Absolute rows hide size changes.** With absolutely positioned rows, the siblings of a resized row only move after the ResizeObserver → `notify` → re-render cycle, which comes after our post-flush. Without a second pass, those rows jump.

    The fix is interruptible FLIP. At capture, read visual rects that include the translate currently being animated. At play, compute the layout rect as the rect minus the current computed `translate`, then cancel and restart the animation. Then expose `captureLayout()` and have users call it from `onChange` (adapter:53-56). The adapter calls `triggerRef` before the user's `onChange`, but `triggerRef` only queues a job, so the capture still sees the DOM before the patch.
  - **Placeholder size changes.** Recommend a placeholder of the same size.
    - TanStack measures the new size through its ResizeObserver, keyed by the active key, so the size travels with the item.
    - VueUse needs `itemHeight(i)` to return the placeholder's size for the active index.
  - **ResizeObserver feedback loops.** Never animate height, margin or padding on measured rows. Every frame would trigger the virtualizer's ResizeObserver, a re-layout and possibly scroll corrections, and could produce "ResizeObserver loop" warnings.
  - **Scroll anchoring.** Scroll anchoring is suppressed by changes to `top`, `margin`, `transform`, `position` and similar properties on the path from the anchor node. In flow layouts such as VueUse, however, moving the active row from above the anchor node to below it makes the browser shift `scrollTop`. The hit target changes and the reorder can oscillate. Set `overflow-anchor:none` on the scrollers involved for the duration of a drag. Rows that use absolute positioning inside an in-scroller sizer are still eligible as anchors.
  - **`will-change` and fixed overlays.** WAAPI promotes layers on its own, so don't set `will-change` permanently. Rows with `transform` and scrollers with `contain: strict|paint|layout` become the containing block for `position:fixed` descendants. The overlay must therefore be teleported to `body` and never rendered inside a row.
  - **Ancestor scale.** If an ancestor is scaled (a zoomed board), divide deltas by that scale.

## 5. Auto-scroll inside a virtual container

- **Timing.** A `scrollTop` write fires its `scroll` event at the next rendering step. TanStack recomputes the range on that event (core:1070-1203). New rows therefore mount about one frame after our write, and overscan has to cover that frame: `overscan × minRowSize ≥ max px/frame + one row`. In practice use 5-10.
- **`isScrolling`.** It stays true during auto-scroll (debounced over 150 ms, core:209-219). This skips synchronous measurement of new rows, so the ResizeObserver handles them; that is why `captureLayout` is needed.
- **Scroll corrections on size change.**
  - TanStack: yes. Rows mounting above the viewport during an upward auto-scroll get their first measurement, and TanStack corrects `scrollTop` by `actual − estimate` (core:2019-2023, 917-967). The library's auto-scroll must use **relative** steps each frame (`scrollBy` or `scrollTop += d`, read fresh) and never an absolute target, or it will fight these corrections.
  - VueUse: no corrections, apart from native scroll anchoring.
- **Hit-testing.**
  - Consider only mounted, registered rows.
  - Clip each rect to the visible rects of its scroll ancestors. Overscan rows lie outside the viewport, and a "closest" algorithm could otherwise pick them.
  - Recompute on pointermove, on any ancestor `scroll` (capture listener on `window`), and after any flush that mounted or unmounted rows.
  - Drop an "over" id whose row has unmounted.
  - Subtract the translate being animated, as designed.

## 6. Kanban with virtual columns

- **Cross-list move.** Apply the cross-list move to both drafts in one tick, so there is one flush and one FLIP pass. Column A's row unmounts and column B mounts a new row component with the same id. Neither may end the drag:
  - drag state lives in the store;
  - attach pointer and keyboard listeners to `document`, with no pointer capture on rows;
  - call `focus({preventScroll:true})`.
- **FLIP.** Snapshot "first" rects **globally by key**, so siblings in both columns animate. For the active row entering B, either skip FLIP or fade it in. Otherwise it slides in from A's rect and is clipped by B's scroller, while the user is watching the overlay anyway.
- **Measuring in B.** The new key has no cached size, so B uses `estimateSize` until it is measured.
  - If B is not scrolling, the function-ref `measureElement` reads `offsetHeight` during the patch. TanStack's `notify` re-queues the component's render job in the same flush, before the post-flush callbacks.
  - If B is auto-scrolling, the ResizeObserver measures it later. Either rely on `captureLayout`, or have `estimateSize(i)` return the active item's known size: `arr[i].id === activeKey ? activeSize : 48`. The library should expose `activeSize`.
- **Insertion index off-screen.** An insertion index set by the pointer is always next to a visible row that is hovered. It only goes off-screen if B is scrolled afterwards, or during keyboard moves. TanStack can pin it with B's `activeIndex`, while A's becomes −1. In VueUse the row unmounts, and the library must not care.
- **Drop target.** After the commit, look up the row by key.
  - If it is **mounted and its rect intersects the visible clip of its scroll ancestors**, fly the overlay to it. A row that is pinned but off-screen is mounted yet invisible.
  - Otherwise, fade the overlay out.
  - Re-check the target during the first 1-2 frames, or through `captureLayout`. A placeholder turning back into the real item resizes the row through the ResizeObserver after our post-flush.
  - TanStack could also give a virtual rect: the item's `start` in `measurementsCache[index]` − `scrollOffset` + the scroller's rect. This is an optional adapter hook.
- **Empty or short column.** TanStack renders a sizer with height 0. The sortable container should be the scroller or its parent, with a `min-height`.

## 7. Prior art

- **dnd-kit (new `@dnd-kit/react`).** The official virtualized example uses TanStack (`useWindowVirtualizer` and container variants).
  - `getItemKey: (i) => items[i]`.
  - Reorders in `onDragOver` with `move()` and restores a snapshot on cancel.
  - Uses a flow block translated by `translateY(first.start)`.
  - Uses the `Feedback` plugin with `'clone'` "so the preview stays visible when the source scrolls out".
  - In React the inline `getItemKey` is a new closure on every render, which hides the memo trap that Vue users will hit.
- **dnd-kit (legacy).**
  - On the overlay: "If your useDraggable items are within a virtualized list, you will absolutely want to use a drag overlay… the original drag source can unmount". The overlay "should remain mounted… If you conditionally render the `<DragOverlay>`, drop animations will not work".
  - On strategies: `rectSortingStrategy` "does not support virtualized lists". The vertical and horizontal strategies do.
  - Issues #825/#1728: with virtualized lists (virtuoso, react-window, TanStack), the scroll jumps on drop after auto-scroll, often "to the initial scroll position". Workarounds were `autoScroll={{ layoutShiftCompensation: false }}`, disabling auto-scroll or patching `DragOverlay` scroll-into-view.

  The lesson: never scroll to compensate a layout shift, never call `scrollIntoView` and never call `focus()` without `preventScroll` around drag start or drop.
- **@hello-pangea/dnd (react-beautiful-dnd).**
  - Requires `mode="virtual"`.
  - Requires `renderClone`, because "the original dragging item can be unmounted during a drag".
  - Requires overscan ≥ 1.
  - Users must "insert the space for us" by rendering one extra item (`itemCount + 1`) while a foreign item hovers, because the virtual height comes from count × size.

  Our draft order inserts the active key into the target list, so the count grows on its own.
- **SortableJS / vue-draggable-plus.** These move DOM nodes, which fights the virtualizer's rendering. Users report the dragged item vanishing when a virtual list re-renders (Framework7 forum). No virtual support exists. The forks that work (mfuu's `vue-virtual-sortable` / `vue3-virtual-drag-list`, built on `sortable-dnd`) own both the virtualizer and the dragging, with `dataKey`, `keeps` and `buffer`.

  The lesson: a data-driven reorder plus keys is the only way to stay agnostic of the virtualizer.
- **TanStack #1063.** Stale lane measurements after a lanes change, fixed in 3.13.14 and 3.19.0.

---

## Integration sketches

The hypothetical API is extended with three proposals:
- `activeIndex`: the active key's index in this list's draft, or −1;
- `activeSize`;
- `captureLayout()`.

`makeSortableItem` takes `id` as a getter.

### TanStack Virtual (single list)

```vue
<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue'
import { useVirtualizer, defaultRangeExtractor, type Range } from '@tanstack/vue-virtual'
import { makeSortableList } from 'vue-dnd-kit'
import Row from './Row.vue'

const list = shallowRef<Task[]>(makeTasks(50_000))      // shallow: no deep proxies for 50k
const scrollRef = useTemplateRef<HTMLElement>('scroll')
const { items, activeIndex, captureLayout } =
  makeSortableList(scrollRef, { items: list, getKey: (t) => t.id })

const virtualizer = useVirtualizer(computed(() => {
  const arr = items.value                 // new array per reorder -> options re-evaluate
  const pin = activeIndex.value
  return {
    count: arr.length,
    getScrollElement: () => scrollRef.value,
    estimateSize: () => 48,
    overscan: 8,
    getItemKey: (i: number) => arr[i]!.id, // fresh closure: measurements follow keys
    rangeExtractor: (r: Range) => {        // fresh closure: pin updates
      const idx = defaultRangeExtractor(r)
      return pin < 0 || idx.includes(pin) ? idx : [...idx, pin].sort((a, b) => a - b)
    },
    onChange: () => captureLayout(),       // FLIP relayouts caused by ResizeObserver
  }
}))
const rows = computed(() => virtualizer.value.getVirtualItems())
</script>

<template>
  <div ref="scroll" style="height: 600px; overflow: auto; contain: strict">
    <div :style="{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }">
      <!-- positioning wrapper owned by the virtualizer; sortable element inside -->
      <div
        v-for="row in rows" :key="row.key" :data-index="row.index"
        :ref="(el) => virtualizer.measureElement(el as HTMLElement | null)"
        :style="{ position: 'absolute', top: 0, left: 0, width: '100%',
                  transform: `translateY(${row.start}px)` }"
      >
        <Row :item="items[row.index]!" />
      </div>
    </div>
  </div>
</template>
```

```vue
<!-- Row.vue -->
<script setup lang="ts">
const props = defineProps<{ item: Task }>()
const el = useTemplateRef<HTMLElement>('el')
const { isDragging } = makeSortableItem(el, { id: () => props.item.id })
</script>
<template><div ref="el" class="row" :class="{ placeholder: isDragging }">{{ item.title }}</div></template>
```

### VueUse useVirtualList

```vue
<script setup lang="ts">
const list = shallowRef<Task[]>(makeTasks(50_000))
const listEl = useTemplateRef<HTMLElement>('listEl')    // outer element = sortable container
const { items } = makeSortableList(listEl, { items: list, getKey: (t) => t.id })
const { list: visible, containerProps, wrapperProps } =
  useVirtualList(items, { itemHeight: 48, overscan: 8 })  // number: O(1) math; placeholder must be 48px
</script>

<template>
  <div ref="listEl">
    <div v-bind="containerProps" style="height: 600px">
      <div v-bind="wrapperProps">
        <!-- key by id, NOT item.index as in the VueUse docs; data is a reactive proxy -->
        <Row v-for="{ data } in visible" :key="data.id" :item="data" style="height: 48px; box-sizing: border-box" />
      </div>
    </div>
  </div>
</template>
```

### Kanban column (TanStack)

The sketch is the same as the single list with `group: 'board'`. There are two additions. `estimateSize` uses the active item's size, so a foreign item gets the right size right away:

```ts
const { items, activeIndex, activeSize, captureLayout } =
  makeSortableList(colRef, { items: toRef(props.column, 'tasks'), getKey: (t) => t.id, group: 'board' })
// inside the options computed (capture reactive values once, like `arr`):
const ai = activeIndex.value, size = activeSize.value
estimateSize: (i) => (i === ai && size) ? size.height : 72,
```

`colRef` wraps the scroller and has a `min-height`, so empty columns still accept drops.

---

## Contract

### The library must…

1. **New array per reorder.** Return a **new array identity** for the draft on every reorder, never mutate it in place, and apply cross-list moves to both drafts atomically in one tick. TanStack's memo and VueUse's watch both depend on array identity.
2. **Identify items by key only.** Use `getKey` only, never object identity (VueUse hands out reactive proxies) and never the index. Accept `id` in `makeSortableItem` as a getter and update the registry before the post-flush measurement.
3. **Interruptible FLIP.**
   - Snapshot visual rects globally by key, including the translate currently being animated.
   - At play, layout rect = rect − the current computed `translate`.
   - Batch all reads before any writes.
   - Cancel and restart animations.
   - Animate `translate` only.
4. **Expose `captureLayout()`.** It is idempotent per tick and plays after the next flush (`nextTick`). Users call it for layout changes the library did not cause, such as virtualizer ResizeObserver passes. While nothing is being dragged or animated, it must cost nothing.
5. **Re-check targets.** Re-check FLIP and drop targets for 1-2 frames after starting, or via `captureLayout`, because ResizeObserver measurements can land after the post-flush.
6. **Treat any unmount as normal,** including the active row and the source row.
   - Keep drag state in the store.
   - Attach pointer and keyboard listeners to `document`, with no pointer capture on rows.
   - Use `focus({preventScroll:true})`.
   - Never call `scrollIntoView` and never compensate layout shifts by scrolling on drop.
7. **Teleport the overlay to `body`.** Rows with `transform` and scrollers with `contain` capture `position:fixed`.
8. **Hit-testing.** Use mounted items only. Clip their rects by the visible rects of their scroll ancestors. Recompute on pointermove, on scroll (capture) and on registry changes. Discard an "over" id that has unmounted.
9. **Auto-scroll.** Use relative per-frame steps read fresh each frame (`scrollBy`), support window scrolling, and stop at the edges.
10. **Scroll anchoring.** Set `overflow-anchor:none` on involved scrollers during a drag and restore it afterwards.
11. **Expose per-list state:** `activeIndex`, `activeKey` and `activeSize`.
12. **Drop.** Commit to the user's Ref, and make the FLIP pass a no-op when the order is unchanged. Fly to the target if it is mounted and visible, otherwise fade out.
13. **Performance.** Do at most O(n) work per reorder. Keep no reactive state for unmounted items. Never deep-traverse user data. 50k items is fine: about 1 ms for a TanStack rebuild plus the array copy.
14. **Optional adapter hooks:**
    - `scrollToKey(key)` for keyboard sorting, mapping to `virtualizer.scrollToIndex` or VueUse's `scrollTo`;
    - `getVirtualRect(key)` for unmounted drop targets.

### The user must…

1. **Render the draft `items` everywhere,** including `count` and `getItemKey`.
2. **Key rows by item key.**
   - TanStack: `:key="row.key"`, with `getItemKey` returning the same key as `getKey`.
   - VueUse: `:key="data.id"`.
   - Never key by index.
3. **TanStack: pass options as a `computed`** that reads `items.value` once and creates the `getItemKey` and `rangeExtractor` closures inside it. Passing a plain object, as the official Vue examples do, never updates `count`.
4. **TanStack, dynamic sizes:**
   - Put `data-index` and a function-ref `measureElement` on the positioned element.
   - Prefer this to `onUpdated(measureAll)`.
   - Make `estimateSize` close to the real size.
   - Leave `useAnimationFrameWithResizeObserver` off.
5. **Positioning.** Use per-row absolute positioning when pinning. The flow-block pattern is more FLIP-friendly but cannot pin rows outside the range.
6. **Wire `onChange: () => captureLayout()`** with TanStack.
7. **Overscan.** Use ≥ 5, sized to `max auto-scroll px/frame ÷ min row size + 1` and to the largest single shift, so rows mount outside the viewport. VueUse needs ≥ 1.
8. **Placeholder.** Keep it the same size as the item. Otherwise VueUse needs `itemHeight(i)` to return the placeholder's size for the active index, and TanStack rows must be measured.
9. **VueUse:** make `itemHeight` exact, including margins and borders, with no unaccounted gaps. Prefer a number at 50k items.
10. **Don't animate row size,** don't put `will-change` on scrollers, and don't render the overlay inside rows.
11. **TanStack:** keep `anchorTo:'start'` for sortable lists, and use version 3.19 or later if you use `lanes`.
12. **Large lists:** use `shallowRef` for large data arrays.

## Open questions for implementation

- The FLIP play and the virtualizer's own post-flush work are both queued as post-flush callbacks. Their relative order is decided by component uid, so `captureLayout` should be treated as required, not optional.
- Should the library auto-detect relayouts with its own ResizeObserver on registered items while dragging? It would run in creation order relative to TanStack's ResizeObserver, which is fragile. An explicit hook is simpler.
- iOS touch-drag holds TanStack's corrections until touchend. The drop target can therefore shift by `_holdOffset` right after drop, which is another reason to re-check the target over 1-2 frames.
