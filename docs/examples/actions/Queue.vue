<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList, useDnD } from '@vue-dnd-kit/core';
import { useDnDActions } from '@vue-dnd-kit/actions';
import TrackRow from './TrackRow.vue';
import { TRACKS } from './tracks';

const tracks = ref(TRACKS.map((track) => ({ ...track })));
const listRef = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(listRef, { id: 'queue', items: tracks });

const { status } = useDnD();
const { moveItem, startDrag } = useDnDActions();

/** Five moves in a row: each call waits for the one before to land. */
const shuffle = async () => {
  for (const track of [...tracks.value].sort(() => Math.random() - 0.5)) {
    await moveItem(track.id, { index: Math.floor(Math.random() * tracks.value.length) });
  }
};

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** A scripted pointer drag: the last track glides up and lands at the top. */
const play = async () => {
  const last = tracks.value.at(-1)!;
  const from = listRef.value?.querySelector(`[data-id="${last.id}"]`)?.getBoundingClientRect();
  const to = listRef.value?.firstElementChild?.getBoundingClientRect();
  const drag = from && to ? startDrag(last.id, { from: { x: from.x + 60, y: from.y + from.height / 2 } }) : null;
  if (!drag || !from || !to) return;
  for (let step = 1; step <= 12; step++) {
    await drag.moveTo({ x: from.x + 60 + step * 3, y: from.y + from.height / 2 + ((to.y - from.y) * step) / 12 });
    await pause(28);
  }
  await drag.moveTo({ list: 'queue', index: 0 });
  await pause(200);
  await drag.drop();
};
</script>

<template>
  <div class="queue">
    <header>
      <strong>Up next</strong>
      <span class="buttons">
        <button type="button" :disabled="status !== 'idle'" @click="shuffle">Shuffle</button>
        <button type="button" class="primary" :disabled="status !== 'idle'" @click="play">Play a scripted drag</button>
      </span>
    </header>
    <ol ref="list" class="list">
      <TrackRow v-for="(track, index) in items" :key="track.id" :track="track" :index="index" :last="items.length - 1" />
    </ol>
  </div>
</template>

<style scoped>
.queue {
  width: min(460px, 100%);
  padding: 14px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 16px;
  background: Canvas;
}

header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 0 4px 12px;
  font-size: 14px;
}

.buttons {
  display: flex;
  gap: 6px;
}

.buttons button {
  padding: 7px 11px;
  border: 0;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  color: inherit;
  font: 600 12px/1.2 system-ui, sans-serif;
  cursor: pointer;
}

.buttons button.primary {
  background: #42b883;
  color: #fff;
}

.buttons button:disabled {
  opacity: 0.5;
  cursor: default;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
