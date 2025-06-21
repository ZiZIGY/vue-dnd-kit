<script setup lang="ts" generic="T extends Record<string, unknown>">
  import { computed, ref } from 'vue';
  import { TValidItemKeys, TValidNestingKeys } from './types';

  import Tree from './Tree.vue';
  import TreeControls from './TreeControls.vue';
  import { useDraggable } from '@vue-dnd-kit/core';

  const { data, nestingKey, source, index } = defineProps<{
    data: T;
    itemKey: TValidItemKeys<T>;
    nestingKey: TValidNestingKeys<T>;
    source: T[];
    index: number;
    groups: string[];
  }>();

  const children = computed<T[] | undefined>(() => data[nestingKey] as T[]);
  const isExpanded = ref(true);

  const { handleDragStart, elementRef } = useDraggable({
    data: computed(() => ({
      source,
      index,
    })),
  });

  const handleArrowClick = () => {
    isExpanded.value = !isExpanded.value;
  };

  defineSlots<{
    default: (props: { item: T }) => any;
  }>();
</script>

<template>
  <div
    class="tree-item"
    ref="elementRef"
  >
    <div class="tree-item-content">
      <TreeControls
        :expanded="isExpanded"
        :has-children="!!children"
        :on-arrow-click="handleArrowClick"
        :on-drag-start="handleDragStart"
      />
      <div class="tree-item-text">
        <slot :item="data" />
      </div>
    </div>

    <Tree
      v-if="children && isExpanded"
      :data="children"
      :item-key="itemKey"
      :nesting-key="nestingKey"
      class="tree-children"
    >
      <template #default="{ item }">
        <slot :item="item" />
      </template>
    </Tree>
  </div>
</template>
