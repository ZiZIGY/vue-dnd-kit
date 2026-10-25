<script setup lang="ts">
  import { computed, useTemplateRef, type ShallowRef } from 'vue';
  import { defaultRangeExtractor, useVirtualizer, type Range } from '@tanstack/vue-virtual';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import VirtualRow from './VirtualRow.vue';
  import { describeDrop } from '../data';
  import type { Task } from '../types';

  const props = defineProps<{
    column: { id: string; title: string; tasks: ShallowRef<Task[]> };
    onDropped?: (text: string) => void;
  }>();

  const CARD = 56;
  const scrollRef = useTemplateRef<HTMLElement>('scroll');
  const { items, activeIndex, activeSize, captureLayout } = makeSortableList(scrollRef, {
    id: props.column.id,
    items: props.column.tasks,
    group: 'board',
    // Before the write: the new order is in `result`.
    onDrop: (event) =>
      props.onDropped?.(
        `${props.column.id}:${describeDrop(event.result.get(event.to.list) ?? props.column.tasks.value, event.keys[0])}`,
      ),
  });

  const virtualizer = useVirtualizer(
    computed(() => {
      const arr = items.value;
      const pin = activeIndex.value;
      const size = activeSize.value;
      return {
        count: arr.length,
        getScrollElement: () => scrollRef.value,
        // A card entering from another column gets its real size before it is measured.
        estimateSize: (index: number) => (index === pin && size ? size.height : CARD),
        overscan: 6,
        getItemKey: (index: number) => arr[index]!.id,
        rangeExtractor: (range: Range) => {
          const indexes = defaultRangeExtractor(range);
          return pin < 0 || indexes.includes(pin)
            ? indexes
            : [...indexes, pin].sort((a, b) => a - b);
        },
        onChange: () => captureLayout(),
      };
    }),
  );
  const rows = computed(() => virtualizer.value.getVirtualItems());
  const measure = (el: unknown) => virtualizer.value.measureElement(el as HTMLElement | null);
</script>

<template>
  <div class="column">
    <h3>{{ column.title }}</h3>
    <div
      ref="scroll"
      class="scroller"
      :data-testid="`column-${column.id}`"
    >
      <div
        class="sizer"
        :style="{ height: `${virtualizer.getTotalSize()}px` }"
      >
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
            :size="CARD"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .column {
    width: 280px;
  }

  .column h3 {
    margin: 0 0 8px;
  }

  .scroller {
    height: 480px;
    overflow: auto;
    contain: strict;
    background: #e5e7eb;
    border-radius: 8px;
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
