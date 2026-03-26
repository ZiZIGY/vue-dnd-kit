# Changelog

## v2.3.0 <span style="font-size:0.6em;font-weight:400;color:var(--vp-c-text-3);margin-left:0.5rem">2026-03-26</span>

### New feature — stable `id` for virtual lists

`makeDraggable` now accepts an optional `id` option:

```ts
makeDraggable(el, { id: item.id }, () => [index, items]);
```

**Why it exists.** In a virtualized list (e.g. `@vueuse/core` `useVirtualList`) items are unmounted when they scroll out of view and remounted when they scroll back. Without a stable id, the library had no way to know that the freshly mounted `<div>` is the same item that is currently being dragged — so it appeared as a second, ghost-like hover target. Drop also failed after a scroll-away/scroll-back cycle because the internal reference to the initiating element went stale.

**How it works.** The id is written to a `data-dnd-kit-draggable` attribute on the element. Even after an unmount/remount cycle, the library reads this attribute, scans `draggingMap` for a matching id, and seamlessly remaps the entry to the new DOM node. No user action required — just pass `id`.

```ts
// Survives unmount → remount while dragging
const { isDragging } = makeDraggable(el, { id: props.item.id }, () => [
  props.index,
  props.items,
]);
```

`id` is optional. If omitted a random id is generated (same behavior as before, virtual lists just didn't work reliably).

→ [Performance example](/v2/examples/performance) — live demo with 200 virtualised items
→ [makeDraggable — option `id`](/v2/guide/core/make-draggable#options)

---

### New export — `injectionKey`

`injectionKey` is now part of the public API:

```ts
import { injectionKey } from '@vue-dnd-kit/core';
```

This is the Vue injection key under which `DnDProvider` stores its internal context. It is intended for **advanced or non-standard use cases** — for example:

- Bridging a separately mounted Vue app (e.g. a shadow root) into the same DnD context
- Building custom integrations that need direct access to the internal provider
- Exploring or debugging what the library holds internally

For everything standard — reading drag state, pointer position, preview, entities — use `useDnDProvider`. It returns a stable, typed public API and is all you need in 99% of cases.

**`injectionKey` gives you the raw internal provider.** Its shape is not part of the public API contract and may change between minor versions.

→ [injectionKey — advanced use](/v2/guide/core/use-dnd-provider#injectionkey-advanced-use-only)

---

### Bug fix — drop fails after scrolling away while dragging

**Symptom.** Start dragging an item in a virtual list → scroll so the item unmounts → scroll back so it remounts → try to drop — nothing fires.

**Root cause.** `buildDraggedItems` (internal) used `draggingMap.get(initiatingElement)` to look up the active drag. After a remount `initiatingElement` pointed to the old, detached DOM node that was no longer a key in `draggingMap`.

**Fix.** All internal drag-entity lookups now go through `resolveFromDraggingMap`, which first tries the direct map lookup (fast path) and falls back to scanning by the `data-dnd-kit-draggable` attribute id. Because the id is stable across remounts, the correct entity is always found.

---

### Bug fix — remounted item appeared as a duplicate hover target

**Symptom.** After scroll-away/scroll-back the freshly mounted item could be hovered and sorted as if it were a separate item — while the original dragged item was still floating in the overlay.

**Root cause.** On remount, `onMounted` in `makeDraggable` registered the new element in `draggableMap` as a brand-new entry while the old (stale) element was still registered in `draggingMap`. The engine saw two entities with the same data position.

**Fix.** On `onMounted`, if an `id` is provided, the library checks whether an entry with that id already exists in `draggingMap`. If it does (i.e. this item is currently being dragged), the old key is deleted and the new element is inserted in its place. The drag continues normally with no duplication.

---

### Bug fix — full Shadow DOM support

**Two separate bugs were fixed. Together they enable full Shadow DOM support — including cross-boundary drag between a shadow list and a regular list.**

#### Part 1 — drag never started inside a shadow root

**Symptom.** Draggable elements mounted inside a shadow root (`attachShadow`) could not be dragged at all — pointer events were silently ignored and drag never started.

**Root cause.** The library's pointer event listener reads `event.target` to find the draggable element. When a pointer event crosses a shadow root boundary, the browser **re-targets** it — `event.target` becomes the shadow host element (the outer `<div>`), not the actual element the user touched. The host is not registered as a draggable, so the engine did nothing.

**Fix.** All pointer handlers now resolve the real target via `event.composedPath()[0]` instead of `event.target`. `composedPath` returns the full event path including elements inside shadow roots, so the first entry is always the actual element that received the event — even across shadow boundaries.

```ts
// Before
const target = event.target as HTMLElement;

// After — works across shadow root boundaries
const target = (event.composedPath?.()[0] ?? event.target) as HTMLElement;
```

#### Part 2 — one provider for both regular DOM and shadow DOM

**The old approach** wrapped the shadow app in its own `DnDProvider`. This created two completely isolated DnD contexts — drag sessions in the shadow root were invisible to the outer provider and vice versa. Sorting between the two lists was impossible.

**The fix** is to share the outer provider with the inner Vue app via `app.provide` using the newly exported `injectionKey`. Since pointer events from inside the shadow root already reach `document` (where the outer provider listens), and `composedPath()[0]` resolves the real element, all that was missing was the elements being registered in the same maps.

```ts
import { inject } from 'vue';
import { injectionKey } from '@vue-dnd-kit/core';

// Inside a component that is a descendant of the outer DnDProvider:
const outerProvider = inject(injectionKey);

onMounted(() => {
  const shadow = host.attachShadow({ mode: 'open' });
  const container = document.createElement('div');
  shadow.appendChild(container);

  // No DnDProvider wrapper — share the outer provider directly
  createApp({ render: () => h(YourShadowList) })
    .provide(injectionKey, outerProvider)
    .mount(container);
});
```

Result: shadow DOM elements and regular DOM elements participate in the same drag session. You can sort within each list and drag items across the boundary between them.

---

## v2.2.0

- Added grid layout example
- Various stability improvements

## v2.1.0

- `makeSelectionArea` — box-select with multi-drag support
- `makeAutoScroll` — automatic container scroll during drag
- Keyboard navigation (Enter / Space / Arrows / Escape)

## v2.0.0

- Full rewrite. Composable-first API: `makeDraggable`, `makeDroppable`, `makeConstraintArea`, `makeSelectionArea`
- `DnDProvider` as the scope boundary (multiple independent providers on one page)
- `suggestSort`, `suggestSwap`, `suggestCopy`, `suggestRemove` helpers on `event.helpers`
- Touch support
- Zero external dependencies
