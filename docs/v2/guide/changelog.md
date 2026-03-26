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

### Bug fix — drag did not start inside a Shadow DOM

**Symptom.** Draggable elements mounted inside a shadow root (`attachShadow`) could not be dragged at all — pointer events were silently ignored and drag never started.

**Root cause.** The library's pointer event listener reads `event.target` to find the draggable element. When a pointer event crosses a shadow root boundary, the browser **re-targets** it — `event.target` becomes the shadow host element (the outer `<div>`), not the actual element the user touched. The host is not registered as a draggable, so the engine did nothing.

**Fix.** All pointer handlers now resolve the real target via `event.composedPath()[0]` instead of `event.target`. `composedPath` returns the full event path including elements inside shadow roots, so the first entry is always the actual element that received the event — even across shadow boundaries.

```ts
// Before
const target = event.target as HTMLElement;

// After — works across shadow root boundaries
const target = (event.composedPath?.()[0] ?? event.target) as HTMLElement;
```

Shadow DOM usage requires mounting a dedicated `DnDProvider` inside the shadow root, since the shadow tree is isolated from the outer document:

```ts
const ShadowApp = defineComponent({
  setup: () => () => h(DnDProvider, null, () => h(YourShadowList)),
});

onMounted(() => {
  const shadow = host.attachShadow({ mode: 'open' });
  const container = document.createElement('div');
  shadow.appendChild(container);
  createApp(ShadowApp).mount(container);
});
```

---
