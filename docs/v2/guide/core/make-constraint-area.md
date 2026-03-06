# makeConstraintArea

`makeConstraintArea` marks an element as a constraint area: drag movement can be limited to an axis or kept inside this element's bounds. It must be used inside a [DnDProvider](/v2/guide/core/dnd-provider). Throws if the provider is not found.

## Signature

```ts
makeConstraintArea(ref, options?): {}
```

- **`ref`** — template ref to the container element. The element is registered on mount and unregistered on unmount.
- **`options`** — optional. Defaults: `axis: 'both'`, `restrictToArea: false`.

Returns an empty object (reserved for future use).

---

## Options

| Option           | Type                          | Description |
|-----------------|-------------------------------|-------------|
| `axis`          | `'x' \| 'y' \| 'both' \| Ref<TDragAxis>` | Restrict drag to this axis. Default: `'both'`. |
| `restrictToArea`| `boolean \| Ref<boolean>`      | When `true`, confine the drag to the constraint area bounds. Default: `false`. |

---

## See also

- [makeDraggable](/v2/guide/core/make-draggable) — elements that are constrained when dragging.
- [DnDProvider](/v2/guide/core/dnd-provider) — provider.
- [Constraint Area examples](/v2/examples/constraint-area) — live demos.
