<script setup lang="ts">
  import { reactive } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import CardList from './CardList.vue';
  import FitOverlay from './FitOverlay.vue';
  import { cards, describeColumns } from './gallery';

  const props = defineProps<{ fit: 'slot' | 'source' }>();
  // Ids unique on the page: both boards render at once.
  const prefix = props.fit === 'slot' ? 's' : 'o';
  const narrow = reactive({
    id: `${props.fit}-narrow`,
    title: 'Narrow, compact',
    cards: cards(`${prefix}n`, ['task', 'note', 'link', 'task']),
  });
  const wide = reactive({
    id: `${props.fit}-wide`,
    title: 'Wide, tall',
    cards: cards(`${prefix}w`, ['photo', 'task', 'note']),
  });
</script>

<template>
  <DnDProvider :overlay-fit="fit">
    <div
      class="ov-board"
      :data-testid="`board-${fit}`"
    >
      <h2>
        <code>overlayFit: '{{ fit }}'</code>
        <small>{{ fit === 'slot' ? '(default) the overlay takes the size of the slot it would land in' : 'the overlay keeps the size of the dragged element' }}</small>
      </h2>
      <div class="lists">
        <CardList
          class="narrow"
          :column="narrow"
          :options="{ group: `fit-${fit}` }"
          size="compact"
          selectable
        >
          <template #note>clone</template>
        </CardList>
        <CardList
          class="wide"
          :column="wide"
          :options="{ group: `fit-${fit}`, overlay: FitOverlay }"
          size="tall"
        >
          <template #note>component, width: 100%</template>
        </CardList>
      </div>
      <pre :data-testid="`state-${fit}`">{{ describeColumns([narrow, wide]) }}</pre>
    </div>
  </DnDProvider>
</template>

<style scoped>
  .ov-board {
    padding: 12px 16px;
    background: var(--ui-surface);
    border: 1px solid var(--ui-border);
    border-radius: var(--ui-radius-lg);
  }

  h2 {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0 0 12px;
    font-size: 15px;
  }

  small {
    font-size: 12px;
    font-weight: 400;
    color: var(--ui-text-muted);
  }

  .lists {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .narrow {
    --column-width: 170px;
    --gap: 4px;
  }

  .wide {
    --column-width: 300px;
    --gap: 10px;
  }
</style>
