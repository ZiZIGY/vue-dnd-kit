<script setup lang="ts">
  import { reactive } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import CardList from './CardList.vue';
  import NoteOverlay from './NoteOverlay.vue';
  import PhotoOverlay from './PhotoOverlay.vue';
  import PinnedOverlay from './PinnedOverlay.vue';
  import TaskSlotOverlay from './TaskSlotOverlay.vue';
  import { cards, describeColumns } from './gallery';

  // Item-level overlays by kind. Plain constants: components must not become reactive.
  const overlays = { note: NoteOverlay, photo: PhotoOverlay };

  const mixed = reactive({
    id: 'mixed',
    title: 'Mixed',
    cards: cards('m', ['note', 'photo', 'task', 'link', 'note', 'photo', 'task']),
  });
  const pinned = reactive({
    id: 'pinned',
    title: 'Pinned',
    cards: cards('p', ['task', 'link', 'note', 'photo']),
  });
</script>

<template>
  <DnDProvider>
    <p class="lead">
      One overlay per source, picked at drag start: the item's <code>overlay</code>, then the list's, then the
      provider's <code>#overlay</code> slot, then the clone. It stays the same over other lists.
    </p>
    <div class="layout">
      <CardList
        :column="mixed"
        :options="{ group: 'types' }"
        :overlays="overlays"
      >
        <template #note>no list overlay</template>
      </CardList>
      <CardList
        :column="pinned"
        :options="{ group: 'types', overlay: PinnedOverlay }"
        :overlays="overlays"
      >
        <template #note>list overlay</template>
      </CardList>
      <dl class="legend">
        <dt>Note, photo</dt>
        <dd>item option, in both lists</dd>
        <dt>Pinned task, link</dt>
        <dd>list option</dd>
        <dt>Mixed task</dt>
        <dd>provider slot</dd>
        <dt>Mixed link</dt>
        <dd>the slot renders nothing for links: clone</dd>
      </dl>
    </div>
    <pre data-testid="state">{{ describeColumns([mixed, pinned]) }}</pre>
    <template #overlay="slot">
      <!-- Tasks only; for anything else the slot is empty and the clone is used. -->
      <TaskSlotOverlay
        v-if="slot.items[0]?.type.includes('task')"
        v-bind="slot"
      />
    </template>
  </DnDProvider>
</template>

<style scoped>
  .lead {
    max-width: 760px;
  }

  .layout {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    align-items: flex-start;
  }

  .legend {
    display: grid;
    grid-template-columns: auto auto;
    gap: 4px 12px;
    margin: 28px 0 0;
    font-size: 13px;
  }

  dt {
    font-weight: 600;
  }

  dd {
    margin: 0;
    color: #4b5563;
  }
</style>
