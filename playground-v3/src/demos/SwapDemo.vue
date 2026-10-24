<script setup lang="ts">
  import { reactive } from 'vue';
  import { DnDProvider, type DragItem } from '@vue-dnd-kit/core';
  import DemoList from '../components/DemoList.vue';
  import OverlayCard from '../components/OverlayCard.vue';
  import { describeLists, makeTasks } from '../data';
  import type { Task } from '../types';

  const list = reactive({ id: 'swap-list', title: 'Swap list', tasks: makeTasks('s', 6) });
  const grid = reactive({ id: 'swap-grid', title: 'Swap grid', tasks: makeTasks('w', 8) });
  const titles = (items: DragItem[]) => items.map((entry) => (entry.item as Task | undefined)?.title ?? String(entry.id));
</script>

<template>
  <!-- A provider of its own, to show the overlay slot with `mode`. -->
  <DnDProvider>
    <div class="demo-row">
      <section>
        <h2>Swap list</h2>
        <DemoList
          :list="list"
          :options="{ behavior: 'swap' }"
          selectable
        />
      </section>
      <section>
        <h2>Swap grid</h2>
        <DemoList
          class="grid"
          :list="grid"
          :options="{ behavior: 'swap', strategy: 'grid' }"
        />
      </section>
    </div>
    <pre data-testid="state">{{ describeLists([list, grid]) }}</pre>
    <template #overlay="{ items, mode, accepted }">
      <OverlayCard
        :titles="titles(items)"
        :mode="mode"
        :accepted="accepted"
      />
    </template>
  </DnDProvider>
</template>
