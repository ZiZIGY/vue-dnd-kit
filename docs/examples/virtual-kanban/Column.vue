<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { defaultRangeExtractor, useVirtualizer, type Range } from '@tanstack/vue-virtual';
import { makeSortableList } from '@vue-dnd-kit/core';
import CardView from './Card.vue';
import type { Column } from './cards';

const props = defineProps<{ column: Column }>();
/** The space under each card, inside its slot (`.slot` below). */
const GAP = 8;

const scrollRef = useTemplateRef<HTMLElement>('scroll');
const { items, activeIndex, activeSize, captureLayout, isOver } = makeSortableList(scrollRef, {
  id: props.column.id,
  items: props.column.cards,
  group: 'board',
});

const virtualizer = useVirtualizer(
  computed(() => {
    const arr = items.value;
    const pin = activeIndex.value;
    const size = activeSize.value;
    return {
      count: arr.length,
      getScrollElement: () => scrollRef.value,
      // A card coming from another column gets its real height before it is measured.
      estimateSize: (index: number) => (index === pin && size ? size.height + GAP : 72),
      overscan: 6,
      getItemKey: (index: number) => arr[index]!.id,
      rangeExtractor: (range: Range) => {
        const indexes = defaultRangeExtractor(range);
        return pin < 0 || indexes.includes(pin) ? indexes : [...indexes, pin].sort((a, b) => a - b);
      },
      onChange: () => captureLayout(),
    };
  }),
);
const rows = computed(() => virtualizer.value.getVirtualItems());
const measure = (el: unknown) => virtualizer.value.measureElement(el as HTMLElement | null);
</script>

<template>
  <section class="column" :class="{ over: isOver }">
    <h3>
      <span class="dot" :style="{ background: column.color }" />
      {{ column.title }}
      <span class="count">{{ items.length.toLocaleString('en') }}</span>
    </h3>
    <div ref="scroll" class="scroller">
      <div class="sizer" :style="{ height: `${virtualizer.getTotalSize()}px` }">
        <div
          v-for="row in rows"
          :key="(row.key as string)"
          :ref="measure"
          :data-index="row.index"
          class="slot"
          :style="{ transform: `translateY(${row.start}px)`, paddingBottom: `${GAP}px` }"
        >
          <CardView :card="items[row.index]!" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition:
    background 0.2s,
    border-color 0.2s;
}

.column.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
  background: color-mix(in srgb, #42b883 6%, Canvas);
}

h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 12px 12px 10px;
  font-size: 13px;
  font-weight: 600;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.count {
  margin-left: auto;
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.scroller {
  height: 340px;
  overflow: auto;
  contain: strict;
}

.sizer {
  position: relative;
  width: 100%;
}

/* The gap under a card is padding inside its slot: the virtualizer measures it too. */
.slot {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 0 8px;
}
</style>
