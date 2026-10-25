<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import CombineList from '../components/CombineList.vue';
  import type { Entry, EntryList } from '../types';

  const task = (id: string): Entry => ({ id, title: id.toUpperCase() });
  const group = (id: string, extra: Partial<Entry> = {}): Entry => ({ id, title: `Group ${id.toUpperCase()}`, children: [], ...extra });

  const list = reactive<EntryList>({
    id: 'combine-list',
    entries: [task('a1'), task('a2'), group('g1'), task('a3'), group('g2'), task('a4'), group('gl', { locked: true }), task('a5')],
  });
  const grid = reactive<EntryList>({
    id: 'combine-grid',
    entries: [task('b1'), task('b2'), group('h1'), task('b3'), task('b4'), group('h2', { limit: 1 }), task('b5'), task('b6')],
  });

  /** `list:a1,g1[a2,a3],…` for the specs. */
  const describe = (source: EntryList) =>
    `${source.id}:${source.entries
      .map((entry) => (entry.children ? `${entry.id}[${entry.children.map((child) => child.id).join(',')}]` : entry.id))
      .join(',')}`;
  const state = computed(() => [list, grid].map(describe).join(' | '));
</script>

<template>
  <p>
    Drop a task on the middle of a group to put it inside; near a group's edges the list sorts as usual. Groups take
    tasks only (dragging a group over one sorts), the dashed one takes nothing, and H2 holds one task at most.
    Ctrl/Cmd+click to select several.
  </p>
  <div class="demo-row">
    <section>
      <h2>List</h2>
      <CombineList
        :list="list"
        strategy="vertical"
      />
    </section>
    <section>
      <h2>Grid</h2>
      <CombineList
        :list="grid"
        strategy="grid"
      />
    </section>
  </div>
  <pre data-testid="state">{{ state }}</pre>
</template>
