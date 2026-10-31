<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import { VBtn, VDataTableRow } from 'vuetify/components';
  import type { KitPerson } from '../../shared/data';
  import { mdiDragVertical } from '../icons';

  const props = defineProps<{ person: KitPerson; rowProps: Record<string, unknown> }>();
  // Vuetify's own row component (a single <tr> root), rendered from the table's `item` slot.
  const row = useTemplateRef('row');
  const handle = useTemplateRef('handle');
  makeSortableItem(row, { id: () => props.person.id, handle });
</script>

<template>
  <VDataTableRow
    ref="row"
    v-bind="rowProps"
    :data-id="person.id"
  >
    <template #[`item.drag`]>
      <VBtn
        ref="handle"
        :icon="mdiDragVertical"
        variant="text"
        size="small"
        density="comfortable"
        style="cursor: grab"
        :aria-label="`Drag ${person.name}`"
        data-testid="row-handle"
      />
    </template>
  </VDataTableRow>
</template>
