<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable, type Key } from '@vue-dnd-kit/core';
import Target from './Target.vue';

defineProps<{ ranked: Key[] }>();

// Two pieces of very different sizes: the rect-based functions see the dragged box,
// the pointer-based ones only the pointer.
const pin = useTemplateRef<HTMLElement>('pin');
const card = useTemplateRef<HTMLElement>('card');
makeDraggable(pin, { id: 'pin' });
makeDraggable(card, { id: 'card' });
</script>

<template>
  <div class="desk">
    <div class="pieces">
      <span ref="pin" class="pin" aria-label="Pin" />
      <div ref="card" class="card">Card</div>
    </div>
    <div class="board">
      <Target id="folder" :ranked="ranked" class="folder">
        <!-- Nested: a target inside a target. -->
        <Target id="subfolder" :ranked="ranked" class="subfolder" />
      </Target>
      <Target id="tray" :ranked="ranked" class="tray" />
      <!-- Small, with a gap between them. -->
      <Target id="a" :ranked="ranked" class="a" />
      <Target id="b" :ranked="ranked" class="b" />
      <!-- Overlapping siblings: `front` comes later, so it is on top. -->
      <Target id="back" :ranked="ranked" class="back" />
      <Target id="front" :ranked="ranked" class="front" />
    </div>
  </div>
</template>

<style scoped>
.desk {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
}

.pieces {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
}

.pin {
  width: 22px;
  height: 22px;
  border: 5px solid Canvas;
  border-radius: 50%;
  background: #42b883;
  box-shadow: 0 0 0 1.5px #42b883;
  cursor: grab;
}

.card {
  display: grid;
  place-items: center;
  width: 112px;
  height: 52px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 16%, transparent),
    0 4px 10px -4px rgb(0 0 0 / 0.4);
  font-size: 13px;
  font-weight: 600;
  cursor: grab;
  user-select: none;
}

.pin:focus-visible,
.card:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 3px;
}

.board {
  position: relative;
  flex: none;
  width: min(100%, 360px);
  height: 230px;
}

.folder {
  top: 0;
  left: 0;
  width: 56%;
  height: 58%;
}

.subfolder {
  right: 10px;
  bottom: 10px;
  width: 50%;
  height: 52%;
}

.tray {
  bottom: 0;
  left: 0;
  width: 56%;
  height: 32%;
}

.a,
.b {
  top: 0;
  width: 40px;
  height: 40px;
}

.a {
  left: 64%;
}

.b {
  left: calc(64% + 52px);
}

.back {
  top: 34%;
  left: 64%;
  width: 26%;
  height: 34%;
}

.front {
  top: 52%;
  left: 74%;
  width: 26%;
  height: 48%;
}
</style>
