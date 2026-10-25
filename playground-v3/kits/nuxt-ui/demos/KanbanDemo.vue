<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import UCard from '@nuxt/ui/components/Card.vue';
  import UBadge from '@nuxt/ui/components/Badge.vue';
  import UIcon from '@nuxt/ui/components/Icon.vue';
  import KanbanColumn from '../components/KanbanColumn.vue';
  import { createColumns, serializeBoard, type KitTask } from '../../shared/data';

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
    <div class="flex items-start gap-4">
      <KanbanColumn
        v-for="column in columns"
        :key="column.id"
        :column="column"
        @advance="advance"
        @remove="remove"
      />
    </div>
    <pre
      class="mt-4 text-xs text-muted"
      data-testid="board"
      >{{ board }}</pre
    >
    <!-- Custom overlay: the kit's card, rendered by the provider and teleported to <body>. -->
    <template #overlay="{ items }">
      <UCard
        variant="outline"
        class="h-full rotate-2 shadow-xl ring-2 ring-primary"
        :ui="{ body: 'flex items-start gap-2 p-3 sm:p-3' }"
        data-testid="kanban-overlay"
      >
        <div class="flex flex-1 flex-col items-start gap-1">
          <span class="text-sm font-medium text-highlighted">{{ asTask(items[0]?.item).title }}</span>
          <UBadge
            :label="asTask(items[0]?.item).tag"
            size="sm"
            variant="subtle"
          />
        </div>
        <UIcon
          name="i-lucide-grip-vertical"
          class="size-4 text-muted"
        />
      </UCard>
    </template>
  </DnDProvider>
</template>
