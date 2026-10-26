# Virtual lists (TanStack Virtual, VueUse useVirtualList)

Sorting is data-driven: the draft `items` is a new array on every reorder, rows are
keyed by item key, and FLIP only needs the mounted rows. Any virtualizer that renders
from an array works. The active row may unmount when it scrolls away. The drag survives
it, because the overlay keeps showing it.

## Rules

1. Feed the virtualizer the **draft `items`**, not your source array.
2. **Key rows by item key**, never by index (the official TanStack and VueUse examples key by index).
3. Pass item ids to `makeSortableItem` as a **getter**: `{ id: () => props.item.id }`.
4. Use **`shallowRef`** for big arrays.
5. Keep the placeholder the same size as the row.
6. Overscan of at least 5 rows (VueUse: at least 1), so rows mount before auto-scroll reaches them.
7. Don't animate row height, margin or padding, and don't put `will-change` on scrollers.

## TanStack Virtual

```vue
<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue';
import { defaultRangeExtractor, useVirtualizer, type Range } from '@tanstack/vue-virtual';
import { makeSortableList } from '@vue-dnd-kit/core';
import Row from './Row.vue';

const ROW = 40;
const tasks = shallowRef(makeRows(10_000));
const scrollRef = useTemplateRef<HTMLElement>('scroll');
const { items, activeIndex, captureLayout } = makeSortableList(scrollRef, { items: tasks });

// Options as ONE computed that reads the draft once: TanStack memoises measurements and
// the range on the identity of getItemKey/rangeExtractor, so they must be new closures
// after every reorder.
const virtualizer = useVirtualizer(
  computed(() => {
    const arr = items.value;
    const pin = activeIndex.value;
    return {
      count: arr.length,
      getScrollElement: () => scrollRef.value,
      estimateSize: () => ROW,
      overscan: 8,
      getItemKey: (index: number) => arr[index]!.id,
      // Keep the dragged row mounted while it is scrolled out of range.
      rangeExtractor: (range: Range) => {
        const indexes = defaultRangeExtractor(range);
        return pin < 0 || indexes.includes(pin) ? indexes : [...indexes, pin].sort((a, b) => a - b);
      },
      // Re-measures land after the library's FLIP pass: animate them too.
      onChange: () => captureLayout(),
    };
  }),
);
const rows = computed(() => virtualizer.value.getVirtualItems());
const measure = (el: unknown) => virtualizer.value.measureElement(el as HTMLElement | null);
</script>

<template>
  <div ref="scroll" style="height: 600px; overflow: auto; contain: strict">
    <div :style="{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }">
      <div
        v-for="row in rows"
        :key="(row.key as string)"
        :ref="measure"
        :data-index="row.index"
        :style="{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${row.start}px)` }"
      >
        <Row :item="items[row.index]!" />
      </div>
    </div>
  </div>
</template>
```

- Pinning the dragged row needs per-row absolute positioning, as above.
- Keep `anchorTo: 'start'` (the default). Use `@tanstack/vue-virtual` ≥ 3.19 if you use `lanes`.
- Kanban columns: also use `activeSize` in `estimateSize`, so a card coming from another
  column gets its real height right away:
  `estimateSize: (i) => (i === pin && size ? size.height : 72)`, with `const size = activeSize.value` read in the computed.

## VueUse useVirtualList

```vue
<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { useVirtualList } from '@vueuse/core';
import { makeSortableList } from '@vue-dnd-kit/core';

const ROW = 40;
const tasks = shallowRef(makeRows(10_000));
// The OUTER element is the sortable container: containerProps owns the scroller's ref.
const listRef = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(listRef, { items: tasks });
// A number keeps VueUse's math O(1); it must equal the real row height (borders, margins included).
const { list, containerProps, wrapperProps } = useVirtualList(items, { itemHeight: ROW, overscan: 8 });
</script>

<template>
  <div ref="list">
    <div v-bind="containerProps" style="height: 600px">
      <div v-bind="wrapperProps">
        <!-- Key by id, not by index as in the VueUse docs; `data` is a reactive proxy. -->
        <Row v-for="{ data } in list" :key="data.id" :item="data" :style="{ height: `${ROW}px` }" />
      </div>
    </div>
  </div>
</template>
```

VueUse can't pin the dragged row. It unmounts when scrolled away, and that's fine.

## Trees

`makeSortableTree` returns a flat `items` of visible rows. Virtualize it like a list,
keyed by `node.key`. `activeKey` and `activeIndex` name the row to keep mounted.
