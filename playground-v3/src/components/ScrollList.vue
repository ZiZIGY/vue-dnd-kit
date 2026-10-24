<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeSortableList, type AutoScrollOptions } from '@vue-dnd-kit/core';
  import SortableRow from './SortableRow.vue';

  const props = withDefaults(
    defineProps<{
      id: string;
      prefix: string;
      count: number;
      /** Wrap the list in a fixed-height scroller. */
      scroller?: boolean;
      autoScroll?: boolean | AutoScrollOptions;
    }>(),
    // Without it, Vue's boolean casting turns an absent prop into `false`.
    { autoScroll: undefined },
  );

  const tasks = ref(
    Array.from({ length: props.count }, (_, index) => ({
      id: `${props.prefix}${index + 1}`,
      title: `Item ${props.prefix}${index + 1}`,
    })),
  );
  const listRef = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(listRef, {
    items: tasks,
    id: props.id,
    autoScroll: props.autoScroll,
  });
</script>

<template>
  <div>
    <div
      :class="{ scroller }"
      :data-testid="`${id}-scroller`"
    >
      <ul
        ref="list"
        class="list"
        :data-testid="id"
      >
        <SortableRow
          v-for="task in items"
          :key="task.id"
          :item="task"
        />
      </ul>
    </div>
    <pre
      class="order"
      :data-testid="`${id}-order`"
      >{{ tasks.map((task) => task.id).join(',') }}</pre
    >
  </div>
</template>
