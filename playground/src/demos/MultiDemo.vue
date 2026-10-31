<script setup lang="ts">
  import { reactive } from 'vue';
  import { useDnD } from '@vue-dnd-kit/core';
  import DemoList from '../components/DemoList.vue';
  import { describeLists, makeTasks } from '../data';

  const stack = reactive([
    { id: 'stack-a', title: 'Stack A', tasks: makeTasks('a', 6) },
    { id: 'stack-b', title: 'Stack B', tasks: makeTasks('b', 3) },
  ]);
  const gaps = reactive([
    { id: 'gaps-a', title: 'Gaps A', tasks: makeTasks('g', 6) },
    { id: 'gaps-b', title: 'Gaps B', tasks: makeTasks('k', 3) },
  ]);
  const { selection } = useDnD();
</script>

<template>
  <p>Ctrl/Cmd+click to select, then drag one of the selected items.</p>
  <section>
    <h2>Stack: the others fly into the overlay</h2>
    <div class="demo-row">
      <DemoList
        v-for="list in stack"
        :key="list.id"
        :list="list"
        :options="{ group: 'stack', multiple: 'stack' }"
        selectable
      />
    </div>
  </section>
  <section>
    <h2>Gaps: the others stay in place until the drop</h2>
    <div class="demo-row">
      <DemoList
        v-for="list in gaps"
        :key="list.id"
        :list="list"
        :options="{ group: 'gaps', multiple: 'gaps' }"
        selectable
      />
    </div>
  </section>
  <button
    data-testid="clear"
    @click="selection.clear()"
  >
    Clear selection
  </button>
  <pre data-testid="state">{{ describeLists([...stack, ...gaps]) }}</pre>
</template>
