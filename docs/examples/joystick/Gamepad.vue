<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import type { Joystick } from './joystick';

const props = defineProps<{ joystick: Joystick }>();
const { status, activation } = useDnD();

// Holding an arrow moves the cursor every frame, like a stick.
const SPEED = 4;
let frame = 0;
const hold = (dx: number, dy: number) => {
  const tick = () => {
    props.joystick.move(dx * SPEED, dy * SPEED);
    frame = requestAnimationFrame(tick);
  };
  stop();
  tick();
};
const stop = () => cancelAnimationFrame(frame);
onBeforeUnmount(stop);

const ARROWS = [
  { name: 'up', dx: 0, dy: -1 },
  { name: 'left', dx: -1, dy: 0 },
  { name: 'right', dx: 1, dy: 0 },
  { name: 'down', dx: 0, dy: 1 },
];

/** A fills while it is held over an item. */
const charge = computed(() => (status.value === 'activating' ? activation.progress.value : 0));
</script>

<template>
  <div class="gamepad">
    <div class="pad">
      <button
        v-for="arrow in ARROWS"
        :key="arrow.name"
        type="button"
        :class="arrow.name"
        :aria-label="`Cursor ${arrow.name}`"
        @pointerdown="hold(arrow.dx, arrow.dy)"
        @pointerup="stop"
        @pointerleave="stop"
        @pointercancel="stop"
      />
      <span class="hub" />
    </div>
    <div class="actions">
      <button
        type="button"
        class="a"
        :style="{ '--charge': charge }"
        aria-label="A: hold to pick up, press to drop"
        @pointerdown="joystick.press"
        @pointerup="joystick.release"
        @pointerleave="joystick.release"
      >
        A
      </button>
      <button type="button" class="b" aria-label="B: cancel" @pointerdown="joystick.cancel">B</button>
    </div>
    <output class="status">{{ status }}</output>
  </div>
</template>

<style scoped>
.gamepad {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 18px 28px;
  padding: 22px 26px 16px;
  border-radius: 40px;
  background: linear-gradient(160deg, color-mix(in srgb, currentColor 10%, Canvas), color-mix(in srgb, currentColor 4%, Canvas));
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, currentColor 12%, transparent),
    0 18px 36px -20px rgb(0 0 0 / 0.6);
  user-select: none;
}

button {
  border: 0;
  color: inherit;
  cursor: pointer;
  touch-action: none;
}

/* The cross: four arms around an empty middle. */
.pad {
  display: grid;
  grid-template: repeat(3, 30px) / repeat(3, 30px);
}

.pad button,
.hub {
  background: color-mix(in srgb, currentColor 22%, Canvas);
  box-shadow: 0 3px 0 color-mix(in srgb, currentColor 30%, Canvas);
}

.hub {
  grid-area: 2 / 2;
}

/* A small arrow on each arm. */
.pad button::after {
  content: '';
  display: block;
  width: 0;
  height: 0;
  margin: auto;
  border: 5px solid transparent;
  opacity: 0.5;
}

.pad .up::after {
  border-top-width: 0;
  border-bottom-color: currentColor;
}

.pad .down::after {
  border-bottom-width: 0;
  border-top-color: currentColor;
}

.pad .left::after {
  border-left-width: 0;
  border-right-color: currentColor;
}

.pad .right::after {
  border-right-width: 0;
  border-left-color: currentColor;
}

.pad button:active {
  translate: 0 2px;
  box-shadow: 0 1px 0 color-mix(in srgb, currentColor 30%, Canvas);
}

.pad .up {
  grid-area: 1 / 2;
  border-radius: 6px 6px 0 0;
}

.pad .left {
  grid-area: 2 / 1;
  border-radius: 6px 0 0 6px;
}

.pad .right {
  grid-area: 2 / 3;
  border-radius: 0 6px 6px 0;
}

.pad .down {
  grid-area: 3 / 2;
  border-radius: 0 0 6px 6px;
}

.actions {
  display: flex;
  gap: 12px;
  padding-top: 18px;
}

.actions .a {
  margin-top: -22px;
}

.a,
.b {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  color: #fff;
  font: 700 15px/1 system-ui, sans-serif;
}

/* The hold fills A from the bottom. */
.a {
  background: linear-gradient(to top, #2f9468 calc(var(--charge) * 100%), #42b883 calc(var(--charge) * 100%));
  box-shadow:
    0 4px 0 #2a7a57,
    0 0 0 calc(var(--charge) * 6px) color-mix(in srgb, #42b883 35%, transparent);
}

.b {
  background: #f43f5e;
  box-shadow: 0 4px 0 #b9233f;
}

.a:active,
.b:active {
  translate: 0 3px;
  box-shadow: 0 1px 0 rgb(0 0 0 / 0.3);
}

.status {
  grid-column: 1 / -1;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  text-align: center;
  opacity: 0.55;
}
</style>
