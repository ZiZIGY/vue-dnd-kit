# makeSelectionArea

`makeSelectionArea` turns an element into a box-selection region. Selection starts when the user presses the modifier key(s) and drags inside this element; draggable items that match `groups` and intersect the box are selected. It must be used inside a [DnDProvider](/v2/guide/core/dnd-provider).

## Signature

```ts
makeSelectionArea(ref, options?): { isSelecting, style }
```

- **`ref`** — template ref to the container element (e.g. the area where selection happens). The element is registered on mount and unregistered on unmount.
- **`options`** — optional config. Omitted options use defaults where applicable.

Returns:

- **`isSelecting`** — `ComputedRef<boolean>`. `true` while this area is the active selection (pointer down + drag with modifier).
- **`style`** — `ComputedRef<CSSProperties>`. CSS for the selection box (position, size). Use it on a div (e.g. overlay) to draw the box; when not selecting, it is `{}`.

---

## Options

Extends **base options**:

| Option      | Type                      | Description |
|------------|----------------------------|-------------|
| `disabled` | `boolean \| Ref<boolean>`  | When true, this area does not start selection. |
| `groups`   | `string[] \| Ref<string[]>`| Groups for matching draggables (same group = can be selected). |

**Selection-area specific:**

| Option     | Type | Default | Description |
|------------|------|---------|-------------|
| `modifier` | `{ keys: TModifierKeys \| Ref<TModifierKeys>, method: TModifierMethod \| Ref<TModifierMethod> }` | `{ keys: ['ControlLeft'], method: 'every' }` | Key(s) that must be held to start selection. |
| `strategy` | `'toggle' \| 'select'` | `'toggle'` | How intersecting elements are added to the selection. See [Strategy](#strategy). |
| `events`   | `ISelectableAreaEvents` | — | Callback when selection ends. See [Events](#events). |

---

## Strategy

Controls how the selection box updates `selectedSet` as the user drags:

| Value | Behaviour |
|-------|-----------|
| `'toggle'` | **XOR** against the selection that existed when the drag started (`selectionBase`). Dragging back over an already-selected element deselects it. Useful for additive / subtractive multi-select. |
| `'select'` | Only elements **currently inside** the box are selected. Moving the box away from an element immediately deselects it. Clean, non-additive behaviour. |

```ts
// Additive toggle (default)
makeSelectionArea(el, { strategy: 'toggle' });

// Simple "only what's in the box right now"
makeSelectionArea(el, { strategy: 'select' });
```

---

## Events

| Callback     | Description |
|-------------|-------------|
| `onSelected`| Called when selection ends (pointer up) with the list of selected elements: `(selected: HTMLElement[]) => void`. |

---

## See also

- [makeDraggable](/v2/guide/core/make-draggable) — elements that can be selected (same `groups`).
- [DnDProvider](/v2/guide/core/dnd-provider) — provider and groups.
