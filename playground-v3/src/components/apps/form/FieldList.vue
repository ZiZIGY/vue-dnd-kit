<script setup lang="ts">
  import { inject, toRef, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import FieldCard from './FieldCard.vue';
  import { FORM_BUILDER, type FieldContainer } from './form';

  /** The form canvas, or the field list of a section (`nested`). */
  const props = defineProps<{ listId: string; owner: FieldContainer; nested?: boolean }>();
  const builder = inject(FORM_BUILDER)!;

  const el = useTemplateRef<HTMLElement>('el');
  const { items, isOver, isAccepting, indicator } = makeSortableList(el, {
    id: props.listId,
    items: toRef(props.owner, 'fields'),
    // Sections take fields but no other sections.
    group: props.nested ? { name: 'form', put: ({ types }) => !types.includes('section') } : 'form',
    // The form doesn't move while dragging: a line shows where the field goes.
    placeholder: 'indicator',
    // Alt+drag duplicates (the provider's copyModifier).
    clone: builder.duplicate,
  });
</script>

<template>
  <ul
    ref="el"
    class="fb-list"
    :class="{ nested, empty: !items.length }"
    :data-testid="`list-${listId}`"
    :data-over="isOver || undefined"
    :data-accepting="isAccepting || undefined"
    :data-refusing="(isOver && !isAccepting) || undefined"
    :data-indicator-index="indicator?.index"
  >
    <FieldCard
      v-for="item in items"
      :key="item.id"
      :field="item"
    />
    <li
      v-if="!items.length"
      class="fb-empty"
      :class="{ active: !!indicator }"
    >
      {{ nested ? 'Drop fields into this section' : 'Drag fields from the left to start your form' }}
    </li>
  </ul>
</template>

<style scoped>
  .fb-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 120px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .fb-list.nested {
    min-height: 52px;
    padding: 8px;
    border-radius: 8px;
    background: #f8fafc;
    box-shadow: inset 0 0 0 1px #e2e8f0;
  }

  .fb-list.nested[data-accepting] {
    box-shadow: inset 0 0 0 1px #93c5fd;
  }

  .fb-list.nested[data-refusing] {
    background: #fef2f2;
    box-shadow: inset 0 0 0 1px #fca5a5;
  }

  .fb-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    border: 1px dashed #cbd5e1;
    border-radius: 8px;
    color: #94a3b8;
    font-size: 13px;
  }

  .fb-empty.active {
    border: 2px solid #2563eb;
    color: #1d4ed8;
  }
</style>
