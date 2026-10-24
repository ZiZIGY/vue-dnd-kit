<script setup lang="ts">
  import { toRef, useTemplateRef, watch } from 'vue';
  import { makeSortableList, type SortableListOptions } from '@vue-dnd-kit/core';
  import DemoItem from './DemoItem.vue';
  import type { Column, Task } from '../types';

  const props = withDefaults(
    defineProps<{
      list: Column;
      options?: Omit<SortableListOptions<Task>, 'items' | 'id'>;
      tag?: string;
      itemTag?: string;
      selectable?: boolean;
    }>(),
    { options: () => ({}), tag: 'ul', itemTag: 'li', selectable: false },
  );
  const emit = defineEmits<{ change: [] }>();

  const el = useTemplateRef<HTMLElement>('el');
  const { items, isOver, isAccepting, indicator } = makeSortableList(el, {
    ...props.options,
    id: props.list.id,
    items: toRef(props.list, 'tasks'),
  });
  // Counts draft changes, so specs can check that jitter doesn't oscillate.
  watch(items, () => emit('change'));
</script>

<template>
  <component
    :is="tag"
    ref="el"
    class="list"
    :data-testid="list.id"
    :data-over="isOver || undefined"
    :data-accepting="isAccepting || undefined"
    :data-indicator-index="indicator?.index"
  >
    <DemoItem
      v-for="task in items"
      :key="task.id"
      :item="task"
      :tag="itemTag"
      :selectable="selectable"
    />
  </component>
</template>
