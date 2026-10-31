<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { DnDProvider, type DragItem, type SortableDropEvent } from '@vue-dnd-kit/core';
  import DemoList from '../components/DemoList.vue';
  import OverlayCard from '../components/OverlayCard.vue';
  import StatusProbe from '../components/StatusProbe.vue';
  import { describeLists } from '../data';
  import type { Task } from '../types';

  const source = reactive({
    id: 'source',
    title: 'Source',
    tasks: [
      { id: 'r1', title: 'R1 task' },
      { id: 'r2', title: 'R2 bug', type: 'bug' },
      { id: 'r3', title: 'R3 task' },
      { id: 'r4', title: 'R4 bug', type: 'bug' },
    ] as Task[],
  });
  const confirm = reactive({ id: 'confirm', title: 'Asks the server', tasks: [] as Task[] });
  const bugs = reactive({ id: 'bugs', title: 'Bugs only', tasks: [] as Task[] });
  const first = reactive({ id: 'first', title: 'Takes the first', tasks: [] as Task[] });

  const allow = ref(false);
  const last = ref('');
  const record = (event: SortableDropEvent<Task>) => {
    last.value = `to:${event.to.list} accepted:${event.accepted.join(',')} rejected:${event.rejected.join(',')} mode:${event.mode}`;
  };

  // `false` (here after an async check) flies the items back; it is not a pending drag.
  const askServer = () => new Promise<boolean>((resolve) => setTimeout(() => resolve(allow.value), 400));
  const titles = (items: DragItem[]) => items.map((entry) => (entry.item as Task | undefined)?.title ?? String(entry.id));
</script>

<template>
  <DnDProvider>
    <p>Ctrl/Cmd+click to select several items.</p>
    <label>
      <input
        v-model="allow"
        type="checkbox"
        data-testid="allow"
      />
      Server accepts
    </label>
    <div class="demo-row">
      <DemoList
        :list="source"
        :options="{ group: 'reject' }"
        selectable
      />
      <DemoList
        :list="confirm"
        :options="{ group: 'reject', onBeforeDrop: askServer, onDrop: record }"
      />
      <DemoList
        :list="bugs"
        :options="{
          group: { name: 'reject', put: ({ types }) => types.includes('bug') },
          acceptMode: 'some',
          onDrop: record,
        }"
      />
      <DemoList
        :list="first"
        :options="{ group: 'reject', onBeforeDrop: (event) => event.keys.slice(0, 1), onDrop: record }"
      />
    </div>
    <StatusProbe />
    <pre data-testid="last">{{ last }}</pre>
    <pre data-testid="state">{{ describeLists([source, confirm, bugs, first]) }}</pre>
    <template #overlay="{ items, mode, accepted }">
      <OverlayCard
        :titles="titles(items)"
        :mode="mode"
        :accepted="accepted"
      />
    </template>
  </DnDProvider>
</template>
