<script setup lang="ts">
  import { reactive } from 'vue';
  import { DnDProvider, type Active, type DragItem } from '@vue-dnd-kit/core';
  import DemoList from '../components/DemoList.vue';
  import ExternalChip from '../components/ExternalChip.vue';
  import OverlayCard from '../components/OverlayCard.vue';
  import { describeLists, makeTasks, nextId } from '../data';
  import type { Task } from '../types';

  const chips = [
    { id: 'chip-task', title: 'New task' },
    { id: 'chip-note', title: 'New note' },
  ];
  const inbox = reactive({ id: 'inbox', title: 'Inbox', tasks: makeTasks('n', 3) });
  const plain = reactive({ id: 'plain', title: 'No createItem', tasks: makeTasks('q', 2) });

  // The temporary item lives in the draft while the chip is over the list and is
  // rendered by the list's own template; it becomes real on drop.
  const createItem = (active: Active): Task => ({
    id: nextId('created'),
    title: (active.data as { title: string }).title,
  });
  const titles = (items: DragItem[]) =>
    items.map((entry) => (entry.data as { title?: string } | undefined)?.title ?? String(entry.id));
</script>

<template>
  <DnDProvider>
    <p>Drag a chip into the inbox. The second list has no <code>createItem</code> and ignores chips.</p>
    <div class="demo-row">
      <div class="demo-row">
        <ExternalChip
          v-for="chip in chips"
          :key="chip.id"
          :chip="chip"
        />
      </div>
      <DemoList
        :list="inbox"
        :options="{ group: 'external', createItem }"
      />
      <DemoList
        :list="plain"
        :options="{ group: 'external' }"
      />
    </div>
    <pre data-testid="state">{{ describeLists([inbox, plain]) }}</pre>
    <template #overlay="{ items, mode, accepted }">
      <OverlayCard
        :titles="titles(items)"
        :mode="mode"
        :accepted="accepted"
      />
    </template>
  </DnDProvider>
</template>
