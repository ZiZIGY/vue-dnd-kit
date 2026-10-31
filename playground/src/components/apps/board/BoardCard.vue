<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import type { BoardCard } from './board';

  const props = defineProps<{ card: BoardCard }>();
  const el = useTemplateRef<HTMLElement>('el');
  const { selected, isPlaceholder } = makeSortableItem(el, {
    id: () => props.card.id,
    type: 'card',
    data: () => props.card,
  });

  // Ctrl/Cmd+click adds the card to the selection; dragging a selected card takes them all.
  const onClick = (event: MouseEvent) => {
    if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
  };
</script>

<template>
  <li
    ref="el"
    class="tb-card"
    :class="{ selected, placeholder: isPlaceholder }"
    :data-id="card.id"
    :data-selected="selected || undefined"
    :aria-label="card.title"
    @click="onClick"
  >
    <span
      class="tb-label"
      :class="card.label"
      >{{ card.label }}</span
    >
    <span class="tb-title">{{ card.title }}</span>
  </li>
</template>

<style scoped>
  .tb-card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 12px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgb(15 23 42 / 0.08);
    cursor: grab;
    user-select: none;
  }

  .tb-card:hover {
    border-color: #cbd5e1;
  }

  .tb-card:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .tb-card.selected {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px #bfdbfe;
  }

  /* The slot where the card lands: an empty dashed frame instead of a faded card. */
  .tb-card.placeholder {
    opacity: 1;
    background: #e2e8f0;
    border: 1px dashed #94a3b8;
    box-shadow: none;
  }

  .tb-card.placeholder > * {
    visibility: hidden;
  }

  .tb-title {
    line-height: 1.3;
  }

  .tb-label {
    align-self: flex-start;
    padding: 1px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .tb-label.bug {
    background: #fee2e2;
    color: #b91c1c;
  }

  .tb-label.feature {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .tb-label.design {
    background: #f3e8ff;
    color: #7e22ce;
  }

  .tb-label.chore {
    background: #e2e8f0;
    color: #475569;
  }
</style>
