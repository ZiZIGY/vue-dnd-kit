<script setup lang="ts">
  import { toRef, useTemplateRef, type ComponentPublicInstance } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import { VCard, VCardText, VCardTitle, VChip } from 'vuetify/components';
  import KanbanCard from './KanbanCard.vue';
  import type { KitColumn } from '../../shared/data';

  const props = defineProps<{ column: KitColumn }>();
  const emit = defineEmits<{ advance: [id: string]; remove: [id: string] }>();
  // A component ref: the list is <v-card-text>'s root element. Typed by hand: the
  // template that defines the ref also uses `isOver` and `items` (an inference cycle).
  const list = useTemplateRef<ComponentPublicInstance>('list');
  const { items, isOver } = makeSortableList(list, {
    id: props.column.id,
    items: toRef(props.column, 'cards'),
    group: 'board',
  });
</script>

<template>
  <VCard
    variant="flat"
    :class="isOver ? 'bg-primary-lighten' : 'bg-surface-light'"
    :border="isOver ? 'primary md' : true"
    width="280"
    class="flex-shrink-0"
  >
    <VCardTitle class="d-flex align-center justify-space-between text-subtitle-1">
      {{ column.title }}
      <VChip
        size="small"
        variant="outlined"
        >{{ column.cards.length }}</VChip
      >
    </VCardTitle>
    <VCardText
      ref="list"
      class="pa-2"
      style="min-height: 96px"
      :data-testid="column.id"
    >
      <KanbanCard
        v-for="card in items"
        :key="card.id"
        :card="card"
        @advance="emit('advance', card.id)"
        @remove="emit('remove', card.id)"
      />
    </VCardText>
  </VCard>
</template>
