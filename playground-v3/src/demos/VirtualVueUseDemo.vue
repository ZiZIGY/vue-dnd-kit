<script setup lang="ts">
  import { shallowRef, useTemplateRef } from 'vue';
  import { useVirtualList } from '@vueuse/core';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import VirtualRow from '../components/VirtualRow.vue';
  import { describeDrop, makeTasks } from '../data';

  const ROW = 40;
  const tasks = shallowRef(makeTasks('v', 10_000));
  const lastDrop = shallowRef('');
  // The outer element is the sortable container: `containerProps` owns the scroller's ref.
  const listRef = useTemplateRef<HTMLElement>('list');

  const { items } = makeSortableList(listRef, {
    id: 'vueuse',
    items: tasks,
    onDrop: (event) => (lastDrop.value = describeDrop(tasks.value, event.keys[0])),
  });

  // A number keeps VueUse's offset math O(1); it must equal the real row height,
  // and the placeholder keeps that height. The draft is a new array per reorder,
  // which is what makes `list` recompute.
  const { list, containerProps, wrapperProps } = useVirtualList(items, {
    itemHeight: ROW,
    overscan: 8,
  });
</script>

<template>
  <section>
    <h2>VueUse useVirtualList: 10,000 rows</h2>
    <div
      ref="list"
      class="frame"
    >
      <div
        v-bind="containerProps"
        class="scroller"
        data-testid="vueuse-scroller"
      >
        <div v-bind="wrapperProps">
          <!-- Keyed by id, not by `index` as in the VueUse docs; `data` is a reactive proxy. -->
          <VirtualRow
            v-for="{ data } in list"
            :key="data.id"
            :item="data"
            :size="ROW"
          />
        </div>
      </div>
    </div>
    <pre data-testid="vueuse-order">{{ tasks.slice(0, 10).map((task) => task.id).join(',') }}</pre>
    <pre data-testid="vueuse-drop">{{ lastDrop }}</pre>
  </section>
</template>

<style scoped>
  .frame {
    width: 360px;
  }

  .scroller {
    height: 600px;
    background: #e5e7eb;
  }
</style>
