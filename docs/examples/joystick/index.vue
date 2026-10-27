<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { DnDProvider, keyboardSensor, pointerSensor } from '@vue-dnd-kit/core';
import Party from './Party.vue';
import Gamepad from './Gamepad.vue';
import { createJoystick } from './joystick';

const stage = useTemplateRef<HTMLElement>('stage');
const joystick = createJoystick(() => stage.value);
// The gamepad drives drags next to the mouse, touch and the keyboard.
const sensors = [pointerSensor, keyboardSensor, joystick.sensor];

onMounted(() => {
  const first = stage.value?.querySelector('li');
  if (first) joystick.aim(first);
});
</script>

<template>
  <DnDProvider :sensors="sensors">
    <div ref="stage" class="arcade">
      <Party />
      <Gamepad :joystick="joystick" />
      <span class="cursor" :style="{ left: `${joystick.cursor.value.x}px`, top: `${joystick.cursor.value.y}px` }" />
    </div>
  </DnDProvider>
</template>

<style scoped>
.arcade {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 32px 48px;
  padding: 8px;
}

/* The gamepad's cursor: above everything, never what a hit test finds. */
.cursor {
  position: absolute;
  z-index: 1;
  width: 18px;
  height: 18px;
  margin: -9px 0 0 -9px;
  border: 2px solid #42b883;
  border-radius: 50%;
  background: color-mix(in srgb, #42b883 25%, transparent);
  box-shadow: 0 0 0 4px color-mix(in srgb, #42b883 15%, transparent);
  pointer-events: none;
}
</style>
