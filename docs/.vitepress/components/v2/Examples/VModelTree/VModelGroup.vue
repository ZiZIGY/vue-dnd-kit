<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import VModelItem from './VModelItem.vue';

  export interface Item {
    id: string;
    title: string;
    color?: string;
    children?: Item[];
  }

  const { direction = 'vertical', group = 'task' } = defineProps<{
    direction?: 'vertical' | 'horizontal';
    group?: string;
  }>();

  const items = defineModel<Item[]>({ required: true });

  const el = useTemplateRef<HTMLElement>('el');

  makeDroppable(
    el,
    {
      groups: [group],
      events: {
        onDrop(e) {
          const r = e.helpers.suggestSort(direction === 'horizontal' ? 'horizontal' : 'vertical');
          if (!r) return;

          items.value = r.targetItems as Item[];

          if (!r.sameList) {
            const src = e.draggedItems[0].items as Item[];
            src.splice(0, src.length, ...(r.sourceItems as Item[]));
          }
        },
      },
    },
    () => items.value
  );
</script>

<template>
  <div
    ref="el"
    class="group-body"
    :class="`group-body--${direction}`"
  >
    <VModelItem
      v-for="(item, i) in items"
      :key="item.id"
      :item="item"
      :index="i"
      :items="items"
    />
    <div
      v-if="!items.length"
      class="empty"
    >
      Drop here
    </div>
  </div>
</template>

<style scoped>
  .group-body {
    display: flex;
    gap: 8px;
    min-height: 44px;
    padding: 4px;
  }

  .group-body--vertical {
    flex-direction: column;
  }

  .group-body--horizontal {
    flex-direction: row;
    align-items: flex-start;
    padding: 0;
    gap: 10px;
  }

  .empty {
    font-size: 0.72rem;
    color: var(--vp-c-text-3);
    text-align: center;
    padding: 0.75rem 0.5rem;
    font-style: italic;
    border: 1px dashed var(--vp-c-divider);
    border-radius: 6px;
    width: 100%;
  }
</style>
