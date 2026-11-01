<script setup lang="ts">
import { DnDProvider, type AnnouncedPosition, type Announcements, type DnDEvent } from '@vue-dnd-kit/core';
import FileManager from './FileManager.vue';
import type { DropPlace } from './drive';
import type { Entry } from './files';

// Space picks a focused file up and drops it; Enter is left to open folders.
const keyboard = { keys: { start: ['Space'], drop: ['Space', 'Enter'] } };

/** "Budget 2026.xlsx", or "3 items". */
const what = ({ active }: DnDEvent) => (active.items.length === 1 ? (active.items[0]!.item as Entry).name : `${active.items.length} items`);
const at = (position?: AnnouncedPosition) => (position ? `, ${position.index + 1} of ${position.length}` : '');

// Screen readers hear names, not keys, and where a drop would go, from the folder's `data`.
const announcements: Partial<Announcements> = {
  onDragStart: (event, { position }) => `Picked up ${what(event)}${at(position)}.`,
  onDragOver: (event, { position }) => {
    const place = event.over?.data as DropPlace | undefined;
    if (place) return place.why ?? `Over ${place.name}. Drop to ${event.mode === 'copy' ? 'copy' : 'move'} ${what(event)} there.`;
    return position ? `${what(event)}${at(position)}.` : undefined;
  },
  // Into a folder, the toast says what happened.
  onDragEnd: (event, { position }) => (event.over?.data ? '' : `Dropped ${what(event)}${at(position)}.`),
  onDragCancel: (event) => `Cancelled: ${what(event)} went back.`,
};
</script>

<template>
  <!-- One provider: its selection is what the band and the clicks fill, and what a drag takes. -->
  <DnDProvider :keyboard="keyboard" :announcements="announcements">
    <FileManager />
  </DnDProvider>
</template>
