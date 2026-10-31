<script setup lang="ts">
  import { useTemplateRef, type Component } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import { ICONS, type Card } from './gallery';

  const props = defineProps<{
    card: Card;
    overlay?: Component;
    selectable?: boolean;
    /** On the row itself, not via the list: the clone of a row keeps its own classes only. */
    size?: 'compact' | 'tall';
  }>();

  const el = useTemplateRef<HTMLElement>('el');
  // `item`: the key comes from the list's getKey (card.id), so there is no id to keep in sync.
  const { selected } = makeSortableItem(el, {
    item: () => props.card,
    type: () => props.card.kind,
    overlay: props.overlay,
  });

  const onClick = (event: MouseEvent) => {
    if (props.selectable && (event.ctrlKey || event.metaKey)) selected.value = !selected.value;
  };
</script>

<template>
  <li
    ref="el"
    class="ov-card"
    :class="[card.kind, size, { selected }]"
    :style="{ '--hue': card.hue ?? 210 }"
    :data-id="card.id"
    :data-kind="card.kind"
    :data-selected="selected || undefined"
    @click="onClick"
  >
    <span
      class="icon"
      aria-hidden="true"
      >{{ ICONS[card.kind] }}</span
    >
    <span class="title">{{ card.title }}</span>
  </li>
</template>

<style scoped>
  .ov-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    cursor: grab;
    user-select: none;
  }

  .icon {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: #f3f4f6;
    color: #4b5563;
    font-size: 13px;
  }

  .note {
    background: hsl(48 96% 89%);
    border-color: hsl(45 93% 70%);
  }

  .photo .icon {
    background: linear-gradient(135deg, hsl(var(--hue) 70% 60%), hsl(calc(var(--hue) + 60) 70% 45%));
    color: #fff;
  }

  .link .title {
    color: #2563eb;
    text-decoration: underline;
  }

  .compact {
    gap: 6px;
    padding: 3px 8px;
    font-size: 12px;
  }

  .compact .icon {
    width: 18px;
    height: 18px;
    font-size: 11px;
  }

  .tall {
    padding: 22px 16px;
  }

  .selected {
    outline: 2px solid #2563eb;
    outline-offset: 1px;
  }
</style>
