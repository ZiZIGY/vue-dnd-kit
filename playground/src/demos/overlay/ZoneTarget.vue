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
    background: #f9fafb;
    border: 2px dashed #9ca3af;
    border-radius: 10px;
    transition:
      background-color 120ms,
      border-color 120ms;
  }

  .danger {
    border-color: #fdba74;
  }

  .ov-zone[data-over][data-accepting] {
    background: #fff7ed;
    border-color: #ea580c;
  }

  .ov-zone[data-over]:not([data-accepting]) {
    background: #fef2f2;
    border-color: #dc2626;
  }

  small {
    color: #6b7280;
  }
</style>
