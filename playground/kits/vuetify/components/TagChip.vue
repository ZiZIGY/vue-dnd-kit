<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import { VChip, VTooltip } from 'vuetify/components';

  const props = defineProps<{ tag: string }>();
  // VTooltip has no root element of its own: it renders a fragment (the activator, then
  // a teleport). The ref resolves to the fragment's first element, the chip.
  const item = useTemplateRef('item');
  makeSortableItem(item, { id: () => props.tag });
</script>

<template>
  <VTooltip
    ref="item"
    :text="`#${tag}`"
    location="top"
  >
    <template #activator="{ props: activator }">
      <VChip
        v-bind="activator"
        :data-id="tag"
        label
        color="secondary"
        variant="flat"
        style="cursor: grab"
        >{{ tag }}</VChip
      >
    </template>
  </VTooltip>
</template>
