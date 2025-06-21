<script setup lang="ts" generic="T extends Record<string, unknown>">
  import { DnDOperations, useDroppable } from '@vue-dnd-kit/core';
  import TreeItem from './TreeItem.vue';
  import { TValidItemKeys, TValidNestingKeys } from './types';
  import { computed } from 'vue';

  const { data, groups = ['tree'] } = defineProps<{
    data: T[];
    itemKey: TValidItemKeys<T>;
    nestingKey: TValidNestingKeys<T>;
    groups?: string[];
  }>();

  defineSlots<{
    default: (props: { item: T }) => any;
  }>();

  const { elementRef, isOvered } = useDroppable({
    groups,
    data: computed(() => ({
      source: data,
    })),
    events: {
      onDrop: DnDOperations.applyTransfer,
    },
  });
</script>

<template>
  <div
    ref="elementRef"
    :class="['tree-container', { 'tree-container-overed': isOvered }]"
  >
    <TreeItem
      v-for="(children, index) in data"
      :key="String(children[itemKey])"
      :data="children"
      :source="data"
      :index="index"
      :groups="groups"
      :item-key="itemKey"
      :nesting-key="nestingKey"
    >
      <template #default="{ item }">
        <slot :item="item" />
      </template>
    </TreeItem>
  </div>
</template>

<style src="./styles.css" />
