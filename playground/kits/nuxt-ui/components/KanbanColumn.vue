<script setup lang="ts">
  import { toRef, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import UCard from '@nuxt/ui/components/Card.vue';
  import UBadge from '@nuxt/ui/components/Badge.vue';
  import KanbanCard from './KanbanCard.vue';
  import type { KitColumn } from '../../shared/data';

  const props = defineProps<{ column: KitColumn }>();
  const emit = defineEmits<{ advance: [id: string]; remove: [id: string] }>();
  const list = useTemplateRef<HTMLElement>('list');
  const { items, isOver } = makeSortableList(list, {
    id: props.column.id,
    items: toRef(props.column, 'cards'),
    group: 'board',
  });
</script>

<template>
  <UCard
    class="w-72 shrink-0"
    :class="{ 'ring-2 ring-primary': isOver }"
    variant="subtle"
    :ui="{ header: 'flex items-center justify-between p-3 sm:px-3', body: 'p-2 sm:p-2' }"
  >
    <template #header>
      <h3 class="font-semibold text-highlighted">{{ column.title }}</h3>
      <UBadge
        :label="String(column.cards.length)"
        color="neutral"
        variant="outline"
      />
    </template>
    <div
      ref="list"
      class="flex min-h-24 flex-col gap-2"
      :data-testid="column.id"
    >
      <KanbanCard
        v-for="card in items"
        :key="card.id"
        :card="card"
        @advance="emit('advance', card.id)"
        @remove="emit('remove', card.id)"
      />
    </div>
  </UCard>
</template>
