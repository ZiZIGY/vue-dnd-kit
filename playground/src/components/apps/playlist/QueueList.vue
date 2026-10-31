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
    background: var(--ui-bg-muted);
    border-radius: var(--ui-radius-lg);
    box-shadow: inset 0 0 0 1px var(--ui-border);
  }

  .pl-queue[data-accepting] {
    box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--ui-primary) 60%, transparent);
  }

  .pl-queue-empty {
    align-self: center;
    color: var(--ui-text-dimmed);
  }
</style>
