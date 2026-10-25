<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import { VCard, VCardItem, VCardText, VChip, VIcon } from 'vuetify/components';
  import KanbanColumn from '../components/KanbanColumn.vue';
  import { createColumns, serializeBoard, type KitTask } from '../../shared/data';
  import { mdiDragVertical } from '../icons';

  const columns = ref(createColumns());
  const board = computed(() => serializeBoard(columns.value));

  const locate = (id: string) => {
    const index = columns.value.findIndex((column) => column.cards.some((card) => card.id === id));
    return { index, column: columns.value[index] };
  };

  const advance = (id: string) => {
    const { index, column } = locate(id);
    const next = columns.value[index + 1];
    if (!column || !next) return;
    const card = column.cards.find((item) => item.id === id)!;
    column.cards = column.cards.filter((item) => item.id !== id);
    next.cards = [...next.cards, card];
  };

  const remove = (id: string) => {
    const { column } = locate(id);
    if (column) column.cards = column.cards.filter((item) => item.id !== id);
  };

  const asTask = (item: unknown) => item as KitTask;
</script>

<template>
  <DnDProvider>
    <!-- Columns keep their width; on a phone the board scrolls sideways, not the page. -->
    <div
      class="d-flex align-start ga-4 overflow-x-auto"
      data-testid="board-scroller"
    >
      <KanbanColumn
        v-for="column in columns"
        :key="column.id"
        :column="column"
        @advance="advance"
        @remove="remove"
      />
    </div>
    <pre
      class="text-caption mt-4 text-pre-wrap text-break"
      data-testid="board"
      >{{ board }}</pre
    >
    <!--
      Custom overlay: Vuetify's card, rendered by the provider and teleported to <body>,
      outside <v-app>. The theme still reaches it through provide/inject.
    -->
    <template #overlay="{ items }">
      <VCard
        variant="elevated"
        elevation="8"
        class="h-100"
        style="rotate: 2deg"
        data-testid="kanban-overlay"
      >
        <VCardItem class="py-2">
          <span class="text-body-2 font-weight-medium">{{ asTask(items[0]?.item).title }}</span>
          <template #append>
            <VIcon
              :icon="mdiDragVertical"
              size="small"
            />
          </template>
        </VCardItem>
        <VCardText class="pt-0 pb-2">
          <VChip
            size="x-small"
            color="primary"
            >{{ asTask(items[0]?.item).tag }}</VChip
          >
        </VCardText>
      </VCard>
    </template>
  </DnDProvider>
</template>
