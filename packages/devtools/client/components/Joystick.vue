<script setup lang="ts">
  /**
   * A joystick like a mobile game's: a ring, and a knob dragged inside it. The model is
   * where the knob is, `-1…1` per axis (the rim is 1): the farther out, the faster the drag
   * goes. Let go, the knob springs back to the center. The arrow keys move the model too
   * (`ControlPanel.vue`): the knob shows it.
   */
  import { computed, ref, useTemplateRef } from 'vue';

  const vector = defineModel<{ x: number; y: number }>({ required: true });
  defineProps<{ disabled?: boolean }>();

  const RING = 132;
  const KNOB = 46;
  /** How far the knob's center goes from the ring's. */
  const REACH = (RING - KNOB) / 2;

  const ring = useTemplateRef<HTMLElement>('ring');
  const held = ref(false);

  const aim = (event: PointerEvent) => {
    const rect = ring.value!.getBoundingClientRect();
    let x = (event.clientX - rect.left - rect.width / 2) / REACH;
    let y = (event.clientY - rect.top - rect.height / 2) / REACH;
    const length = Math.hypot(x, y);
    if (length > 1) {
      x /= length;
      y /= length;
    }
    vector.value = { x, y };
  };

  const down = (event: PointerEvent) => {
    if (event.button !== 0) return;
    held.value = true;
    ring.value!.setPointerCapture(event.pointerId);
    aim(event);
  };

  const move = (event: PointerEvent) => {
    if (held.value) aim(event);
  };

  const up = () => {
    if (!held.value) return;
    held.value = false;
    vector.value = { x: 0, y: 0 };
  };

  const knob = computed(() => ({
    transform: `translate(${vector.value.x * REACH}px, ${vector.value.y * REACH}px)`,
    transition: held.value ? 'none' : 'transform 0.12s ease-out',
  }));
  const tilt = computed(() => Math.min(Math.hypot(vector.value.x, vector.value.y), 1));
</script>

<template>
  <div
    ref="ring"
    class="ring"
    :class="{ held, disabled }"
    :style="{ width: `${RING}px`, height: `${RING}px`, '--tilt': tilt }"
    role="slider"
    aria-label="Joystick: drag the knob to steer the drag"
    data-testid="joystick"
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up"
    @pointercancel="up"
    @lostpointercapture="up"
  >
    <span class="cross" />
    <span class="knob" data-testid="joystick-knob" :style="{ width: `${KNOB}px`, height: `${KNOB}px`, ...knob }" />
  </div>
</template>

<style scoped>
  .ring {
    position: relative;
    flex: none;
    border-radius: 50%;
    background: radial-gradient(circle, var(--bg-soft) 0 55%, var(--bg-mute) 56% 100%);
    border: 1px solid var(--border);
    box-shadow: inset 0 0 0 calc(var(--tilt) * 4px) var(--accent-soft);
    touch-action: none;
    cursor: grab;
    user-select: none;
  }

  .ring.held {
    cursor: grabbing;
  }

  .ring.disabled {
    opacity: 0.5;
  }

  .cross {
    position: absolute;
    inset: 50% auto auto 50%;
    width: 8px;
    height: 8px;
    margin: -4px;
    border-radius: 50%;
    background: var(--border);
  }

  .knob {
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -23px 0 0 -23px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #6fd3a5, var(--accent) 60%, #2f8a62);
    box-shadow: 0 2px 6px rgb(0 0 0 / 0.3);
    pointer-events: none;
  }
</style>
