# v2.2.0

## What's new

### `DragPreview` — Grid snapping

The `DragPreview` component now accepts a `grid` prop that snaps the floating preview to a pixel grid while dragging.

**Uniform grid:**
```vue
<DragPreview :grid="40" />
```

**Per-axis control:**
```vue
<DragPreview :grid="{ x: 80, y: 40 }" />
```

Snapping is purely visual — underlying pointer coordinates and drop logic are not affected.

## Examples

- [Snap to Grid](https://zizigy.github.io/vue-dnd-kit/v2/examples/snap-grid)

## Changelog

- feat: add `grid` prop to `DragPreview` for snap-to-grid support
