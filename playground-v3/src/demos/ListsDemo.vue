<script setup lang="ts">
  import { reactive } from 'vue';
  import DemoList from '../components/DemoList.vue';
  import { describeLists, makeTasks } from '../data';

  const horizontal = reactive({ id: 'horizontal', title: 'Horizontal', tasks: makeTasks('h', 6) });
  const indicator = reactive({ id: 'indicator', title: 'Indicator', tasks: makeTasks('i', 6) });
  const indicatorB = reactive({ id: 'indicator-b', title: 'Indicator B', tasks: makeTasks('j', 3) });
  const custom = reactive({ id: 'custom', title: 'Custom placeholder', tasks: makeTasks('c', 5) });
</script>

<template>
  <section>
    <h2>Horizontal list</h2>
    <DemoList
      class="horizontal"
      :list="horizontal"
      :options="{ strategy: 'horizontal' }"
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
    />
  </section>
  <pre data-testid="state">{{ describeLists([horizontal, indicator, indicatorB, custom]) }}</pre>
</template>
