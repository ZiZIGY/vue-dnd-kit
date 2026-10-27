<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeDroppable, type Key } from '@vue-dnd-kit/core';
import Piece from './Piece.vue';
import { FURNITURE } from './furniture';

const pieces = ref(FURNITURE.map((piece) => ({ ...piece })));
const inRoom = computed(() => pieces.value.filter((piece) => piece.place === 'room'));
const inStorage = computed(() => pieces.value.filter((piece) => piece.place === 'storage'));
const find = (id: Key) => pieces.value.find((piece) => piece.id === id);
const clamp = (value: number, max: number) => Math.min(Math.max(Math.round(value), 0), max);

const room = useTemplateRef<HTMLElement>('room');
const { isOver: overRoom } = makeDroppable(room, {
  id: 'room',
  // `position` is where the dragged box's top-left corner is in the room: the `left` and
  // `top` that put the piece where it was let go. Clamped here to stay inside the walls.
  onDrop: ({ active, position }) => {
    const piece = find(active.id);
    if (!piece || !position || !room.value) return;
    piece.x = clamp(position.x, room.value.clientWidth - piece.width);
    piece.y = clamp(position.y, room.value.clientHeight - piece.height);
    piece.place = 'room';
  },
});

const storage = useTemplateRef<HTMLElement>('storage');
const { isOver: overStorage } = makeDroppable(storage, {
  id: 'storage',
  onDrop: ({ active }) => {
    const piece = find(active.id);
    if (piece) piece.place = 'storage';
  },
});
</script>

<template>
  <div class="planner">
    <section ref="storage" class="storage" :class="{ over: overStorage }">
      <h4>Storage</h4>
      <div class="shelf">
        <Piece v-for="piece in inStorage" :key="piece.id" :piece="piece" />
      </div>
    </section>
    <section class="plan">
      <h4>Living room <span>{{ inRoom.length }} pieces</span></h4>
      <div ref="room" class="room" :class="{ over: overRoom }">
        <Piece v-for="piece in inRoom" :key="piece.id" :piece="piece" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.planner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

h4 {
  display: flex;
  justify-content: space-between;
  margin: 0 0 10px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h4 span {
  opacity: 0.5;
}

.plan {
  min-width: 0;
  max-width: 100%;
}

.storage {
  box-sizing: border-box;
  width: 168px;
  padding: 12px;
  border: 1.5px dashed color-mix(in srgb, currentColor 16%, transparent);
  border-radius: 14px;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.shelf {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  min-height: 120px;
}

.room {
  position: relative;
  box-sizing: border-box;
  width: 340px;
  max-width: 100%;
  height: 250px;
  border: 6px solid color-mix(in srgb, currentColor 28%, transparent);
  border-radius: 4px;
  /* A 20 px floor grid. */
  background:
    linear-gradient(color-mix(in srgb, currentColor 6%, transparent) 1px, transparent 1px) 0 0 / 20px 20px,
    linear-gradient(90deg, color-mix(in srgb, currentColor 6%, transparent) 1px, transparent 1px) 0 0 / 20px 20px,
    color-mix(in srgb, currentColor 2%, Canvas);
  transition: border-color 0.2s;
}

.room.over {
  border-color: color-mix(in srgb, #42b883 70%, transparent);
}

.storage.over {
  border-color: #42b883;
  background: color-mix(in srgb, #42b883 8%, transparent);
}
</style>
