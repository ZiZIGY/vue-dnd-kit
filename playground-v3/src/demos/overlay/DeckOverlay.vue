<script setup lang="ts">
  import { computed } from 'vue';
  import { DragPreview, type OverlayProps } from '@vue-dnd-kit/core';
  import { ICONS, cardOf } from './gallery';

  // A custom layout of the default clones: `DragPreview` renders the clone of any dragged
  // item. The grabbed card stays on top; up to four more fan out behind it.
  const props = defineProps<OverlayProps>();
  const MAX_CARDS = 5;

  const fanned = computed(() => {
    const shown = props.items.slice(0, MAX_CARDS);
    const behind = shown.slice(1);
    // Behind the top card, alternating left and right, further out the deeper they are.
    return [
      ...behind.map((entry, index) => {
        const step = Math.floor(index / 2) + 1;
        return { entry, angle: (index % 2 ? 1 : -1) * step * 7, depth: behind.length - index };
      }),
      { entry: shown[0]!, angle: 0, depth: 0 },
    ];
  });
</script>

<template>
  <div
    class="deck-overlay"
    data-overlay-kind="deck"
    :data-count="items.length"
  >
    <div
      v-for="{ entry, angle, depth } in fanned"
      :key="entry.id"
      class="deck-card"
      data-testid="deck-card"
      :style="{ '--angle': `${angle}deg`, zIndex: MAX_CARDS - depth }"
    >
      <DragPreview
        :id="entry.id"
        :style="{ width: '100%', height: '100%' }"
      >
        <!-- No clone for this one (more cards than were cloned): a card of our own. -->
        <div
          class="fallback"
          data-testid="deck-fallback"
        >
          <span>{{ ICONS[cardOf(entry)?.kind ?? 'task'] }}</span>
          {{ cardOf(entry)?.title }}
        </div>
      </DragPreview>
    </div>
    <span
      v-if="items.length > 1"
      class="count"
      data-testid="deck-count"
      >{{ items.length }}</span
    >
  </div>
</template>

<style scoped>
  .deck-overlay {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .deck-card {
    position: absolute;
    inset: 0;
    border-radius: 8px;
    transform: rotate(var(--angle));
    transform-origin: 50% 160%;
    box-shadow: 0 10px 24px -14px rgb(15 23 42 / 0.6);
  }

  .fallback {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 100%;
    padding: 0 12px;
    box-sizing: border-box;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
  }

  .count {
    position: absolute;
    z-index: 10;
    top: -10px;
    right: -10px;
    min-width: 24px;
    height: 24px;
    padding: 0 7px;
    box-sizing: border-box;
    border-radius: 12px;
    background: #0f766e;
    color: #fff;
    font: 700 12px/24px system-ui, sans-serif;
    text-align: center;
  }
</style>
