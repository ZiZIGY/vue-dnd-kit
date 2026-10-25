<script setup lang="ts">
  import { computed, shallowRef } from 'vue';
  import { useEventListener } from '@vueuse/core';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import SortableDemo from './demos/SortableDemo.vue';
  import KanbanDemo from './demos/KanbanDemo.vue';
  import BenchDemo from './demos/BenchDemo.vue';
  import TreeDemo from './demos/TreeDemo.vue';
  import AutoScrollDemo from './demos/AutoScrollDemo.vue';
  import FreeDragDemo from './demos/FreeDragDemo.vue';
  import SelectionDemo from './demos/SelectionDemo.vue';
  import A11yDemo from './demos/A11yDemo.vue';
  import VirtualTanstackDemo from './demos/VirtualTanstackDemo.vue';
  import VirtualKanbanDemo from './demos/VirtualKanbanDemo.vue';
  import VirtualVueUseDemo from './demos/VirtualVueUseDemo.vue';
  import BenchKanbanDemo from './demos/BenchKanbanDemo.vue';
  import BenchVirtualDemo from './demos/BenchVirtualDemo.vue';
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
  import AnnounceDemo from './demos/AnnounceDemo.vue';
  import NestedZonesDemo from './demos/NestedZonesDemo.vue';
  import ShadowDomDemo from './demos/ShadowDomDemo.vue';
  // Example apps (each brings its own DnDProvider).
  import BoardApp from './demos/apps/BoardApp.vue';
  import FilesApp from './demos/apps/FilesApp.vue';
  import FormApp from './demos/apps/FormApp.vue';
  import PlaylistApp from './demos/apps/PlaylistApp.vue';
  import CalendarApp from './demos/apps/CalendarApp.vue';
  import ChessApp from './demos/apps/ChessApp.vue';

  const demos = {
    sortable: SortableDemo,
    kanban: KanbanDemo,
    bench: BenchDemo,
    tree: TreeDemo,
    autoscroll: AutoScrollDemo,
    free: FreeDragDemo,
    selection: SelectionDemo,
    a11y: A11yDemo,
    'virtual-tanstack': VirtualTanstackDemo,
    'virtual-kanban': VirtualKanbanDemo,
    'virtual-vueuse': VirtualVueUseDemo,
    'bench-kanban': BenchKanbanDemo,
    'bench-virtual': BenchVirtualDemo,
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
    announce: AnnounceDemo,
    'nested-zones': NestedZonesDemo,
    shadow: ShadowDomDemo,
    'app-board': BoardApp,
    'app-files': FilesApp,
    'app-form': FormApp,
    'app-playlist': PlaylistApp,
    'app-calendar': CalendarApp,
    'app-chess': ChessApp,
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
