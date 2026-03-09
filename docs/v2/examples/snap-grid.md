# Snap to Grid

Use the `grid` prop on `DragPreview` to snap the floating preview to a pixel grid while dragging.

<script setup>
import Example from '@examples-v2/SnapGrid/Example.vue';
</script>

<Example />

## How it works

Pass `:grid` to `DragPreview` inside the `#preview` slot of `DnDProvider`:

```vue
<DnDProvider>
  <template #preview>
    <!-- uniform 40 × 40 px grid -->
    <DragPreview :grid="40" />
  </template>
</DnDProvider>
```

For independent per-axis control, pass an object:

```vue
<DnDProvider>
  <template #preview>
    <!-- 80 px horizontal, 40 px vertical -->
    <DragPreview :grid="{ x: 80, y: 40 }" />
  </template>
</DnDProvider>
```

::: tip
Grid snapping is purely visual — it affects only the rendered position of the `DragPreview`. The underlying pointer coordinates and drop logic are unchanged. Use `suggestSort` / `suggestSwap` in `onDrop` as usual.
:::

## See also

- [DragPreview](/v2/guide/core/drag-preview) — full `grid` prop reference.
- [Constraint Area](/v2/examples/constraint-area) — axis lock and `restrictToArea` in detail.

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/SnapGrid/Example.vue)
- [SnapChip.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/SnapGrid/SnapChip.vue)
- [GridCanvas.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/SnapGrid/GridCanvas.vue)
