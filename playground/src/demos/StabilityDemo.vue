<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import DemoList from '../components/DemoList.vue';
  import { describeLists, makeTasks } from '../data';

  // Lists that touch: the boundary between them is where layout shifts used to make items ping-pong.
  const columns = reactive([
    { id: 'left', title: 'Left', tasks: makeTasks('l', 4) },
    { id: 'right', title: 'Right', tasks: makeTasks('r', 4) },
  ]);
  const stacked = reactive([
    { id: 'top', title: 'Top', tasks: makeTasks('u', 3) },
    { id: 'bottom', title: 'Bottom', tasks: makeTasks('d', 3) },
  ]);
  const moves = ref(0);
</script>

<template>
  <section>
    <h2>Stability at list boundaries</h2>
    <div class="touching">
      <DemoList
        v-for="column in columns"
        :key="column.id"
        :list="column"
        :options="{ group: 'touching' }"
        @change="moves++"
      />
    </div>
    <div class="stacked">
      <DemoList
        v-for="column in stacked"
        :key="column.id"
        :list="column"
        :options="{ group: 'stacked' }"
        @change="moves++"
      />
    </div>
    <pre data-testid="moves">{{ moves }}</pre>
    <pre data-testid="state">{{ describeLists([...columns, ...stacked]) }}</pre>
  </section>
</template>
