<script setup lang="ts">
  import { inject, useTemplateRef } from 'vue';
  import { makeSortableList, useDnDMonitor, type Coordinates } from '@vue-dnd-kit/core';
  import QueueItem from './QueueItem.vue';
  import { PLAYER, TRACK_TYPE } from './player';

  const player = inject(PLAYER)!;
  const el = useTemplateRef<HTMLElement>('el');

  const { items, isAccepting } = makeSortableList(el, {
    id: 'queue',
    items: player.queue,
    group: 'queue',
    strategy: 'horizontal',
    // Library tracks are plain draggables: the queue makes an entry for them.
    createItem: player.createEntry,
  });
  // The announcements read the draft to name the position the track would take.
  player.draft.value = items;

  const pointIn = (element: Element | null | undefined, xRatio: number): Coordinates | undefined => {
    const rect = element?.getBoundingClientRect();
    return rect && { x: rect.left + rect.width * xRatio, y: rect.top + rect.height / 2 };
  };

  const entryElement = (index: number) => el.value?.querySelector(`[data-id="${items.value[index]?.id}"]`);

  /**
   * Keyboard drags of library tracks. A sortable list moves its own items by keyboard,
   * but a plain draggable over it is left to the pointer path, so these coordinates walk
   * the queue entry by entry: Up enters the queue after its last entry, Left/Right move
   * along it, Down goes back to the library (dropping there adds nothing).
   */
  useDnDMonitor({
    getKeyboardCoordinates(_event, { active, direction }) {
      if (!active.type.includes(TRACK_TYPE)) return undefined;
      // Workaround (reported): the list's `activeIndex` stays -1 for an item made by
      // createItem, so the slot is looked up by the id the player gave it.
      const index = items.value.findIndex((entry) => entry.id === player.pendingEntry());
      if (index === -1) {
        if (direction.y >= 0) return undefined;
        const last = entryElement(items.value.length - 1)?.getBoundingClientRect();
        return last ? { x: last.right + 12, y: last.top + last.height / 2 } : pointIn(el.value, 0.5);
      }
      if (direction.y > 0) {
        return pointIn(document.querySelector(`[data-id="lib-${(active.data as { id: string }).id}"]`), 0.5);
      }
      const target = index + direction.x;
      // At either end (or Up): stay on the slot.
      if (!direction.x || target < 0 || target >= items.value.length) return pointIn(entryElement(index), 0.5);
      // Past the middle of the neighbour, in the direction of travel.
      return pointIn(entryElement(target), direction.x > 0 ? 0.8 : 0.2);
    },
  });
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
