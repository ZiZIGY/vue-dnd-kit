<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import {
    VBtn,
    VCard,
    VCardItem,
    VCardText,
    VChip,
    VIcon,
    VList,
    VListItem,
    VMenu,
    VTooltip,
  } from 'vuetify/components';
  import type { KitTask } from '../../shared/data';
  import { mdiArrowRight, mdiDelete, mdiDotsVertical, mdiInformationOutline } from '../icons';

  const props = defineProps<{ card: KitTask }>();
  const emit = defineEmits<{ advance: []; remove: [] }>();
  const root = useTemplateRef('root');
  makeSortableItem(root, { id: () => props.card.id });
</script>

<template>
  <VCard
    ref="root"
    :data-id="card.id"
    variant="elevated"
    elevation="1"
    class="mb-2"
    style="cursor: grab"
  >
    <VCardItem class="py-2">
      <span class="text-body-2 font-weight-medium">{{ card.title }}</span>
      <template #append>
        <!-- The menu teleports its content to the overlay container, outside the card. -->
        <VMenu location="bottom end">
          <template #activator="{ props: activator }">
            <VBtn
              v-bind="activator"
              :icon="mdiDotsVertical"
              variant="text"
              size="small"
              density="comfortable"
              :aria-label="`Actions for ${card.title}`"
              data-testid="menu"
            />
          </template>
          <VList density="compact">
            <VListItem
              :prepend-icon="mdiArrowRight"
              title="Move to next column"
              @click="emit('advance')"
            />
            <VListItem
              :prepend-icon="mdiDelete"
              title="Delete"
              base-color="error"
              @click="emit('remove')"
            />
          </VList>
        </VMenu>
      </template>
    </VCardItem>
    <VCardText class="d-flex align-center ga-1 pt-0 pb-2">
      <VChip
        size="x-small"
        color="primary"
        >{{ card.tag }}</VChip
      >
      <VTooltip
        :text="`Card ${card.id}`"
        location="top"
      >
        <template #activator="{ props: activator }">
          <VIcon
            v-bind="activator"
            :icon="mdiInformationOutline"
            size="small"
            data-testid="info"
          />
        </template>
      </VTooltip>
    </VCardText>
  </VCard>
</template>
