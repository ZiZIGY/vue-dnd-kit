<script setup lang="ts">
  import { computed } from 'vue';
  import type { OverlayProps } from '@vue-dnd-kit/core';
  import { ICONS, cardOf } from './gallery';
  import type { ZoneData } from './ZoneTarget.vue';

  // One component, many looks: it reads where it is (`over`), whether that place takes
  // the card (`accepted`) and what a drop would do (`mode`).
  const props = defineProps<OverlayProps>();
  const card = computed(() => cardOf(props.items[0]));

  /** Sortable lists have no `data`: name them by id. */
  const LIST_NAMES: Record<string, string> = { backlog: 'Backlog', sprint: 'Sprint', frozen: 'Frozen' };

  const zone = computed(() => {
    const over = props.over;
    if (!over) return null;
    const data = over.data as ZoneData | undefined;
    return { id: String(over.id), label: data?.label ?? LIST_NAMES[over.id] ?? String(over.id), tone: data?.tone };
  });
  const state = computed(() => (!zone.value ? 'free' : props.accepted ? 'accepted' : 'rejected'));
  const hint = computed(() => {
    if (!zone.value) return 'Drop on a list or a zone';
    if (!props.accepted) return `Not allowed in ${zone.value.label}`;
    if (zone.value.tone === 'danger') return 'Release to delete';
    return `${props.mode === 'copy' ? 'Copy' : 'Move'} to ${zone.value.label}`;
  });
</script>

<template>
  <div
    class="zone-overlay"
    data-overlay-kind="zone"
    :data-state="state"
    :data-zone="zone?.id"
    :data-tone="zone?.tone"
  >
    <span class="icon">{{ state === 'rejected' ? '⦸' : card ? ICONS[card.kind] : '' }}</span>
    <span class="text">
      <strong>{{ card?.title }}</strong>
      <small data-testid="overlay-hint">{{ hint }}</small>
    </span>
    <span
      v-if="mode === 'copy'"
      class="badge"
      data-testid="copy-badge"
      >+ copy</span
    >
  </div>
</template>

<style scoped>
  .zone-overlay {
    --accent: #2563eb;
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 100%;
    padding: 0 12px;
    box-sizing: border-box;
    background: #fff;
    border: 2px solid var(--accent);
    border-radius: 8px;
    box-shadow: 0 12px 24px -10px rgb(0 0 0 / 0.35);
    transition:
      border-color 120ms,
      background-color 120ms,
      transform 120ms;
  }

  .zone-overlay[data-state='free'] {
    --accent: #9ca3af;
  }

  .zone-overlay[data-tone='danger'] {
    --accent: #ea580c;
    background: #fff7ed;
    transform: rotate(-1.5deg);
  }

  .zone-overlay[data-state='rejected'] {
    --accent: #dc2626;
    background: #fef2f2;
    cursor: not-allowed;
  }

  .icon {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: var(--accent);
    color: #fff;
  }

  .text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  small {
    color: var(--accent);
    white-space: nowrap;
  }

  .badge {
    position: absolute;
    top: -9px;
    right: -9px;
    padding: 1px 8px;
    border-radius: 999px;
    background: #16a34a;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
  }
</style>
