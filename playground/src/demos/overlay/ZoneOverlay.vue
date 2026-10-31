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
    --accent: var(--ui-primary);
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 100%;
    padding: 0 12px;
    box-sizing: border-box;
    background: var(--ui-surface);
    border: 2px solid var(--accent);
    border-radius: var(--ui-radius);
    box-shadow: var(--ui-shadow-overlay);
    transition:
      border-color 120ms,
      background-color 120ms,
      transform 120ms;
  }

  .zone-overlay[data-state='free'] {
    --accent: var(--ui-border-strong);
  }

  .zone-overlay[data-tone='danger'] {
    --accent: var(--ui-warning);
    background: var(--ui-warning-soft);
    transform: rotate(-1.5deg);
  }

  .zone-overlay[data-state='rejected'] {
    --accent: var(--ui-danger);
    background: var(--ui-danger-soft);
    cursor: not-allowed;
  }

  .icon {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: var(--ui-radius-sm);
    background: var(--accent);
    color: var(--ui-bg);
  }

  .text strong {
    color: var(--ui-text-highlighted);
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
    border-radius: var(--ui-radius-sm);
    background: var(--ui-primary);
    color: var(--ui-on-primary);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
  }
</style>
