# Constraint Area

`makeConstraintArea` limits drag movement to an axis or confines the drag overlay within an element's bounds.

<script setup>
import AreaBoundsExample from '@examples-v2/ConstraintArea/AreaBoundsExample.vue';
import AxisExample from '@examples-v2/ConstraintArea/AxisExample.vue';
</script>

## Restrict to area

The overlay cannot leave the marked container bounds (`restrictToArea: true`).

<AreaBoundsExample />

## Axis lock

Drag movement is locked to a single axis. Left: horizontal only (`axis: 'x'`). Right: vertical only (`axis: 'y'`).

<AxisExample />

## Source

- [AreaBoundsExample.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/ConstraintArea/AreaBoundsExample.vue)
- [AxisExample.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/ConstraintArea/AxisExample.vue)
- [ConstraintBox.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/ConstraintArea/ConstraintBox.vue)

## What's used

- **ConstraintBox** — calls `makeConstraintArea` on its own root element; must be a child of `DnDProvider`.
- **DragChip** — `makeDraggable` with no payload (free drag, no sort logic).
- **`restrictToArea: true`** — overlay stays within the constraint box bounds.
- **`axis: 'x'`** / **`axis: 'y'`** — overlay movement locked to one axis. Each axis demo runs in its own `DnDProvider` to avoid cross-constraints.
