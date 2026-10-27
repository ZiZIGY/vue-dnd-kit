<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue';
import { defaultRangeExtractor, useVirtualizer, type Range } from '@tanstack/vue-virtual';
import { makeSortableList } from '@vue-dnd-kit/core';
import NoteRow from './NoteRow.vue';
import { makeNotes } from './notes';

const OVERSCAN = 6;
const notes = shallowRef(makeNotes(5_000));

// The scroller is the sortable list: the library sorts it and auto-scrolls it.
const scrollRef = useTemplateRef<HTMLElement>('scroll');
const { items, activeIndex, captureLayout } = makeSortableList(scrollRef, { items: notes });

// One computed that reads the draft once: TanStack memoizes the measurements and the range
// on `getItemKey` and `rangeExtractor`, so they must be new functions after every reorder.
const virtualizer = useVirtualizer(
  computed(() => {
    const arr = items.value;
    const pin = activeIndex.value;
    return {
      count: arr.length,
      getScrollElement: () => scrollRef.value,
      // A guess: every row is measured once it renders (`measureElement` below).
      estimateSize: () => 92,
      overscan: OVERSCAN,
      getItemKey: (index: number) => arr[index]!.id,
      // The dragged row stays mounted, however far you scroll from it.
      rangeExtractor: (range: Range) => {
        const indexes = defaultRangeExtractor(range);
        return pin < 0 || indexes.includes(pin) ? indexes : [...indexes, pin].sort((a, b) => a - b);
      },
      // Measurements land after the library's animation pass: animate them too.
      onChange: () => captureLayout(),
    };
  }),
);
const rows = computed(() => virtualizer.value.getVirtualItems());
const measure = (el: unknown) => virtualizer.value.measureElement(el as HTMLElement | null);

/** The dragged row is out of the range the virtualizer would render: only the pin keeps it. */
const pinned = computed(() => {
  const range = virtualizer.value.range;
  const pin = activeIndex.value;
  return pin >= 0 && !!range && (pin < range.startIndex - OVERSCAN || pin > range.endIndex + OVERSCAN);
});
</script>

<template>
  <div class="panel">
    <header>
      <strong>Notes</strong>
      <span class="pin" :class="{ on: pinned }">row {{ activeIndex + 1 }} pinned</span>
      <span class="meta">{{ notes.length.toLocaleString('en') }} notes · {{ rows.length }} in the DOM</span>
    </header>
    <div ref="scroll" class="scroller">
      <div class="sizer" :style="{ height: `${virtualizer.getTotalSize()}px` }">
        <!-- Positioned one by one, keyed by id: the virtualizer measures each of them. -->
        <div
          v-for="row in rows"
          :key="(row.key as string)"
          :ref="measure"
          :data-index="row.index"
          class="slot"
          :style="{ transform: `translateY(${row.start}px)` }"
        >
          <NoteRow :note="items[row.index]!" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  width: min(440px, 100%);
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: Canvas;
}

header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  font-size: 14px;
}

.meta {
  margin-left: auto;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

/* Shows while the dragged row is out of the range the virtualizer would render. */
.pin {
  padding: 4px 8px;
  border-radius: 99px;
  background: #42b883;
  color: #fff;
  font: 600 10px/1 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
  opacity: 0;
  scale: 0.9;
  transition:
    opacity 0.2s,
    scale 0.2s;
}

.pin.on {
  opacity: 1;
  scale: 1;
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

.slot {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
