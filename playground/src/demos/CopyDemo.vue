<script setup lang="ts">
  import { reactive } from 'vue';
  import { DnDProvider, type DragItem } from '@vue-dnd-kit/core';
  import DemoList from '../components/DemoList.vue';
  import OverlayCard from '../components/OverlayCard.vue';
  import { describeLists, makeTasks, nextId } from '../data';
  import type { Task } from '../types';

  const clone = (task: Task): Task => ({ ...task, id: nextId(task.id) });
  const palette = reactive({ id: 'palette', title: 'Palette', tasks: makeTasks('p', 3) });
  const target = reactive({ id: 'target', title: 'Target', tasks: makeTasks('t', 3) });
  const other = reactive({ id: 'other', title: 'Other', tasks: makeTasks('o', 2) });
  const titles = (items: DragItem[]) => items.map((entry) => (entry.item as Task | undefined)?.title ?? String(entry.id));
</script>

<template>
  <DnDProvider>
    <p>The palette copies (<code>pull: 'clone'</code>, <code>sort: false</code>). Hold Alt while dragging between the other lists to copy.</p>
    <div class="demo-row">
      <section>
        <h2>Palette</h2>
        <DemoList
          :list="palette"
          :options="{ group: { name: 'copy', pull: 'clone', put: false }, sort: false, clone }"
        />
      </section>
      <section>
        <h2>Target</h2>
        <DemoList
          :list="target"
          :options="{ group: 'copy', clone }"
        />
      </section>
      <section>
        <h2>Other</h2>
        <DemoList
          :list="other"
          :options="{ group: 'copy', clone }"
        />
      </section>
    </div>
    <pre data-testid="state">{{ describeLists([palette, target, other]) }}</pre>
    <template #overlay="{ items, mode, accepted }">
      <OverlayCard
        :titles="titles(items)"
        :mode="mode"
        :accepted="accepted"
      />
    </template>
  </DnDProvider>
</template>
