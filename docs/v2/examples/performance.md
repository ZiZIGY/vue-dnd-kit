# Performance

Vue DnD Kit is designed to stay fast at scale. Use the controls below to load up to **5 000 items** and compare two rendering strategies.

<script setup>
import Example from '@examples-v2/Performance/Example.vue';
</script>

## Demo

<Example />

Switch between **Raw** and **Virtualized** modes, crank the count to 2 000 or 5 000, and watch the FPS counter while you drag.

## Raw rendering

Every item is mounted as a real DOM node. Each one registers a `makeDraggable` observer. With 100–500 items this is perfectly smooth. At 2 000+ you may notice the frame-rate dip during fast drag moves as the browser has to hit-test thousands of elements.

```ts
// All N items rendered — makeDroppable on the scroll container
const el = useTemplateRef<HTMLElement>('el');
makeDroppable(el, { events: { onDrop } }, () => items.value);
makeAutoScroll(el, { threshold: 60, speed: 1.5 });
```

```html
<div ref="el" class="list">
  <div v-for="(item, index) in items" :key="item.id" style="height: 44px">
    <PerfItem :index="index" :items="items" :item="item" />
  </div>
</div>
```

## Virtualized rendering

Only the **visible slice** of items is in the DOM (≈ 10–15 nodes regardless of total count). [`useVirtualList`](https://vueuse.org/core/useVirtualList/) from VueUse handles the scroll offset math; `makeDroppable` and `makeAutoScroll` are registered on the same container ref.

```ts
import { useVirtualList } from '@vueuse/core';

const ITEM_HEIGHT = 44;

const { list, containerProps, wrapperProps } = useVirtualList(
  toRef(props, 'items'),
  { itemHeight: ITEM_HEIGHT, overscan: 5 }
);

// containerProps.ref points to the scrollable element
makeDroppable(containerProps.ref, { events: { onDrop } }, () => props.items);
makeAutoScroll(containerProps.ref, { threshold: 60, speed: 1.5 });
```

```html
<div v-bind="containerProps" class="virtual-list">
  <div v-bind="wrapperProps">
    <!--
      item.index is the REAL index in the full array.
      suggestSort uses it correctly even though only a window is rendered.
    -->
    <div
      v-for="{ data, index } in list"
      :key="data.id"
      :style="{ height: ITEM_HEIGHT + 'px' }"
    >
      <PerfItem :index="index" :items="props.items" :item="data" />
    </div>
  </div>
</div>
```

### Key points

- `item.index` from `useVirtualList` is the **real** index in the backing array — pass it to `makeDraggable` so `suggestSort` operates on the correct position.
- `makeDroppable` is on the **container**, not on individual items. Hovering over a visible `makeDraggable` item still sets `hoveredDraggable`, so `suggestSort('vertical')` resolves correctly.
- Pass `id: item.id` to `makeDraggable` so the library can identify the item across unmount/remount cycles. When the element scrolls back into view, drag state (including drop) is correctly transferred to the new DOM node. See [Virtual lists](/v2/guide/core/make-draggable#virtual-lists).
- Items that scroll out of view are unmounted and their observers cleaned up automatically. The drag ghost lives in the `DnDProvider` overlay so it persists even when the source element unmounts.

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Performance/Example.vue)
- [RawList.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Performance/RawList.vue)
- [VirtualList.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Performance/VirtualList.vue)
- [PerfItem.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Performance/PerfItem.vue)
