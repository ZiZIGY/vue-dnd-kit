<script setup lang="ts">
  import { reactive, shallowRef } from 'vue';
  import { restrictToParent } from '@vue-dnd-kit/core';
  import DemoList from '../components/DemoList.vue';
  import { describeLists, makeTasks } from '../data';

  const horizontal = reactive({ id: 'horizontal', title: 'Horizontal', tasks: makeTasks('h', 6) });
  const indicator = reactive({ id: 'indicator', title: 'Indicator', tasks: makeTasks('i', 6) });
  const indicatorB = reactive({ id: 'indicator-b', title: 'Indicator B', tasks: makeTasks('j', 3) });
  const custom = reactive({ id: 'custom', title: 'Custom placeholder', tasks: makeTasks('c', 5) });
  const moving = reactive({ id: 'moving', title: 'Moving', tasks: makeTasks('m', 4) });
  const still = reactive({ id: 'still', title: 'Still', tasks: makeTasks('s', 4) });

  // Single lists keep their items on their axis (the list's `axis`); the indicator lists
  // exchange items side by side, so they move freely.
  const lockAxis = shallowRef(true);
  const lockedTo = (axis: 'x' | 'y') => () => (lockAxis.value ? axis : undefined);
  // The custom-placeholder list can keep its items inside it: its ends must stay in reach.
  const bounded = shallowRef(false);
</script>

<template>
  <label>
    <input
      v-model="lockAxis"
      type="checkbox"
      data-testid="lock-axis"
    />
    Lock the single lists to their axis
  </label>
  <label>
    <input
      v-model="bounded"
      type="checkbox"
      data-testid="bound-list"
    />
    Keep the custom-placeholder list's items inside it
  </label>
  <section>
    <h2>Horizontal list</h2>
    <DemoList
      class="horizontal"
      :list="horizontal"
      :options="{ strategy: 'horizontal', axis: lockedTo('x') }"
    />
  </section>
  <section>
    <h2>Indicator line (the lists don't move; Ctrl/Cmd+click to select several)</h2>
    <div class="demo-row">
      <DemoList
        class="indicator"
        :list="indicator"
        :options="{ placeholder: 'indicator', group: 'lines' }"
        selectable
      />
      <DemoList
        class="indicator"
        :list="indicatorB"
        :options="{ placeholder: 'indicator', group: 'lines' }"
        selectable
      />
    </div>
  </section>
  <section>
    <h2>Custom placeholder (CSS on [data-dnd-placeholder])</h2>
    <DemoList
      class="custom-placeholder"
      :list="custom"
      :options="{ axis: lockedTo('y'), modifiers: () => (bounded ? [restrictToParent] : undefined) }"
    />
  </section>
  <pre data-testid="state">{{ describeLists([horizontal, indicator, indicatorB, custom]) }}</pre>
  <section>
    <h2>A list next to an indicator list (the arrows move only the line there)</h2>
    <div class="demo-row">
      <DemoList
        :list="moving"
        :options="{ group: 'mixed' }"
      />
      <DemoList
        class="indicator"
        :list="still"
        :options="{ placeholder: 'indicator', group: 'mixed' }"
      />
    </div>
  </section>
  <pre data-testid="mixed-state">{{ describeLists([moving, still]) }}</pre>
</template>
