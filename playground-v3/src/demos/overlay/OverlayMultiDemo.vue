<script setup lang="ts">
  import { reactive } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import CardList from './CardList.vue';
  import ClearSelection from './ClearSelection.vue';
  import StackOverlay from './StackOverlay.vue';
  import { cards, describeColumns } from './gallery';

  const inbox = reactive({ id: 'inbox', title: 'Inbox', cards: cards('i', ['task', 'note', 'photo', 'link', 'task', 'note']) });
  const done = reactive({ id: 'done', title: 'Done', cards: cards('d', ['task', 'task']) });
</script>

<template>
  <DnDProvider>
    <p class="lead">
      Ctrl/Cmd+click to select, then drag one of the selected cards. The list's <code>overlay</code> component gets
      every dragged item in <code>items</code> and draws them as one stack with a count.
    </p>
    <div class="layout">
      <CardList
        :column="inbox"
        :options="{ group: 'multi', multiple: 'stack', overlay: StackOverlay }"
        selectable
      />
      <CardList
        :column="done"
        :options="{ group: 'multi', multiple: 'stack', overlay: StackOverlay }"
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
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 12px;
  }
</style>
