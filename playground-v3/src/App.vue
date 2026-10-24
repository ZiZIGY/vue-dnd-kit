<script setup lang="ts">
  import { computed, shallowRef } from 'vue';
  import { useEventListener } from '@vueuse/core';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import SortableDemo from './demos/SortableDemo.vue';
  import KanbanDemo from './demos/KanbanDemo.vue';
  import BenchDemo from './demos/BenchDemo.vue';
  import VirtualTanstackDemo from './demos/VirtualTanstackDemo.vue';
  import VirtualKanbanDemo from './demos/VirtualKanbanDemo.vue';
  import VirtualVueUseDemo from './demos/VirtualVueUseDemo.vue';

  const demos = {
    sortable: SortableDemo,
    kanban: KanbanDemo,
    bench: BenchDemo,
    'virtual-tanstack': VirtualTanstackDemo,
    'virtual-kanban': VirtualKanbanDemo,
    'virtual-vueuse': VirtualVueUseDemo,
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
      <component :is="demo" :key="current" />
    </DnDProvider>
  </main>
</template>
