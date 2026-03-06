# Auto Scroll

`makeAutoScroll` automatically scrolls a container when the drag overlay center approaches its edges.

<script setup>
import Example from '@examples-v2/AutoScroll/Example.vue';
</script>

## Demo

Drag an item near the top or bottom edge of the list to trigger auto-scroll.

<Example />

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/AutoScroll/Example.vue)
- [ScrollList.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/AutoScroll/ScrollList.vue)
- [SortItem.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/AutoScroll/SortItem.vue)

## What's used

- **ScrollList** — `makeDroppable` + `makeAutoScroll(ref, { threshold: 60, speed: 1.5 })` on the same element. The container border highlights when `isScrolling` is `true`.
- **SortItem** — `makeDraggable` with `[index, items]` payload; shows placement indicators on `isDragOver`.
- **`suggestSort('vertical')`** — reorders items on drop.
