<script setup lang="ts">
  import { computed } from 'vue';
  import { useDnD } from '@vue-dnd-kit/core';
  import type { Joystick } from './joystick';

  const props = defineProps<{ joystick: Joystick }>();
  const dnd = useDnD();

  const cursorStyle = computed(() => ({
    left: `${props.joystick.cursor.value.x}px`,
    top: `${props.joystick.cursor.value.y}px`,
  }));
  const progress = computed(() => Math.round(dnd.activation.progress.value * 100));

  const arrows = [
    { name: 'up', label: '▲', dx: 0, dy: -1 },
    { name: 'left', label: '◀', dx: -1, dy: 0 },
    { name: 'right', label: '▶', dx: 1, dy: 0 },
    { name: 'down', label: '▼', dx: 0, dy: 1 },
  ];
</script>

<template>
  <div class="pad">
    <div class="arrows">
      <button
        v-for="arrow in arrows"
        :key="arrow.name"
        :class="arrow.name"
        :data-testid="`pad-${arrow.name}`"
        :aria-label="`Cursor ${arrow.name}`"
        @click="joystick.move(arrow.dx, arrow.dy)"
      >
        {{ arrow.label }}
      </button>
    </div>
    <div class="buttons">
      <!-- Hold A to pick up what is under the cursor; press it again to drop. -->
      <button
        class="a"
        data-testid="pad-a"
        :style="{ '--progress': `${progress}%` }"
        @pointerdown="joystick.press"
        @pointerup="joystick.release"
        @pointerleave="joystick.release"
      >
        A
      </button>
      <button
        class="b"
        data-testid="pad-b"
        @click="joystick.cancel()"
      >
        B
      </button>
    </div>
    <p>
      status: <output data-testid="joystick-status">{{ dnd.status.value }}</output>
      <br />
      sensor: <output data-testid="joystick-sensor">{{ dnd.active.value?.sensor ?? '-' }}</output>
    </p>
  </div>
  <div
    class="cursor"
    data-testid="joystick-cursor"
    :style="cursorStyle"
  />
</template>

<style scoped>
  .pad {
    display: flex;
    gap: 24px;
    align-items: center;
    flex-wrap: wrap;
  }

  .arrows {
    display: grid;
    grid-template-areas: '. up .' 'left . right' '. down .';
    gap: 4px;
  }

  .arrows .up {
    grid-area: up;
  }

  .arrows .left {
    grid-area: left;
  }

  .arrows .right {
    grid-area: right;
  }

  .arrows .down {
    grid-area: down;
  }

  button {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    border: 1px solid #9ca3af;
    background: #fff;
    font-size: 16px;
    touch-action: manipulation;
  }

  .buttons {
    display: flex;
    gap: 12px;
  }

  .buttons button {
    border-radius: 50%;
    font-weight: 700;
  }

  /* The hold fills the button. */
  .a {
    background: linear-gradient(to top, #93c5fd var(--progress), #fff var(--progress));
  }

  .cursor {
    position: fixed;
    width: 14px;
    height: 14px;
    margin: -7px 0 0 -7px;
    border: 2px solid #2563eb;
    border-radius: 50%;
    background: rgb(37 99 235 / 0.2);
    /* Never what a hit test finds. */
    pointer-events: none;
    z-index: 2000;
  }
</style>
