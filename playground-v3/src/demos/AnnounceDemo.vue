<script setup lang="ts">
  import { reactive } from 'vue';
  import { DnDProvider, type Announcements } from '@vue-dnd-kit/core';
  import AnnounceZone from '../components/AnnounceZone.vue';
  import DemoList from '../components/DemoList.vue';
  import ExternalChip from '../components/ExternalChip.vue';
  import { describeLists, makeTasks } from '../data';

  const list = reactive({ id: 'tasks', title: 'Tasks', tasks: makeTasks('a', 5) });
  // Only the end text is overridden: the others keep the position-aware defaults.
  const announcements: Partial<Announcements> = {
    onDragEnd: ({ active }) => `Custom: ${active.id} is down.`,
  };
</script>

<template>
  <DnDProvider :announcements="announcements">
    <div class="demo-row">
      <DemoList :list="list" />
      <ExternalChip :chip="{ id: 'free', title: 'Free draggable' }" />
      <AnnounceZone />
    </div>
    <pre data-testid="state">{{ describeLists([list]) }}</pre>
  </DnDProvider>
</template>
