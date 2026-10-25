<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import { VChip, VListItem } from 'vuetify/components';
  import type { KitTask } from '../../shared/data';

  // `height` is the list's `item-height`: the row must be exactly that tall.
  const props = defineProps<{ row: KitTask; height: number }>();
  const item = useTemplateRef('item');
  // A getter: the virtual list may hand this component another row.
  makeSortableItem(item, { id: () => props.row.id });
</script>

<template>
  <VListItem
    ref="item"
    :data-id="row.id"
    :title="row.title"
    :height="height"
    class="border-b bg-surface"
    style="cursor: grab"
  >
    <template #append>
      <VChip
        size="small"
        color="primary"
        >{{ row.tag }}</VChip
      >
    </template>
  </VListItem>
</template>
