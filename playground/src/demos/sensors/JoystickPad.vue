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
    /* The browser's padding: the page's plain-button padding (style.css) makes up for a thinner border. */
    padding: 1px 6px;
    border-radius: var(--ui-radius);
    border: 1px solid var(--ui-border-strong);
    background: var(--ui-surface);
    color: var(--ui-text);
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
    background: linear-gradient(
      to top,
      color-mix(in srgb, var(--ui-primary) 45%, var(--ui-bg)) var(--progress),
      var(--ui-surface) var(--progress)
    );
  }

  .cursor {
    position: fixed;
    width: 14px;
    height: 14px;
    margin: -7px 0 0 -7px;
    border: 2px solid var(--ui-primary);
    border-radius: 50%;
    background: color-mix(in srgb, var(--ui-primary) 20%, transparent);
    /* Never what a hit test finds. */
    pointer-events: none;
    z-index: 2000;
  }
</style>
