<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import DemoList from '../components/DemoList.vue';
  import { describeLists, makeTasks } from '../data';
  import type { Task } from '../types';

  const uniform = reactive({ id: 'uniform', title: 'Uniform', tasks: makeTasks('g', 10) });

  // Cells spanning several columns and rows: CSS grid reflows the cells after the
  // active one on every move, which is what the lock and the hysteresis guard against.
  const spans: Array<[number, number]> = [
    [1, 2], [2, 1], [1, 3], [1, 1], [2, 2], [1, 1], [1, 2], [2, 1], [1, 1],
  ];
  const masonry = reactive({
    id: 'masonry',
    title: 'Masonry',
    tasks: spans.map((span, index): Task => ({ id: `m${index + 1}`, title: `M${index + 1}`, span })),
  });
  const moves = ref(0);
</script>

<template>
  <section>
    <h2>Uniform grid</h2>
    <DemoList
      class="grid"
      :list="uniform"
      :options="{ strategy: 'grid' }"
    />
  </section>
  <section>
    <h2>Variable-size grid</h2>
    <DemoList
      class="grid masonry"
      :list="masonry"
      :options="{ strategy: 'grid' }"
      @change="moves++"
    />
  </section>
  <pre data-testid="moves">{{ moves }}</pre>
  <pre data-testid="state">{{ describeLists([uniform, masonry]) }}</pre>
</template>
