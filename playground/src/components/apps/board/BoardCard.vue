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
    background: var(--ui-surface);
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius);
    box-shadow: var(--ui-shadow-sm);
    cursor: grab;
    user-select: none;
  }

  .tb-card:hover {
    border-color: var(--ui-border-strong);
  }

  .tb-card:focus-visible {
    outline: 2px solid var(--ui-focus);
    outline-offset: 2px;
  }

  .tb-card.selected {
    border-color: var(--ui-selection);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-selection) 30%, transparent);
  }

  /* The slot where the card lands: an empty dashed frame instead of a faded card. */
  .tb-card.placeholder {
    opacity: 1;
    background: color-mix(in srgb, var(--ui-text) 4%, transparent);
    border: 1px dashed var(--ui-border-strong);
    box-shadow: none;
  }

  .tb-card.placeholder > * {
    visibility: hidden;
  }

  .tb-title {
    line-height: 1.3;
  }

  /* Tag hues: darker on light, lighter on dark (mixed with the highlighted text). */
  .tb-label {
    --tag: var(--ui-text-dimmed);
    align-self: flex-start;
    padding: 1px 8px;
    border-radius: var(--ui-radius-sm);
    background: color-mix(in srgb, var(--tag) 15%, transparent);
    color: color-mix(in srgb, var(--tag) 75%, var(--ui-text-highlighted));
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .tb-label.bug {
    --tag: #ef4444;
  }

  .tb-label.feature {
    --tag: #3b82f6;
  }

  .tb-label.design {
    --tag: #a855f7;
  }
</style>
