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
    font: 14px/1.4 system-ui, sans-serif;
    color: #1f2937;
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
    background: #fff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    box-shadow:
      0 18px 32px -8px rgb(15 23 42 / 0.45),
      0 2px 6px rgb(15 23 42 / 0.15);
  }

  .tb-ghost-card.refused {
    border-color: #ef4444;
    box-shadow:
      0 18px 32px -8px rgb(185 28 28 / 0.45),
      0 0 0 2px #fecaca;
  }

  .tb-ghost-layer {
    position: absolute;
    inset: 0;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    transform: translate(6px, 6px) rotate(-2deg);
  }

  .tb-ghost-layer.second {
    transform: translate(12px, 11px) rotate(-4deg);
  }

  .tb-ghost-label {
    align-self: flex-start;
    padding: 1px 8px;
    border-radius: 999px;
    background: #e2e8f0;
    color: #475569;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .tb-ghost-label.bug {
    background: #fee2e2;
    color: #b91c1c;
  }

  .tb-ghost-label.feature {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .tb-ghost-label.design {
    background: #f3e8ff;
    color: #7e22ce;
  }

  .tb-ghost-more {
    color: #64748b;
    font-size: 12px;
  }

  .tb-ghost-badge {
    position: absolute;
    top: -10px;
    right: -10px;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 11px;
    background: #2563eb;
    color: #fff;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
  }

  .tb-ghost-refused {
    position: absolute;
    bottom: -26px;
    left: 0;
    padding: 2px 8px;
    border-radius: 6px;
    background: #dc2626;
    color: #fff;
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
    background: #f1f5f9;
    border-radius: 12px;
    box-shadow: 0 24px 40px -12px rgb(15 23 42 / 0.5);
  }

  .tb-ghost-column header {
    display: flex;
    justify-content: space-between;
    padding: 4px 6px;
  }

  .tb-ghost-mini {
    padding: 8px 10px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgb(15 23 42 / 0.08);
  }
</style>
