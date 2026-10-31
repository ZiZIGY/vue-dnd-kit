<script setup lang="ts">
  import { toRef, useTemplateRef, type Component } from 'vue';
  import { makeSortableList, type SortableListOptions } from '@vue-dnd-kit/core';
  import CardRow from './CardRow.vue';
  import type { Card, CardColumn, CardKind } from './gallery';

  const props = withDefaults(
    defineProps<{
      column: CardColumn;
      options?: Omit<SortableListOptions<Card>, 'items' | 'id'>;
      /** Item-level overlay per card kind (wins over `options.overlay`). */
      overlays?: Partial<Record<CardKind, Component>>;
      selectable?: boolean;
      size?: 'compact' | 'tall';
    }>(),
    { options: () => ({}), overlays: () => ({}), selectable: false, size: undefined },
  );

  const el = useTemplateRef<HTMLElement>('el');
  const { items, isOver, isAccepting } = makeSortableList(el, {
    ...props.options,
    id: props.column.id,
    items: toRef(props.column, 'cards'),
  });
</script>

<template>
  <div class="ov-column">
    <h3>
      {{ column.title }}<small v-if="$slots.note"> · <slot name="note" /></small>
    </h3>
    <ul
      ref="el"
      class="ov-cards"
      :data-testid="column.id"
      :data-over="isOver || undefined"
      :data-accepting="isAccepting || undefined"
    >
      <CardRow
        v-for="card in items"
        :key="card.id"
        :card="card"
        :overlay="overlays[card.kind]"
        :selectable="selectable"
        :size="size"
      />
    </ul>
  </div>
</template>

<style scoped>
  .ov-column {
    width: var(--column-width, 260px);
  }

  h3 {
    margin: 0 0 8px;
    font-size: 14px;
  }

  small {
    font-weight: 400;
    color: var(--ui-text-muted);
  }

  .ov-cards {
    display: flex;
    flex-direction: column;
    gap: var(--gap, 6px);
    min-height: 64px;
    margin: 0;
    padding: 8px;
    list-style: none;
    background: var(--ui-bg-muted);
    border-radius: var(--ui-radius-lg);
    box-shadow: inset 0 0 0 1px var(--ui-border);
    outline: 2px dashed transparent;
    transition: outline-color 120ms;
  }

  .ov-cards[data-over] {
    outline-color: var(--ui-primary);
  }

  .ov-cards[data-over]:not([data-accepting]) {
    outline-color: var(--ui-danger);
  }
</style>
