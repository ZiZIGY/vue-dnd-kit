<script setup lang="ts">
  import { computed } from 'vue';
  import type { DnDStatus, DragItem, Over } from '@vue-dnd-kit/core';
  import { cardCount, type BoardCard, type BoardColumn } from './board';

  // A subset of the provider's #overlay slot props.
  const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean; status: DnDStatus }>();

  const column = computed(() =>
    props.items[0]?.type.includes('column') ? (props.items[0].item as BoardColumn) : null,
  );
  const cards = computed(() => props.items.map((entry) => entry.item as BoardCard));
  // The card straightens up while it lands (or flies back).
  const landing = computed(() => props.status === 'dropping');
  const refused = computed(() => !!props.over && !props.accepted);
</script>

<template>
  <div
    v-if="column"
    class="tb-ghost tb-ghost-column"
    :class="{ landing }"
    data-testid="board-overlay"
    data-kind="column"
  >
    <header>
      <strong>{{ column.title }}</strong>
      <span>{{ column.cards.length }}</span>
    </header>
    <div
      v-for="card in column.cards"
      :key="card.id"
      class="tb-ghost-mini"
    >
      {{ card.title }}
    </div>
  </div>
  <div
    v-else-if="cards.length"
    class="tb-ghost"
    :class="{ landing }"
    data-testid="board-overlay"
    data-kind="card"
    :data-count="cards.length"
    :data-refused="refused || undefined"
  >
    <!-- Multi-drag: more cards peek out from below. -->
    <span
      v-if="cards.length > 2"
      class="tb-ghost-layer second"
    />
    <span
      v-if="cards.length > 1"
      class="tb-ghost-layer"
    />
    <div
      class="tb-ghost-card"
      :class="{ refused }"
    >
      <span
        class="tb-ghost-label"
        :class="cards[0]!.label"
        >{{ cards[0]!.label }}</span
      >
      <span>{{ cards[0]!.title }}</span>
      <span
        v-if="cards.length > 1"
        class="tb-ghost-more"
        >+ {{ cardCount(cards.length - 1) }}</span
      >
    </div>
    <b
      v-if="cards.length > 1"
      class="tb-ghost-badge"
      >{{ cards.length }}</b
    >
    <em
      v-if="refused"
      class="tb-ghost-refused"
      >Column is full</em
    >
  </div>
</template>

<style scoped>
  .tb-ghost {
    position: relative;
    width: 100%;
    height: 100%;
    font: 14px/1.4 var(--font-sans);
    color: var(--ui-text);
    transform: rotate(3deg) scale(1.02);
    transition: transform 180ms ease;
  }

  .tb-ghost.landing {
    transform: none;
  }

  .tb-ghost-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    height: 100%;
    padding: 10px 12px;
    overflow: hidden;
    background: var(--ui-surface);
    border: 1px solid var(--ui-border-strong);
    border-radius: var(--ui-radius);
    box-shadow: var(--ui-shadow-overlay);
  }

  .tb-ghost-card.refused {
    border-color: var(--ui-danger);
    box-shadow:
      var(--ui-shadow-overlay),
      0 0 0 2px color-mix(in srgb, var(--ui-danger) 30%, transparent);
  }

  .tb-ghost-layer {
    position: absolute;
    inset: 0;
    background: var(--ui-bg-muted);
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius);
    transform: translate(6px, 6px) rotate(-2deg);
  }

  .tb-ghost-layer.second {
    transform: translate(12px, 11px) rotate(-4deg);
  }

  /* As on the cards (BoardCard.vue). */
  .tb-ghost-label {
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
  }

  .tb-ghost-label.bug {
    --tag: #ef4444;
  }

  .tb-ghost-label.feature {
    --tag: #3b82f6;
  }

  .tb-ghost-label.design {
    --tag: #a855f7;
  }

  .tb-ghost-more {
    color: var(--ui-text-muted);
    font-size: 12px;
  }

  .tb-ghost-badge {
    position: absolute;
    top: -10px;
    right: -10px;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: var(--ui-radius-sm);
    background: var(--ui-primary);
    color: var(--ui-on-primary);
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 22px;
    text-align: center;
  }

  .tb-ghost-refused {
    position: absolute;
    bottom: -26px;
    left: 0;
    padding: 2px 8px;
    border-radius: var(--ui-radius-sm);
    background: var(--ui-danger);
    color: var(--ui-on-solid);
    font-size: 12px;
    font-style: normal;
    white-space: nowrap;
  }

  .tb-ghost-column {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    overflow: hidden;
    background: var(--ui-bg-elevated);
    border-radius: var(--ui-radius-lg);
    box-shadow:
      inset 0 0 0 1px var(--ui-border-accented),
      var(--ui-shadow-overlay);
  }

  .tb-ghost-column header {
    display: flex;
    justify-content: space-between;
    padding: 4px 6px;
    color: var(--ui-text-highlighted);
  }

  .tb-ghost-mini {
    padding: 8px 10px;
    background: var(--ui-surface);
    border-radius: var(--ui-radius);
    box-shadow: inset 0 0 0 1px var(--ui-border-accented);
  }
</style>
