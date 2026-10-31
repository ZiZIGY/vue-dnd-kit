<script lang="ts">
  /** What a zone tells the overlay through `over.data`. */
  export interface ZoneData {
    label: string;
    tone?: 'danger';
  }
</script>

<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable, type AcceptRule } from '@vue-dnd-kit/core';

  const props = defineProps<{ id: string; data: ZoneData; accept?: AcceptRule; remove?: boolean }>();
  const el = useTemplateRef<HTMLElement>('el');
  const { isOver, isAccepting } = makeDroppable(el, {
    id: props.id,
    data: () => props.data,
    accept: props.accept,
    // A trash zone: the card leaves its list.
    onDrop: (event) => props.remove && event.source?.remove(),
  });
</script>

<template>
  <div
    ref="el"
    class="ov-zone"
    :class="data.tone"
    :data-testid="`zone-${id}`"
    :data-over="isOver || undefined"
    :data-accepting="isAccepting || undefined"
  >
    <strong>{{ data.label }}</strong>
    <small><slot /></small>
  </div>
</template>

<style scoped>
  .ov-zone {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    width: 220px;
    height: 84px;
    padding: 0 16px;
    background: var(--ui-bg-muted);
    border: 2px dashed var(--ui-border-strong);
    border-radius: var(--ui-radius-lg);
    transition:
      background-color 120ms,
      border-color 120ms;
  }

  strong {
    color: var(--ui-text-highlighted);
  }

  .danger {
    border-color: color-mix(in srgb, var(--ui-warning) 55%, var(--ui-bg));
  }

  .ov-zone[data-over][data-accepting] {
    background: var(--ui-warning-soft);
    border-color: var(--ui-warning);
  }

  .ov-zone[data-over]:not([data-accepting]) {
    background: var(--ui-danger-soft);
    border-color: var(--ui-danger);
  }

  small {
    color: var(--ui-text-muted);
  }
</style>
