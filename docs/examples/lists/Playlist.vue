<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeSortableList, restrictToParent } from '@vue-dnd-kit/core';
import Track from './Track.vue';

const tracks = ref([
  { id: 't1', title: 'Midnight Drive', artist: 'Neon Coast', seconds: 222, hue: 160 },
  { id: 't2', title: 'Paper Planes', artist: 'Lumen', seconds: 178, hue: 28 },
  { id: 't3', title: 'Low Tide', artist: 'Harbor', seconds: 245, hue: 205 },
  { id: 't4', title: 'Static Bloom', artist: 'Violet Hour', seconds: 201, hue: 290 },
  { id: 't5', title: 'Golden Hour', artist: 'Sundial', seconds: 189, hue: 45 },
]);
const total = computed(() => {
  const seconds = tracks.value.reduce((sum, track) => sum + track.seconds, 0);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
});

const list = useTemplateRef<HTMLElement>('list');
// A vertical list: the rows make room while you drag; on drop, `tracks` gets the new order.
// The tracks move on one axis and stay inside the list.
const { items } = makeSortableList(list, { items: tracks, axis: 'y', modifiers: [restrictToParent] });
</script>

<template>
  <section class="playlist">
    <header>
      <span class="title">Up next</span>
      <span class="meta">{{ total }}</span>
    </header>
    <ol ref="list">
      <Track v-for="track in items" :key="track.id" :track="track" />
    </ol>
  </section>
</template>

<style scoped>
.playlist {
  width: 320px;
  max-width: 100%;
  padding: 8px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 10px 12px;
}

.title {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.meta {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

ol {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
