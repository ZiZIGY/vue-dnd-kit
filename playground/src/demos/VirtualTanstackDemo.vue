<script setup lang="ts">
  import { computed, shallowRef, useTemplateRef } from 'vue';
  import { defaultRangeExtractor, useVirtualizer, type Range } from '@tanstack/vue-virtual';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import VirtualRow from '../components/VirtualRow.vue';
  import { describeDrop, makeRows } from '../data';
  import { trackReorders, useBench } from '../bench';

  const props = withDefaults(defineProps<{ count?: number; bench?: boolean }>(), {
    count: 10_000,
    bench: false,
  });

  const ROW = 40;
  // shallowRef: no deep proxies for thousands of items (rfcs/0001-v3.md §12).
  const tasks = shallowRef(makeRows('r', props.count));
  const lastDrop = shallowRef('');
  const scrollRef = useTemplateRef<HTMLElement>('scroll');

  const { items, activeIndex, captureLayout } = makeSortableList(scrollRef, {
    id: 'tanstack',
    items: tasks,
    // `?noautoscroll`: tests that park the pointer past the list edge on purpose.
    autoScroll: !new URLSearchParams(location.search).has('noautoscroll'),
    // Before the write: the new order is in `result`.
    onDrop: (event) => (lastDrop.value = describeDrop(event.result.get(event.to.list) ?? tasks.value, event.keys[0])),
  });

  // The recipe from rfcs/0001-v3/virtualization.md: one computed that reads the draft
  // once, so `getItemKey` and `rangeExtractor` are new closures after every reorder
  // (TanStack memoises measurements and the range on their identity).
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
        // Keep the active row mounted while it is scrolled out of the range.
        rangeExtractor: (range: Range) => {
          const indexes = defaultRangeExtractor(range);
          return pin < 0 || indexes.includes(pin)
            ? indexes
            : [...indexes, pin].sort((a, b) => a - b);
        },
        // Re-measures (ResizeObserver) and range changes after our FLIP pass.
        onChange: () => captureLayout(),
      };
    }),
  );
  const rows = computed(() => virtualizer.value.getVirtualItems());
  const measure = (el: unknown) => virtualizer.value.measureElement(el as HTMLElement | null);

  if (props.bench) trackReorders(useBench(), items);
</script>

<template>
  <section>
    <h2>TanStack Virtual: {{ count.toLocaleString('en-US') }} rows</h2>
    <div
      ref="scroll"
      class="scroller"
      data-testid="tanstack-scroller"
    >
      <div
        class="sizer"
        :style="{ height: `${virtualizer.getTotalSize()}px` }"
      >
        <!-- Positioned by the virtualizer, keyed by id (not by index as in TanStack's examples). -->
        <div
          v-for="row in rows"
          :key="(row.key as string)"
          :ref="measure"
          :data-index="row.index"
          class="slot"
          :style="{ transform: `translateY(${row.start}px)` }"
        >
          <VirtualRow
            :item="items[row.index]!"
            :size="ROW"
          />
        </div>
      </div>
    </div>
    <pre data-testid="tanstack-order">{{ tasks.slice(0, 10).map((task) => task.id).join(',') }}</pre>
    <pre data-testid="tanstack-drop">{{ lastDrop }}</pre>
  </section>
</template>

<style scoped>
  .scroller {
    width: 360px;
    height: 600px;
    overflow: auto;
    contain: strict;
    background: #e5e7eb;
  }

  .sizer {
    position: relative;
    width: 100%;
  }

  .slot {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
</style>
