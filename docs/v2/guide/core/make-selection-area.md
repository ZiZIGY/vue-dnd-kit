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

| Option     | Type | Description |
|------------|------|-------------|
| `modifier` | `{ keys: TModifierKeys \| Ref<TModifierKeys>, method: TModifierMethod \| Ref<TModifierMethod> }` | Key(s) that must be held to start selection. Default: `{ keys: ['ControlLeft'], method: 'every' }`. |
| `events`   | `ISelectableAreaEvents` | Callback when selection ends. See [Events](#events). |

---

## Events

| Callback     | Description |
|-------------|-------------|
| `onSelected`| Called when selection ends (pointer up) with the list of selected elements: `(selected: HTMLElement[]) => void`. |

---

## See also

- [makeDraggable](/v2/guide/core/make-draggable) — elements that can be selected (same `groups`).
- [DnDProvider](/v2/guide/core/dnd-provider) — provider and groups.
