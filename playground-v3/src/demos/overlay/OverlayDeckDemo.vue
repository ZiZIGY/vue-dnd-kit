<script setup lang="ts">
  import { reactive } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import CardList from './CardList.vue';
  import ClearSelection from './ClearSelection.vue';
  import DeckOverlay from './DeckOverlay.vue';
  import { cards, describeColumns } from './gallery';

  const inbox = reactive({
    id: 'deck-inbox',
    title: 'Inbox',
    cards: cards('i', ['task', 'note', 'photo', 'link', 'task', 'note', 'photo']),
  });
  const done = reactive({ id: 'deck-done', title: 'Done', cards: cards('d', ['task', 'task']) });
</script>

<template>
  <DnDProvider>
    <p class="lead">
      Ctrl/Cmd+click to select, then drag one of the selected cards. The list's <code>overlay</code> component fans the
      cards out like a hand of cards, each one drawn by <code>&lt;DragPreview :id&gt;</code>: the same clone the
      default overlay shows. On drop every card lands on its own slot (back on its place when cancelled). Cards past
      the clone limit render the preview's slot instead and fade in where they land.
    </p>
    <div class="layout">
      <CardList
        :column="inbox"
        :options="{ group: 'deck', overlay: DeckOverlay }"
        selectable
      />
      <CardList
        :column="done"
        :options="{ group: 'deck', overlay: DeckOverlay }"
        selectable
      />
    </div>
    <ClearSelection />
    <pre data-testid="state">{{ describeColumns([inbox, done]) }}</pre>
  </DnDProvider>
</template>

<style scoped>
  .lead {
    max-width: 760px;
  }

  .layout {
    display: flex;
    gap: 48px;
    align-items: flex-start;
    margin-bottom: 12px;
  }
</style>
