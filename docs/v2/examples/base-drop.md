# Base Drop

Default drop and drag: one draggable element, two zones (outer and inner). On drop we set a ref so the element is shown inside the zone that received it (rendered with `v-if`).

<script setup>
import Example from '@examples-v2/BaseDrop/Example.vue';
</script>

## Demo

<Example />

## Source

- [Base Drop example component](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/BaseDrop/Example.vue)

## What’s used

- **DnDProvider** — wraps the example.
- **Zone** — `makeDroppable`, emits `drop`; highlights on enter/leave.
- **DraggableItem** — `makeDraggable` on a template ref.
- **Ref** `droppedZone` — `null` | `'outer'` | `'inner'`; on drop the zone sets it, and the item is rendered with `v-if` in that zone or in the start area.
