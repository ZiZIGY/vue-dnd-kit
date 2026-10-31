<script setup lang="ts">
  import { inject, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import QueueItem from './QueueItem.vue';
  import { PLAYER } from './player';

  const player = inject(PLAYER)!;
  const el = useTemplateRef<HTMLElement>('el');

  const { items, isAccepting } = makeSortableList(el, {
    id: 'queue',
    items: player.queue,
    group: 'queue',
    strategy: 'horizontal',
    // Library tracks are plain draggables: the queue makes an entry for them. With the
    // keyboard, Up takes a track into the queue and Left/Right move its entry along it.
    createItem: player.createEntry,
  });
  // The announcements read the draft to name the position the track would take.
  player.draft.value = items;
</script>

<template>
  <ul
    ref="el"
    class="pl-queue"
    data-testid="queue"
    :data-accepting="isAccepting || undefined"
    aria-label="Queue"
  >
    <QueueItem
      v-for="(entry, index) in items"
      :key="entry.id"
      :entry="entry"
      :index="index"
    />
    <li
      v-if="!items.length"
      class="pl-queue-empty"
    >
      The queue is empty. Drag tracks here from the library.
    </li>
  </ul>
</template>

<style scoped>
  .pl-queue {
    display: flex;
    gap: 10px;
    min-height: 92px;
    margin: 0;
    padding: 10px;
    overflow-x: auto;
    list-style: none;
    background: rgb(255 255 255 / 0.06);
    border-radius: 12px;
  }

  .pl-queue[data-accepting] {
    box-shadow: inset 0 0 0 2px rgb(167 139 250 / 0.7);
  }

  .pl-queue-empty {
    align-self: center;
    color: #94a3b8;
  }
</style>
