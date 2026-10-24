<script setup lang="ts">
  import { computed, shallowRef } from 'vue';
  import { useEventListener } from '@vueuse/core';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import SortableDemo from './demos/SortableDemo.vue';
  import KanbanDemo from './demos/KanbanDemo.vue';
  import BenchDemo from './demos/BenchDemo.vue';
  import StabilityDemo from './demos/StabilityDemo.vue';
  import ListsDemo from './demos/ListsDemo.vue';
  import GridDemo from './demos/GridDemo.vue';
  import SwapDemo from './demos/SwapDemo.vue';
  import NestedDemo from './demos/NestedDemo.vue';
  import TableDemo from './demos/TableDemo.vue';
  import MultiDemo from './demos/MultiDemo.vue';
  import CopyDemo from './demos/CopyDemo.vue';
  import TrashDemo from './demos/TrashDemo.vue';
  import ExternalDemo from './demos/ExternalDemo.vue';
  import RejectDemo from './demos/RejectDemo.vue';

  const demos = {
    sortable: SortableDemo,
    kanban: KanbanDemo,
    bench: BenchDemo,
    stability: StabilityDemo,
    lists: ListsDemo,
    grid: GridDemo,
    swap: SwapDemo,
    nested: NestedDemo,
    table: TableDemo,
    multi: MultiDemo,
    copy: CopyDemo,
    trash: TrashDemo,
    external: ExternalDemo,
    reject: RejectDemo,
  };
  type DemoName = keyof typeof demos;

  const readHash = (): DemoName => {
    const name = location.hash.slice(1);
    return name in demos ? (name as DemoName) : 'sortable';
  };

  const current = shallowRef<DemoName>(readHash());
  useEventListener(window, 'hashchange', () => (current.value = readHash()));
  const demo = computed(() => demos[current.value]);
</script>

<template>
  <nav>
    <a
      v-for="(_, name) in demos"
      :key="name"
      :href="`#${name}`"
      :class="{ active: current === name }"
      >{{ name }}</a
    >
  </nav>
  <main>
    <DnDProvider>
      <component
        :is="demo"
        :key="current"
      />
    </DnDProvider>
  </main>
</template>
