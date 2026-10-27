<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider, closestCenter, closestCorners, pointerFirst, pointerWithin, rectIntersection } from '@vue-dnd-kit/core';
import ModifierLab from './ModifierLab.vue';

// Collision detection is the provider's: it picks the target, here one of the two pads.
const COLLISIONS = { pointerFirst, pointerWithin, rectIntersection, closestCenter, closestCorners };
const collision = ref<keyof typeof COLLISIONS>('pointerFirst');
</script>

<template>
  <DnDProvider :collision="COLLISIONS[collision]">
    <div class="demo">
      <code class="call">&lt;DnDProvider :collision="{{ collision }}"&gt;</code>
      <div class="collisions" role="radiogroup" aria-label="collision">
        <label v-for="name in Object.keys(COLLISIONS)" :key="name" :class="{ on: collision === name }">
          <input v-model="collision" type="radio" :value="name" />
          {{ name }}
        </label>
      </div>
      <ModifierLab />
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.collisions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
  max-width: 100%;
  padding: 3px;
  border-radius: 9px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

.call {
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  color: #42b883;
}

label {
  padding: 4px 8px;
  border-radius: 6px;
  font: 11px/1.3 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

label.on {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
  font-weight: 600;
}

label:has(input:focus-visible) {
  outline: 2px solid #42b883;
}

input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
</style>
