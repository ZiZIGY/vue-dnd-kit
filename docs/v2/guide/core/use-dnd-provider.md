# useDnDProvider

`useDnDProvider` returns the current DnD context (the same object that [DnDProvider](/v2/guide/core/dnd-provider) provides). Use it in any descendant of `DnDProvider` when you need access to overlay, pointer, state, entities, keyboard, or collision. Must be called inside a provider; otherwise the internal inject fails.

## Signature

```ts
useDnDProvider(): IDnDProviderExternal
```

Returns **`IDnDProviderExternal`** — the public provider API.

---

## Return value

| Property          | Type | Description |
|-------------------|------|-------------|
| `state`           | `Ref<TDnDState \| undefined>` | Current phase: `'dragging'`, `'selecting'`, `'activating'`, or `null` / `undefined`. |
| `pointer`         | `Ref<TPointerState \| undefined>` | Pointer state (start/current coordinates, etc.). |
| `entities`        | `Reactive<IEntities>` | Maps and sets: draggableMap, droppableMap, selectingArea, visibleDraggableSet, etc. |
| `keyboard`        | `{ keys, step, moveFaster }` | `keys.pressedKeys`, `keys.forDrag`, `forCancel`, `forDrop`, `forMove`, `forMoveFaster`; step sizes for keyboard drag. |
| `scrollPosition`  | `Reactive<ICoordinates>` | Current scroll (used for overlay/constraints). |
| `delay`           | `Reactive<IDelay>` | Activation delay progress (`progress`, `startTime`). |
| `distanceProgress`| `ComputedRef<number>` | Progress of distance-based activation (0–1). |
| `overlay`         | `{ ref, style, size, render }` | Overlay element ref, style (position), size, and optional custom render component. |
| `hovered`         | `IHovered` | `{ draggable: THoveredMap, droppable: THoveredMap }` — elements under cursor during drag. |
| `collision`       | `{ run?, throttle }` | Custom collision detection and throttle. |

---

## See also

- [DnDProvider](/v2/guide/core/dnd-provider) — setup and overlay slot.
- [makeDraggable](/v2/guide/core/make-draggable), [makeDroppable](/v2/guide/core/make-droppable) — use the same context via the provider.
