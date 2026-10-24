<script setup lang="ts">
  import { nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import SortableRow from '../components/SortableRow.vue';

  const COUNT = 500;
  const tasks = ref(
    Array.from({ length: COUNT }, (_, index) => ({ id: `r${index}`, title: `Row ${index}` })),
  );
  const listRef = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(listRef, { items: tasks, id: 'bench' });

  // Instrumentation for e2e/bench.spec.ts: cost of each reorder (pre-flush → after
  // post-flush, i.e. Vue patch + FLIP) and every frame interval while recording.
  const bench = (window.__bench = { reorders: [], frames: [], recording: false } as NonNullable<
    Window['__bench']
  >);
  watch(
    items,
    () => {
      const start = performance.now();
      void nextTick(() => bench.reorders.push(performance.now() - start));
    },
    { flush: 'pre' },
  );

  let last = 0;
  let frame = requestAnimationFrame(function tick(now) {
    if (bench.recording && last) bench.frames.push(now - last);
    last = now;
    frame = requestAnimationFrame(tick);
  });
  onBeforeUnmount(() => cancelAnimationFrame(frame));
</script>

<template>
  <section>
    <h2>Bench: {{ COUNT }} rows</h2>
    <ul
      ref="list"
      class="list"
      data-testid="bench"
    >
      <SortableRow
        v-for="task in items"
        :key="task.id"
        :item="task"
      />
    </ul>
  </section>
</template>
