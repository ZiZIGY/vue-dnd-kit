<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import { VBtn, VChip, VListItem, VTooltip } from 'vuetify/components';
  import type { KitTask } from '../../shared/data';
  import { mdiDragVertical } from '../icons';

  const props = defineProps<{ task: KitTask }>();
  // Component refs: the library resolves them to their root elements.
  const item = useTemplateRef('item');
  const handle = useTemplateRef('handle');
  makeSortableItem(item, { id: () => props.task.id, handle });
</script>

<template>
  <VListItem
    ref="item"
    :data-id="task.id"
    :title="task.title"
    rounded="lg"
    border
    class="mb-2"
  >
    <template #prepend>
      <VBtn
        ref="handle"
        :icon="mdiDragVertical"
        variant="text"
        size="small"
        density="comfortable"
        class="mr-2"
        style="cursor: grab"
        :aria-label="`Drag ${task.title}`"
        data-testid="handle"
      />
    </template>
    <template #append>
      <!-- A teleporting tooltip inside the item. -->
      <VTooltip
        :text="`Tag: ${task.tag}`"
        location="top"
      >
        <template #activator="{ props: activator }">
          <VChip
            v-bind="activator"
            size="small"
            color="primary"
            data-testid="tag"
            >{{ task.tag }}</VChip
          >
        </template>
      </VTooltip>
    </template>
  </VListItem>
</template>
